import { useEffect, useState, type CSSProperties } from 'react';
import { useAnswerRound } from '../../core/answer-modes/useAnswerRound';
import { useGameSession } from '../../core/game-session/useGameSession';
import { teamColor } from '../../core/teams/teams';
import { AwardButton, GameShell, MatchInfo, ResultOverlay, TeamScore } from '../../components/game/GameShell';
import { TeamSymbol } from '../../components/game/TeamSymbol';
import { Button } from '../../components/ui/Button';
import { canDrop, createConnectFourState, dropDisc, finishConnectFour, passTurn, type ConnectFourState, type Team } from './logic';
import { rulesOf, type ConnectFourSettings } from './settings';
import styles from './ConnectFourGame.module.css';

interface Props {
  settings: ConnectFourSettings;
  onRematch: () => void;
  onSetup: () => void;
  onExit: () => void;
}

const DROP_MS = 560;

export function ConnectFourGame({ settings, onRematch, onSetup, onExit }: Props) {
  const { teams } = settings;
  const rules = rulesOf(settings);
  /** Team allowed to drop a disc right now (after a correct answer). UI state, not part of undo. */
  const [pending, setPending] = useState<Team | null>(null);
  const [arriving, setArriving] = useState(false);
  const session = useGameSession<ConnectFourState>({
    initial: () => createConnectFourState(rules),
    isFinished: (s) => s.finished,
    finish: finishConnectFour,
    timeLimitMinutes: null,
  });
  const { state } = session;
  const round = useAnswerRound(settings, session.halted || pending !== null);
  const alternate = rules.turnMode === 'alternate';

  useEffect(() => {
    if (!arriving) return;
    const id = window.setTimeout(() => setArriving(false), DROP_MS + 700);
    return () => window.clearTimeout(id);
  }, [arriving]);

  const grant = (team: Team) => {
    if (session.busy || session.halted || (alternate && team !== state.turn)) return;
    setPending(team);
    round.endRound();
  };

  const drop = (col: number) => {
    if (pending === null || session.busy || session.halted) return;
    const next = dropDisc(rules, state, col, pending);
    if (next === state) return;
    session.apply(next);
    setPending(null);
    session.lock(DROP_MS);
    if (next.finished) setArriving(true);
  };

  const pass = () => {
    if (session.halted || pending !== null) return;
    session.apply(passTurn(state));
    round.endRound();
  };

  const undoMove = () => {
    if (pending !== null) {
      setPending(null);
      return;
    }
    if (!session.canUndo) return;
    setArriving(false);
    session.undo();
    round.endRound();
  };

  const onDigit = (index: number) => (pending !== null ? drop(index) : index < 2 ? grant(index as Team) : undefined);

  const winner = state.winner === 0 || state.winner === 1 ? teams[state.winner] : null;
  const winSet = new Set(state.winLine?.map(([c, r]) => `${c}-${r}`));
  const placing = pending !== null ? teams[pending] : null;

  return (
    <GameShell
      accent="#E5484D"
      stageLabel="Spielbrett"
      stageClassName={styles.chalkboard}
      round={round}
      teams={teams}
      cardPool={settings.cardPool}
      session={session}
      finished={state.finished && !arriving}
      onUndo={undoMove}
      onExit={onExit}
      shortcuts={{ award: onDigit, digitMax: pending !== null ? rules.cols : 2 }}
      header={
        <>
          <TeamScore team={teams[0]} active={pending === 0 || (alternate && pending === null && state.turn === 0)} />
          <MatchInfo
            clockMs={null}
            target={alternate ? `${teams[state.turn].name} ist an der Reihe` : 'Wer richtig antwortet, setzt'}
            mode={settings.mode}
          />
          <TeamScore team={teams[1]} align="right" active={pending === 1 || (alternate && pending === null && state.turn === 1)} />
        </>
      }
      world={
        <div className={styles.boardWrap} style={{ '--cols': rules.cols, '--rows': rules.rows } as CSSProperties}>
          <div className={styles.hint} aria-live="polite">
            {placing ? (
              <span className={styles.hintTeam} style={{ '--team': teamColor(placing) } as CSSProperties}>
                <TeamSymbol symbol={placing.symbol} /> {placing.name}: Spalte wählen
              </span>
            ) : (
              <span className={styles.hintIdle}>Vier Steine in einer Reihe gewinnen</span>
            )}
          </div>
          <div className={styles.board}>
            {state.board.map((column, col) => {
              const droppable = pending !== null && canDrop(state, col);
              return (
                <button
                  key={col}
                  type="button"
                  className={`${styles.column} ${droppable ? styles.droppable : ''}`}
                  style={placing ? ({ '--team': teamColor(placing) } as CSSProperties) : undefined}
                  disabled={!droppable || session.busy || session.halted}
                  onClick={() => drop(col)}
                  aria-label={`Spalte ${col + 1}${droppable ? '' : ' (nicht wählbar)'}`}
                  title={`Spalte ${col + 1} (Taste ${col + 1})`}
                >
                  <span className={styles.colNumber} aria-hidden="true">
                    {col + 1}
                  </span>
                  {[...column].reverse().map((cell, i) => {
                    const row = rules.rows - 1 - i;
                    const isLast = state.lastDrop?.col === col && state.lastDrop.row === row;
                    const team = cell === null ? null : teams[cell];
                    return (
                      <span key={row} className={styles.cell}>
                        {team && (
                          <span
                            key={isLast ? state.lastDrop!.seq : 'still'}
                            className={`${styles.disc} ${isLast ? styles.dropping : ''} ${winSet.has(`${col}-${row}`) ? styles.winning : ''}`}
                            style={{ '--team': teamColor(team), '--fall': rules.rows - row } as CSSProperties}
                          >
                            <TeamSymbol symbol={team.symbol} />
                          </span>
                        )}
                      </span>
                    );
                  })}
                </button>
              );
            })}
            {state.winLine && !arriving && (
              <svg className={styles.winLine} viewBox={`0 0 ${rules.cols} ${rules.rows}`} preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <filter id="c4-chalk">
                    <feTurbulence type="fractalNoise" baseFrequency="9" numOctaves="2" result="n" />
                    <feDisplacementMap in="SourceGraphic" in2="n" scale="0.06" />
                  </filter>
                </defs>
                <polyline
                  points={state.winLine.map(([c, r]) => `${c + 0.5},${rules.rows - r - 0.5}`).join(' ')}
                  fill="none"
                  stroke="#FFFCF2"
                  strokeOpacity="0.92"
                  strokeWidth="0.16"
                  strokeLinecap="round"
                  filter="url(#c4-chalk)"
                  vectorEffect="non-scaling-stroke"
                  pathLength={100}
                  className={styles.winStroke}
                />
              </svg>
            )}
          </div>
        </div>
      }
      awards={
        pending !== null ? (
          <Button variant="secondary" size="lg" icon="close" onClick={() => setPending(null)}>
            Stein doch nicht setzen
          </Button>
        ) : alternate ? (
          <>
            <AwardButton
              team={teams[state.turn]}
              sub="Richtig · Stein setzen"
              onClick={() => grant(state.turn)}
              disabled={session.busy || session.halted}
              shortcut={String(state.turn + 1)}
            />
            <Button variant="secondary" size="lg" icon="skip" onClick={pass} disabled={session.halted}>
              Weitergeben
            </Button>
          </>
        ) : (
          ([0, 1] as const).map((side) => (
            <AwardButton
              key={side}
              team={teams[side]}
              sub="Richtig · Stein setzen"
              onClick={() => grant(side)}
              disabled={session.busy || session.halted}
              shortcut={String(side + 1)}
            />
          ))
        )
      }
      result={
        <ResultOverlay
          winners={winner ? [winner] : []}
          icon="games"
          title={winner ? `${winner.name} gewinnt!` : 'Unentschieden!'}
          message={
            winner
              ? 'Vier in einer Reihe – stark kombiniert von beiden Mannschaften.'
              : state.board.every((c) => c.every((cell) => cell !== null))
                ? 'Das Brett ist voll – beide Mannschaften haben klug gespielt.'
                : 'Das Spiel wurde ohne vier in einer Reihe beendet.'
          }
          onRematch={onRematch}
          onSetup={onSetup}
          onExit={onExit}
          onUndo={undoMove}
        />
      }
    />
  );
}
