import { useEffect, useState, type CSSProperties } from 'react';
import { useAnswerRound } from '../../core/answer-modes/useAnswerRound';
import { useGameSession } from '../../core/game-session/useGameSession';
import { teamColor } from '../../core/teams/teams';
import { AwardButton, GameShell, MatchInfo, ResultOverlay } from '../../components/game/GameShell';
import { TeamSymbol } from '../../components/game/TeamSymbol';
import { HORSE_PATH } from './Illustration';
import { advanceHorse, createRaceState, finishRace, leaders, placements, type HorseRaceState } from './logic';
import { RaceScenery } from './RaceScenery';
import type { HorseRaceSettings } from './settings';
import styles from './HorseRaceGame.module.css';

interface Props {
  settings: HorseRaceSettings;
  onRematch: () => void;
  onSetup: () => void;
  onExit: () => void;
}

const GALLOP_MS = 900;
/** Coat colours per lane – teams are told apart by saddle cloth colour + symbol. */
const COATS = ['#6B3F22', '#2F221A', '#8A5A32', '#4A3020'];

export function HorseRaceGame({ settings, onRematch, onSetup, onExit }: Props) {
  const { teams, rules } = settings;
  const [bonus, setBonus] = useState(false);
  const [arriving, setArriving] = useState(false);
  const session = useGameSession<HorseRaceState>({
    initial: () => createRaceState(teams.length),
    isFinished: (s) => s.finished,
    finish: finishRace,
    timeLimitMinutes: settings.timeLimitMinutes,
  });
  const { state } = session;
  const round = useAnswerRound(settings, session.halted);

  // Let the winning horse cross the line before the result appears.
  useEffect(() => {
    if (!arriving) return;
    const id = window.setTimeout(() => setArriving(false), GALLOP_MS + 200);
    return () => window.clearTimeout(id);
  }, [arriving]);

  const steps = rules.stepsPerAward * (bonus ? 2 : 1);

  const award = (team: number) => {
    if (session.busy || session.halted) return;
    const next = advanceHorse(rules, state, team, steps);
    if (next === state) return;
    session.apply(next);
    round.endRound();
    setBonus(false);
    session.lock(GALLOP_MS);
    if (next.finished) setArriving(true);
  };

  const undoMove = () => {
    if (!session.canUndo) return;
    setArriving(false);
    session.undo();
    round.endRound();
  };

  const places = placements(state.progress);
  const top = leaders(state.progress);
  const winners = top.map((i) => teams[i]!);
  const leaderText =
    state.moves === 0 ? 'Alle am Start' : top.length === 1 ? `In Führung: ${teams[top[0]!]!.name}` : 'Kopf-an-Kopf-Rennen';
  const ranking = teams.map((team, i) => ({ team, place: places[i]!, progress: state.progress[i]! })).sort((a, b) => a.place - b.place);

  return (
    <GameShell
      accent="#E0A040"
      stageLabel="Rennbahn"
      round={round}
      teams={teams}
      cardPool={settings.cardPool}
      session={session}
      finished={state.finished && !arriving}
      onUndo={undoMove}
      onExit={onExit}
      shortcuts={{ award }}
      header={
        <>
          <div className={styles.headerTitle}>
            <span className={styles.eyebrow}>Pferderennen</span>
            <span className={styles.leader}>{leaderText}</span>
          </div>
          <MatchInfo
            clockMs={settings.timeLimitMinutes ? session.clock.remaining : null}
            target={`Ziel nach ${rules.trackLength} Etappen`}
            mode={settings.mode}
          />
          <div />
        </>
      }
      world={
        <div className={styles.race}>
          <div className={styles.scenery}>
            <RaceScenery />
          </div>
          <ol className={styles.lanes} style={{ '--lanes': teams.length } as CSSProperties} aria-label="Rennbahnen">
            {teams.map((team, i) => {
              const progress = state.progress[i]!;
              const moving = state.lastMove?.team === i;
              return (
                <li key={i} className={styles.lane} style={{ '--team': teamColor(team) } as CSSProperties}>
                  <div className={styles.label}>
                    <span className={styles.badge}>
                      <TeamSymbol symbol={team.symbol} />
                    </span>
                    <span className={styles.name}>{team.name}</span>
                    <span className={styles.progress} aria-label={`${progress} von ${rules.trackLength} Etappen`}>
                      {state.finished && !arriving ? `${places[i]}. Platz` : `${progress} / ${rules.trackLength}`}
                    </span>
                  </div>
                  <div className={styles.run}>
                    <div className={styles.runInner}>
                      {Array.from({ length: rules.trackLength - 1 }, (_, s) => (
                        <span key={s} className={styles.tick} style={{ left: `${((s + 1) / rules.trackLength) * 100}%` }} />
                      ))}
                      <span className={styles.finish} />
                      <span className={styles.horse} style={{ left: `${(progress / rules.trackLength) * 100}%` }}>
                        {/* Re-keyed per move so the gallop animation restarts; the outer span keeps the position transition. */}
                        <span key={moving ? state.lastMove!.seq : 'idle'} className={`${styles.horseBody} ${moving ? styles.galloping : ''}`}>
                          <svg viewBox="-4 -2 106 60" aria-hidden="true">
                            <ellipse cx="50" cy="56" rx="40" ry="3.5" fill="#000" opacity="0.25" />
                            <path d={HORSE_PATH} fill={COATS[i % COATS.length]} stroke="#1E130B" strokeWidth="1.2" strokeLinejoin="round" />
                            <rect x="37" y="17" width="20" height="14" rx="2.5" fill={teamColor(team)} stroke="#FFF8EC" strokeWidth="1.2" />
                          </svg>
                          <span className={styles.cloth} aria-hidden="true">
                            <TeamSymbol symbol={team.symbol} />
                          </span>
                        </span>
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      }
      awards={
        <>
          <button
            type="button"
            className={styles.bonus}
            aria-pressed={bonus}
            onClick={() => setBonus((b) => !b)}
            disabled={session.halted}
            title="Nächster Spielzug zählt doppelt"
          >
            <span className={styles.bonusValue}>×2</span>
            <span>Starker Zug</span>
          </button>
          {teams.map((team, i) => (
            <AwardButton
              key={i}
              team={team}
              compact={teams.length > 2}
              sub={`${teams.length > 2 ? '' : 'Richtig · '}+${steps} ${steps === 1 ? 'Etappe' : 'Etappen'}`}
              onClick={() => award(i)}
              disabled={session.busy || session.halted}
              shortcut={String(i + 1)}
            />
          ))}
        </>
      }
      result={
        <ResultOverlay
          winners={winners}
          title={winners.length === 1 ? `${winners[0]!.name} gewinnt das Rennen!` : 'Gleichstand an der Spitze!'}
          message="Stark geritten – von allen Mannschaften."
          onRematch={onRematch}
          onSetup={onSetup}
          onExit={onExit}
          onUndo={undoMove}
        >
          <ol className={styles.podium}>
            {ranking.map(({ team, place, progress }) => (
              <li key={team.symbol} style={{ '--team': teamColor(team) } as CSSProperties}>
                <span className={styles.podiumPlace}>{place}.</span>
                <TeamSymbol symbol={team.symbol} className={styles.podiumSymbol} />
                <span className={styles.podiumName}>{team.name}</span>
                <span>
                  {progress} / {rules.trackLength}
                </span>
              </li>
            ))}
          </ol>
        </ResultOverlay>
      }
    />
  );
}
