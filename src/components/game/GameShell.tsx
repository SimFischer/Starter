import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ANSWER_MODES } from '../../core/answer-modes/answerModes';
import type { CardPoolConfig } from '../../core/answer-modes/cardPool';
import type { AnswerRound } from '../../core/answer-modes/useAnswerRound';
import { formatClock, type GameSession } from '../../core/game-session/useGameSession';
import { teamColor, type TeamConfig } from '../../core/teams/teams';
import { useFullscreen } from '../../hooks/useFullscreen';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/Dialog';
import { Icon, type IconName } from '../ui/Icon';
import { Confetti } from './Confetti';
import { RoundControls } from './RoundControls';
import { RoundStage } from './RoundStage';
import { TeamSymbol } from './TeamSymbol';
import styles from './GameShell.module.css';

type ShellSession = Pick<GameSession<unknown>, 'paused' | 'setPaused' | 'canUndo' | 'halted' | 'endGame' | 'busy'>;

interface Props {
  accent: string;
  /** Scoreboard content (top bar). */
  header: ReactNode;
  /** The game world inside the stage. */
  world: ReactNode;
  stageClassName?: string | undefined;
  stageLabel: string;
  round: AnswerRound;
  teams: readonly TeamConfig[];
  cardPool: CardPoolConfig;
  session: ShellSession;
  finished: boolean;
  /** Award buttons (or game-specific actions) in the control bar. */
  awards: ReactNode;
  /** Overlay inside the stage, e.g. a goal celebration. */
  celebration?: ReactNode;
  /** Shown when the game is finished. */
  result?: ReactNode;
  onUndo: () => void;
  onExit: () => void;
  /** Keyboard: digit n awards team n-1; optional arrow mapping; skip celebration on any key. */
  shortcuts: {
    award?: (index: number) => void;
    /** Highest digit forwarded to `award` (default: number of teams). */
    digitMax?: number;
    arrows?: { left: number; right: number };
    skip?: () => void;
  };
}

