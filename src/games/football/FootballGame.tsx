import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { ANSWER_MODES } from '../../core/answer-modes/answerModes';
import { useAnswerRound } from '../../core/answer-modes/useAnswerRound';
import { canUndo, commit, createHistory, undo, type History } from '../../core/game-session/history';
import { teamColor, type TeamConfig } from '../../core/teams/teams';
import { useFullscreen } from '../../hooks/useFullscreen';
import { useCountdown } from '../../hooks/useCountdown';
import { Confetti } from '../../components/game/Confetti';
import { RoundControls } from '../../components/game/RoundControls';
import { RoundStage } from '../../components/game/RoundStage';
import { TeamSymbol } from '../../components/game/TeamSymbol';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/Dialog';
import { Icon } from '../../components/ui/Icon';
import { awardMove, createFootballState, finishGame, type FootballState, type Side } from './logic';
import { Pitch } from './Pitch';
import type { FootballSettings } from './settings';
import styles from './FootballGame.module.css';

interface Props {
  settings: FootballSettings;
  onRematch: () => void;
  onSetup: () => void;
  onExit: () => void;
}

/** Ball travel time; inputs are briefly locked so a double tap cannot award twice. */
const MOVE_MS = 650;
const PARTY_MS = 2600;

type GoalAnim = { team: Side; seq: number; stage: 'travel' | 'party' };

/** Horizontal ball position in % of the pitch width (pitch artwork 1600×700). */
function ballX(position: number, fieldsPerSide: number): number {
  return 50 + (position * 37.5) / fieldsPerSide;
}

