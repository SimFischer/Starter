import { useEffect, useState, type CSSProperties } from 'react';
import { useAnswerRound } from '../../core/answer-modes/useAnswerRound';
import { useGameSession } from '../../core/game-session/useGameSession';
import { teamColor } from '../../core/teams/teams';
import { Confetti } from '../../components/game/Confetti';
import { AwardButton, GameShell, MatchInfo, ResultOverlay, TeamScore, gameShellStyles } from '../../components/game/GameShell';
import { TeamSymbol } from '../../components/game/TeamSymbol';
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

export function FootballGame({ settings, onRematch, onSetup, onExit }: Props) {
  const { teams, rules } = settings;
  const [goalAnim, setGoalAnim] = useState<GoalAnim | null>(null);
  const session = useGameSession<FootballState>({
    initial: createFootballState,
    isFinished: (s) => s.finished,
    finish: finishGame,
    timeLimitMinutes: settings.timeLimitMinutes,
    extraHalt: goalAnim !== null,
  });
  const { state } = session;
  const round = useAnswerRound(settings, session.halted);

  // Goal sequence: ball travels into the net, then the celebration, then back to kick-off.
  useEffect(() => {
    if (!goalAnim) return;
    const id = window.setTimeout(
      () => setGoalAnim((g) => (g && g.seq === goalAnim.seq ? (g.stage === 'travel' ? { ...g, stage: 'party' } : null) : g)),
      goalAnim.stage === 'travel' ? MOVE_MS : PARTY_MS,
    );
    return () => window.clearTimeout(id);
  }, [goalAnim]);

  const award = (team: number) => {
    if (session.busy || session.halted || (team !== 0 && team !== 1)) return;
    const next = awardMove(rules, state, team);
    if (next === state) return;
    session.apply(next);
    round.endRound();
    session.lock(MOVE_MS);
    if (next.goalEvent) setGoalAnim({ ...next.goalEvent, stage: 'travel' });
  };

  const undoMove = () => {
    if (!session.canUndo) return;
    setGoalAnim(null);
    session.undo();
    round.endRound();
  };

  const skipCelebration = () => setGoalAnim(null);

  // Goal mouth sits at x = 95 % (1520/1600), i.e. 1.2 × fieldsPerSide in position units.
  const displayBall = goalAnim ? (goalAnim.team === 0 ? 1 : -1) * rules.fieldsPerSide * 1.2 : state.ball;
  const positions = Array.from({ length: rules.fieldsPerSide * 2 + 1 }, (_, i) => i - rules.fieldsPerSide);
  const steps = rules.stepsPerAward;
  const scoringTeam = goalAnim ? teams[goalAnim.team] : null;
  const winner = state.winner === 0 || state.winner === 1 ? teams[state.winner] : null;
  const target = rules.goalsToWin
    ? `${rules.goalsToWin} ${rules.goalsToWin === 1 ? 'Tor' : 'Tore'} zum Sieg`
    : settings.timeLimitMinutes
      ? 'Ende nach Ablauf der Zeit'
      : 'Freies Spiel';

  return (
    <GameShell
      accent="#2fbf71"
      stageLabel="Spielfeld"
      stageClassName={styles.stadium}
      round={round}
      teams={teams}
      cardPool={settings.cardPool}
      session={session}
      finished={state.finished && !goalAnim}
      onUndo={undoMove}
      onExit={onExit}
      shortcuts={{ award, arrows: { right: 0, left: 1 }, ...(goalAnim?.stage === 'party' ? { skip: skipCelebration } : {}) }}
      header={
        <>
          <TeamScore team={teams[0]} value={state.score[0]} valueLabel={`${teams[0].name}: ${state.score[0]} Tore`} highlight={goalAnim?.team === 0} />
          <MatchInfo clockMs={settings.timeLimitMinutes ? session.clock.remaining : null} target={target} mode={settings.mode} />
          <TeamScore team={teams[1]} value={state.score[1]} valueLabel={`${teams[1].name}: ${state.score[1]} Tore`} align="right" highlight={goalAnim?.team === 1} />
        </>
      }
      world={
        <div className={styles.pitchBox} style={{ '--ball-x': `${ballX(displayBall, rules.fieldsPerSide)}%`, '--roll': `${displayBall * 200}deg` } as CSSProperties}>
          <Pitch teams={teams} netShake={goalAnim?.stage === 'party' ? (goalAnim.team === 0 ? 1 : 0) : null} />
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
      }
      celebration={
        goalAnim?.stage === 'party' && scoringTeam ? (
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
        ) : null
      }
      awards={([0, 1] as const).map((side) => (
        <AwardButton
          key={side}
          team={teams[side]}
          sub={`Richtig · +${steps} ${steps === 1 ? 'Feld' : 'Felder'}`}
          onClick={() => award(side)}
          disabled={session.busy || session.halted}
          arrow={side === 0 ? 'right' : 'left'}
          shortcut={side === 0 ? '→ oder 1' : '← oder 2'}
        />
      ))}
      result={
        <ResultOverlay
          winners={winner ? [winner] : []}
          title={winner ? `${winner.name} gewinnt!` : 'Unentschieden!'}
          message={winner ? 'Stark gespielt – von beiden Mannschaften.' : 'Beide Mannschaften waren gleich stark.'}
          onRematch={onRematch}
          onSetup={onSetup}
          onExit={onExit}
          onUndo={undoMove}
        >
          <span className={gameShellStyles.finalScore}>
            <span>{teams[0].name}</span>
            <strong>
              {state.score[0]} : {state.score[1]}
            </strong>
            <span>{teams[1].name}</span>
          </span>
        </ResultOverlay>
      }
    />
  );
}