function isTyping(target: EventTarget | null) {
  return target instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

/**
 * Shared screen for all team games: scoreboard, stage with round overlays,
 * teacher control bar (round flow, awards, undo, pause, fullscreen, end),
 * pause overlay, end confirmation and keyboard shortcuts.
 */
export function GameShell(props: Props) {
  const { round, session, finished, shortcuts, onUndo } = props;
  const [confirmEnd, setConfirmEnd] = useState(false);
  const fullscreen = useFullscreen();
  const keyHandler = useRef<(e: KeyboardEvent) => void>(() => {});

  keyHandler.current = (e: KeyboardEvent) => {
    if (e.repeat || e.altKey || e.metaKey || isTyping(e.target) || document.querySelector('dialog[open]')) return;
    const key = e.key;
    if ((e.ctrlKey && key.toLowerCase() === 'z') || key === 'Backspace') {
      e.preventDefault();
      onUndo();
      return;
    }
    if (e.ctrlKey) return;
    const isPause = key === 'p' || key === 'P' || key === 'Escape';
    if (shortcuts.skip && !isPause) {
      shortcuts.skip();
      return;
    }
    if (isPause) {
      if (!finished) session.setPaused((p) => !p);
      return;
    }
    if (session.halted) return;
    const digit = Number(key);
    if (shortcuts.award && digit >= 1 && digit <= (shortcuts.digitMax ?? props.teams.length)) {
      e.preventDefault();
      shortcuts.award(digit - 1);
    } else if (shortcuts.award && shortcuts.arrows && (key === 'ArrowRight' || key === 'ArrowLeft')) {
      e.preventDefault();
      shortcuts.award(key === 'ArrowRight' ? shortcuts.arrows.right : shortcuts.arrows.left);
    } else if (key === ' ') {
      e.preventDefault();
      round.primary?.run();
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => keyHandler.current(e);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className={styles.screen} style={{ '--accent': props.accent } as CSSProperties}>
      <header className={styles.scoreboard}>{props.header}</header>

      <main className={`${styles.stage} ${props.stageClassName ?? ''}`} id="main" tabIndex={-1} aria-label={props.stageLabel}>
        {props.world}
        <RoundStage round={round} teams={props.teams} cardSystem={props.cardPool.system} />
        {props.celebration}
        {session.paused && !finished && (
          <div className={styles.overlay}>
            <div className={styles.overlayPanel}>
              <span className={styles.overlayTitle}>Pause</span>
              <p>Die Zeit ist angehalten.</p>
              <Button variant="primary" size="lg" icon="play" onClick={() => session.setPaused(false)} autoFocus>
                Weiterspielen
              </Button>
            </div>
          </div>
        )}
        {finished && props.result}
      </main>

      <footer className={styles.controlBar}>
        <div className={styles.roundArea}>
          <RoundControls round={round} cardPool={props.cardPool} disabled={session.halted} />
        </div>
        <div className={styles.awards}>{props.awards}</div>
        <div className={styles.utility}>
          <Button variant="secondary" icon="undo" onClick={onUndo} disabled={!session.canUndo} title="Rückgängig (Rücktaste)">
            Rückgängig
          </Button>
          <Button variant="secondary" icon={session.paused ? 'play' : 'pause'} iconOnly onClick={() => session.setPaused((p) => !p)} disabled={finished}>
            {session.paused ? 'Weiterspielen (P)' : 'Pause (P)'}
          </Button>
          <Button variant="secondary" icon={fullscreen.active ? 'compress' : 'expand'} iconOnly onClick={fullscreen.toggle} disabled={!fullscreen.supported}>
            {fullscreen.active ? 'Vollbild beenden (F)' : 'Vollbild (F)'}
          </Button>
          <Button variant="secondary" icon="flag" iconOnly onClick={() => (finished ? props.onExit() : setConfirmEnd(true))}>
            Spiel beenden
          </Button>
        </div>
      </footer>

      <ConfirmDialog
        open={confirmEnd}
        title="Spiel beenden?"
        message="Der aktuelle Spielstand wird als Endstand angezeigt. Mit „Rückgängig“ lässt sich das Ende wieder aufheben."
        confirmLabel="Spiel beenden"
        tone="primary"
        onCancel={() => setConfirmEnd(false)}
        onConfirm={() => {
          setConfirmEnd(false);
          session.setPaused(false);
          round.endRound();
          session.endGame();
        }}
      />
    </div>
  );
}

/** Centre of the scoreboard: clock, goal of the game, answer mode. */
export function MatchInfo({ clockMs, target, mode }: { clockMs: number | null; target: string; mode: keyof typeof ANSWER_MODES }) {
  return (
    <div className={styles.matchInfo}>
      {clockMs !== null && (
        <span className={styles.clock} aria-label="Restzeit">
          <Icon name="timer" /> {formatClock(clockMs)}
        </span>
      )}
      <span className={styles.target}>{target}</span>
      <span className={styles.modeLabel}>{ANSWER_MODES[mode].label}</span>
    </div>
  );
}

/** Team badge + name + value (score, progress …) for the scoreboard. */
export function TeamScore({
  team,
  value,
  valueLabel,
  align = 'left',
  highlight = false,
  active = false,
}: {
  team: TeamConfig;
  value?: ReactNode;
  valueLabel?: string;
  align?: 'left' | 'right';
  highlight?: boolean;
  active?: boolean;
}) {
  return (
    <div
      className={`${styles.teamScore} ${align === 'right' ? styles.teamRight : ''} ${highlight ? styles.teamScored : ''} ${active ? styles.teamActive : ''}`}
      style={{ '--team': teamColor(team) } as CSSProperties}
    >
      <span className={styles.teamBadge}>
        <TeamSymbol symbol={team.symbol} />
      </span>
      <span className={styles.teamName}>{team.name}</span>
      {value !== undefined && (
        <span key={String(value)} className={styles.score} aria-label={valueLabel}>
          {value}
        </span>
      )}
    </div>
  );
}

/** Large team-coloured award button. */
export function AwardButton({
  team,
  sub,
  onClick,
  disabled,
  arrow,
  shortcut,
  compact = false,
}: {
  team: TeamConfig;
  sub: string;
  onClick: () => void;
  disabled: boolean;
  arrow?: 'left' | 'right' | undefined;
  shortcut: string;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      className={`${styles.award} ${compact ? styles.awardCompact : ''}`}
      style={{ '--team': teamColor(team) } as CSSProperties}
      onClick={onClick}
      disabled={disabled}
      title={`Taste ${shortcut}`}
    >
      {arrow === 'left' && <Icon name="arrowLeft" className={styles.awardArrow} />}
      <TeamSymbol symbol={team.symbol} className={styles.awardSymbol} />
      <span className={styles.awardText}>
        <span className={styles.awardName}>{team.name}</span>
        <span className={styles.awardSub}>{sub}</span>
      </span>
      {arrow === 'right' && <Icon name="arrowRight" className={styles.awardArrow} />}
    </button>
  );
}

/** Final screen: winner(s) or draw, result line, rematch / setup / exit, undo. */
export function ResultOverlay({
  winners,
  title,
  children,
  message,
  onRematch,
  onSetup,
  onExit,
  onUndo,
  icon,
}: {
  winners: readonly TeamConfig[];
  title: string;
  children?: ReactNode;
  message: string;
  onRematch: () => void;
  onSetup: () => void;
  onExit: () => void;
  onUndo: () => void;
  icon?: IconName;
}) {
  const lead = winners[0];
  return (
    <div className={styles.overlay}>
      {lead && <Confetti colors={[...winners.map(teamColor), '#F6D994', '#F4F6FA']} count={90} />}
      <div className={`${styles.overlayPanel} ${styles.resultPanel}`} style={lead ? ({ '--team': teamColor(lead) } as CSSProperties) : undefined}>
        {lead && (
          <span className={styles.trophies} aria-hidden="true">
            {winners.map((w) => (
              <span key={w.symbol} className={styles.trophy} style={{ '--team': teamColor(w) } as CSSProperties}>
                <TeamSymbol symbol={w.symbol} />
              </span>
            ))}
          </span>
        )}
        {!lead && icon && <Icon name={icon} className={styles.resultIcon} />}
        <span className={styles.overlayTitle}>{title}</span>
        {children}
        <p>{message}</p>
        <div className={styles.resultActions}>
          <Button variant="primary" size="lg" icon="play" onClick={onRematch} autoFocus>
            Revanche
          </Button>
          <Button variant="secondary" size="lg" icon="settings" onClick={onSetup}>
            Einstellungen
          </Button>
          <Button variant="secondary" size="lg" icon="games" onClick={onExit}>
            Spielesammlung
          </Button>
        </div>
        <Button variant="ghost" icon="undo" onClick={onUndo}>
          Letzten Spielzug rückgängig machen
        </Button>
      </div>
    </div>
  );
}

export { styles as gameShellStyles };