function formatClock(ms: number): string {
  const total = Math.ceil(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

function isTyping(target: EventTarget | null) {
  return target instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

export function FootballGame({ settings, onRematch, onSetup, onExit }: Props) {
  const { teams, rules } = settings;
  const [history, setHistory] = useState<History<FootballState>>(() => createHistory(createFootballState()));
  const [paused, setPaused] = useState(false);
  const [goalAnim, setGoalAnim] = useState<GoalAnim | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const busyTimer = useRef(0);
  const fullscreen = useFullscreen();

  const state = history.present;
  const halted = paused || state.finished || goalAnim !== null;
  const round = useAnswerRound(
    { mode: settings.mode, thinkSeconds: settings.thinkSeconds, consultSeconds: settings.consultSeconds, cardPool: settings.cardPool },
    halted,
  );

  const onTimeUp = useCallback(() => setHistory((h) => commit(h, finishGame(h.present))), []);
  const clock = useCountdown(halted, onTimeUp);
  const { start: startClock } = clock;
  useEffect(() => {
    if (settings.timeLimitMinutes) startClock(settings.timeLimitMinutes * 60_000);
  }, [settings.timeLimitMinutes, startClock]);

  // Goal sequence: ball travels into the net, then the celebration, then back to kick-off.
  useEffect(() => {
    if (!goalAnim) return;
    const id = window.setTimeout(
      () => setGoalAnim((g) => (g && g.seq === goalAnim.seq ? (g.stage === 'travel' ? { ...g, stage: 'party' } : null) : g)),
      goalAnim.stage === 'travel' ? MOVE_MS : PARTY_MS,
    );
    return () => window.clearTimeout(id);
  }, [goalAnim]);

  useEffect(() => () => window.clearTimeout(busyTimer.current), []);

  const lock = () => {
    setBusy(true);
    window.clearTimeout(busyTimer.current);
    busyTimer.current = window.setTimeout(() => setBusy(false), MOVE_MS);
  };

  const award = (team: Side) => {
    if (busy || halted) return;
    const next = awardMove(rules, state, team);
    if (next === state) return;
    setHistory((h) => commit(h, next));
    round.endRound();
    lock();
    if (next.goalEvent) setGoalAnim({ ...next.goalEvent, stage: 'travel' });
  };

  const undoMove = () => {
    if (!canUndo(history)) return;
    setGoalAnim(null);
    setHistory(undo);
    round.endRound();
  };

  const skipCelebration = () => setGoalAnim(null);

  // Keyboard: ←/→ or 1/2 award, Space next round step, P/Esc pause, Backspace/Ctrl+Z undo.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.altKey || e.metaKey || isTyping(e.target) || document.querySelector('dialog[open]')) return;
      const key = e.key;
      if ((e.ctrlKey && key.toLowerCase() === 'z') || key === 'Backspace') {
        e.preventDefault();
        undoMove();
        return;
      }
      if (e.ctrlKey) return;
      if (goalAnim?.stage === 'party' && key !== 'p' && key !== 'P') {
        skipCelebration();
        return;
      }
      if (key === 'p' || key === 'P' || key === 'Escape') {
        if (!state.finished) setPaused((p) => !p);
      } else if (paused || state.finished) {
        return;
      } else if (key === 'ArrowRight' || key === '1') {
        e.preventDefault();
        award(0);
      } else if (key === 'ArrowLeft' || key === '2') {
        e.preventDefault();
        award(1);
      } else if (key === ' ') {
        e.preventDefault();
        round.primary?.run();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // Goal mouth sits at x = 95 % (1520/1600), i.e. 1.2 × fieldsPerSide in position units.
  const displayBall = goalAnim ? (goalAnim.team === 0 ? 1 : -1) * rules.fieldsPerSide * 1.2 : state.ball;
  const positions = Array.from({ length: rules.fieldsPerSide * 2 + 1 }, (_, i) => i - rules.fieldsPerSide);
  const steps = rules.stepsPerAward;
  const scoringTeam = goalAnim ? teams[goalAnim.team] : null;

  return (
    <div className={styles.screen} style={{ '--ball-x': `${ballX(displayBall, rules.fieldsPerSide)}%`, '--roll': `${displayBall * 200}deg` } as CSSProperties}>
      <header className={styles.scoreboard}>
        <TeamScore team={teams[0]} score={state.score[0]} side={0} highlight={goalAnim?.team === 0} />
        <div className={styles.matchInfo}>
          {settings.timeLimitMinutes ? (
            <span className={styles.clock} aria-label="Restzeit">
              <Icon name="timer" /> {formatClock(clock.remaining)}
            </span>
          ) : null}
          <span className={styles.target}>
            {rules.goalsToWin
              ? `${rules.goalsToWin} ${rules.goalsToWin === 1 ? 'Tor' : 'Tore'} zum Sieg`
              : settings.timeLimitMinutes
                ? 'Ende nach Ablauf der Zeit'
                : 'Freies Spiel'}
          </span>
          <span className={styles.modeLabel}>{ANSWER_MODES[settings.mode].label}</span>
        </div>
        <TeamScore team={teams[1]} score={state.score[1]} side={1} highlight={goalAnim?.team === 1} />
      </header>

      <main className={styles.stage} id="main" tabIndex={-1} aria-label="Spielfeld">
        <div className={styles.pitchBox}>
          <Pitch teams={teams} netShake={goalAnim?.stage === 'party' ? goalAnim.team === 0 ? 1 : 0 : null} />
          <ol className={styles.track} aria-label="Spielfeldpositionen">
            {positions.map((p) => (
              <li
                key={p}
                className={`${styles.marker} ${p === state.ball && !goalAnim ? styles.markerActive : ''} ${p === 0 ? styles.markerCenter : ''}`}
                style={{ left: `${ballX(p, rules.fieldsPerSide)}%` }}
              >
                <span className="visually-hidden">{p === state.ball ? 'Ball hier' : ''}</span>
              </li>
            ))}
          </ol>
          <div className={`${styles.ball} ${goalAnim ? styles.ballInGoal : ''}`} aria-hidden="true">
            <span className={styles.ballShadow} />
            <svg viewBox="0 0 64 64" className={styles.ballSvg}>
              <circle cx="32" cy="32" r="30" fill="#F7F8FB" />
              <path d="M32 20l11 8-4.2 13H25.2L21 28z" fill="#1B2940" />
              <path d="M32 20V6M43 28l13-5M38.8 41l8 11M25.2 41l-8 11M21 28L8 23" stroke="#1B2940" strokeWidth="3" />
              <circle cx="32" cy="32" r="30" fill="none" stroke="#1B2940" strokeOpacity="0.25" strokeWidth="2" />
            </svg>
          </div>
          <div className={styles.direction} aria-hidden="true">
            <span style={{ '--team': teamColor(teams[0]) } as CSSProperties}>
              <TeamSymbol symbol={teams[0].symbol} /> {teams[0].name} <Icon name="arrowRight" />
            </span>
            <span style={{ '--team': teamColor(teams[1]) } as CSSProperties}>
              <Icon name="arrowLeft" /> {teams[1].name} <TeamSymbol symbol={teams[1].symbol} />
            </span>
          </div>
        </div>

        <RoundStage round={round} teams={teams} cardSystem={settings.cardPool.system} />

        {goalAnim?.stage === 'party' && scoringTeam && (
          <button type="button" className={styles.goalParty} onClick={skipCelebration} aria-label="Torjubel überspringen">
            <Confetti colors={[teamColor(scoringTeam), '#F6D994', '#F4F6FA']} />
            <span className={styles.goalWord}>Tor!</span>
            <span className={styles.goalTeam} style={{ '--team': teamColor(scoringTeam) } as CSSProperties}>
              <TeamSymbol symbol={scoringTeam.symbol} /> {scoringTeam.name}
            </span>
            <span className={styles.goalScore}>
              {state.score[0]} : {state.score[1]}
            </span>
          </button>
        )}

        {paused && !state.finished && (
          <div className={styles.overlay}>
            <div className={styles.overlayPanel}>
              <span className={styles.overlayTitle}>Pause</span>
              <p>Die Zeit ist angehalten.</p>
              <Button variant="primary" size="lg" icon="play" onClick={() => setPaused(false)} autoFocus>
                Weiterspielen
              </Button>
            </div>
          </div>
        )}

        {state.finished && !goalAnim && (
          <ResultOverlay
            state={state}
            teams={teams}
            onRematch={onRematch}
            onSetup={onSetup}
            onExit={onExit}
            onUndo={undoMove}
          />
        )}
      </main>

      <footer className={styles.controlBar}>
        <div className={styles.roundArea}>
          <RoundControls round={round} cardPool={settings.cardPool} disabled={halted} />
        </div>
        <div className={styles.awards}>
          {([0, 1] as const).map((side) => (
            <button
              key={side}
              type="button"
              className={styles.award}
              style={{ '--team': teamColor(teams[side]) } as CSSProperties}
              onClick={() => award(side)}
              disabled={busy || halted}
              aria-keyshortcuts={side === 0 ? 'ArrowRight 1' : 'ArrowLeft 2'}
              title={side === 0 ? 'Pfeil rechts oder 1' : 'Pfeil links oder 2'}
            >
              {side === 1 && <Icon name="arrowLeft" className={styles.awardArrow} />}
              <TeamSymbol symbol={teams[side].symbol} className={styles.awardSymbol} />
              <span className={styles.awardText}>
                <span className={styles.awardName}>{teams[side].name}</span>
                <span className={styles.awardSub}>
                  Richtig · +{steps} {steps === 1 ? 'Feld' : 'Felder'}
                </span>
              </span>
              {side === 0 && <Icon name="arrowRight" className={styles.awardArrow} />}
            </button>
          ))}
        </div>
        <div className={styles.utility}>
          <Button variant="secondary" icon="undo" onClick={undoMove} disabled={!canUndo(history)} title="Rückgängig (Rücktaste)">
            Rückgängig
          </Button>
          <Button variant="secondary" icon={paused ? 'play' : 'pause'} iconOnly onClick={() => setPaused((p) => !p)} disabled={state.finished}>
            {paused ? 'Weiterspielen (P)' : 'Pause (P)'}
          </Button>
          <Button variant="secondary" icon={fullscreen.active ? 'compress' : 'expand'} iconOnly onClick={fullscreen.toggle} disabled={!fullscreen.supported}>
            {fullscreen.active ? 'Vollbild beenden (F)' : 'Vollbild (F)'}
          </Button>
          <Button variant="secondary" icon="flag" iconOnly onClick={() => (state.finished ? onExit() : setConfirmEnd(true))}>
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
          setPaused(false);
          round.endRound();
          setHistory((h) => commit(h, finishGame(h.present)));
        }}
      />
    </div>
  );
}

function TeamScore({ team, score, side, highlight }: { team: TeamConfig; score: number; side: Side; highlight: boolean }) {
  return (
    <div
      className={`${styles.teamScore} ${side ? styles.teamRight : ''} ${highlight ? styles.teamScored : ''}`}
      style={{ '--team': teamColor(team) } as CSSProperties}
    >
      <span className={styles.teamBadge}>
        <TeamSymbol symbol={team.symbol} />
      </span>
      <span className={styles.teamName}>{team.name}</span>
      <span key={score} className={styles.score} aria-label={`${team.name}: ${score} Tore`}>
        {score}
      </span>
    </div>
  );
}

function ResultOverlay({
  state,
  teams,
  onRematch,
  onSetup,
  onExit,
  onUndo,
}: {
  state: FootballState;
  teams: readonly [TeamConfig, TeamConfig];
  onRematch: () => void;
  onSetup: () => void;
  onExit: () => void;
  onUndo: () => void;
}) {
  const winner = state.winner === 0 || state.winner === 1 ? teams[state.winner] : null;
  return (
    <div className={styles.overlay}>
      {winner && <Confetti colors={[teamColor(winner), '#F6D994', '#F4F6FA']} count={90} />}
      <div className={`${styles.overlayPanel} ${styles.resultPanel}`} style={winner ? ({ '--team': teamColor(winner) } as CSSProperties) : undefined}>
        {winner ? (
          <>
            <span className={styles.trophy} aria-hidden="true">
              <TeamSymbol symbol={winner.symbol} />
            </span>
            <span className={styles.overlayTitle}>{winner.name} gewinnt!</span>
          </>
        ) : (
          <span className={styles.overlayTitle}>Unentschieden!</span>
        )}
        <span className={styles.finalScore}>
          <span>{teams[0].name}</span>
          <strong>
            {state.score[0]} : {state.score[1]}
          </strong>
          <span>{teams[1].name}</span>
        </span>
        <p>{winner ? 'Stark gespielt – von beiden Mannschaften.' : 'Beide Mannschaften waren gleich stark.'}</p>
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
