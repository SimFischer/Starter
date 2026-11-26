import { useCallback, useState } from 'react';
import { useCountdown, type Countdown } from '../../hooks/useCountdown';
import type { AnswerModeId } from './answerModes';
import { createPoolState, drawCard, pickCard, poolValues, type CardPoolConfig, type CardPoolState } from './cardPool';

/**
 * Game-independent round flow for the answer modes:
 * idle → timing (thinking / team consultation) → answering → idle.
 * Scoring stays with the game; the teacher may award at any time.
 */
export type RoundPhase = 'idle' | 'timing' | 'answering';

export interface AnswerRoundConfig {
  mode: AnswerModeId;
  thinkSeconds: number;
  consultSeconds: number;
  cardPool: CardPoolConfig;
}

export interface AnswerRound {
  mode: AnswerModeId;
  phase: RoundPhase;
  timerLabel: string;
  countdown: Countdown;
  timeUp: boolean;
  revealed: readonly string[];
  pool: CardPoolState;
  poolSize: number;
  /** Short info for the teacher, e.g. after an automatic reshuffle. */
  notice: string | null;
  startTimer(): void;
  stopTimer(): void;
  extendTimer(): void;
  draw(): void;
  pick(value: string): void;
  resetPool(): void;
  endRound(): void;
  /** Primary next step (space bar); undefined if there is none. */
  primary: { label: string; run: () => void } | undefined;
}

export const EXTEND_MS = 15_000;

export function useAnswerRound(config: AnswerRoundConfig, paused: boolean): AnswerRound {
  const { mode, cardPool } = config;
  const [phase, setPhase] = useState<RoundPhase>('idle');
  const [revealed, setRevealed] = useState<readonly string[]>([]);
  const [pool, setPool] = useState<CardPoolState>(() => createPoolState(cardPool));
  const [notice, setNotice] = useState<string | null>(null);
  const countdown = useCountdown(paused);
  const { start, stop } = countdown;

  const seconds = mode === 'team-consult' ? config.consultSeconds : config.thinkSeconds;

  const startTimer = useCallback(() => {
    setRevealed([]);
    setNotice(null);
    if (seconds > 0) start(seconds * 1000);
    else stop();
    setPhase('timing');
  }, [seconds, start, stop]);

  const stopTimer = useCallback(() => {
    stop();
    setPhase('answering');
  }, [stop]);

  const extendTimer = useCallback(() => {
    if (countdown.duration === 0) return;
    if (countdown.remaining === 0) start(EXTEND_MS);
    else countdown.extend(EXTEND_MS);
    setPhase('timing');
  }, [countdown, start]);

  const draw = useCallback(() => {
    const result = drawCard(cardPool, pool, revealed);
    if (!result) {
      setNotice('Alle Kartenwerte wurden gezogen. Stapel neu mischen?');
      return;
    }
    stop();
    setPool(result.state);
    setRevealed([...revealed, result.value]);
    setNotice(result.reshuffled ? 'Alle Werte waren gezogen – der Stapel wurde neu gemischt.' : null);
    setPhase('answering');
  }, [cardPool, pool, revealed, stop]);

  const pick = useCallback(
    (value: string) => {
      stop();
      setPool((p) => pickCard(cardPool, p, value));
      setRevealed((r) => (r.includes(value) ? r : [...r, value]));
      setNotice(null);
      setPhase('answering');
    },
    [cardPool, stop],
  );

  const resetPool = useCallback(() => {
    setPool(createPoolState(cardPool));
    setNotice('Stapel neu gemischt – alle Werte sind wieder im Spiel.');
  }, [cardPool]);

  const endRound = useCallback(() => {
    stop();
    setRevealed([]);
    setPhase('idle');
  }, [stop]);

  let primary: AnswerRound['primary'];
  if (mode === 'hidden-cards') {
    if (phase === 'idle') primary = { label: 'Bedenkzeit starten', run: startTimer };
    else if (phase === 'timing') primary = { label: 'Karte ziehen', run: draw };
  } else if (mode === 'team-consult' || mode === 'open-round') {
    const word = mode === 'team-consult' ? 'Beratung' : 'Bedenkzeit';
    if (phase === 'idle') primary = { label: `${word} starten`, run: startTimer };
    else if (phase === 'timing') primary = { label: `${word} beenden`, run: stopTimer };
  }

  return {
    mode,
    phase,
    timerLabel: mode === 'team-consult' ? 'Beratungszeit' : 'Alle denken nach',
    countdown,
    timeUp: phase === 'timing' && countdown.duration > 0 && countdown.remaining === 0,
    revealed,
    pool,
    poolSize: poolValues(cardPool).length,
    notice,
    startTimer,
    stopTimer,
    extendTimer,
    draw,
    pick,
    resetPool,
    endRound,
    primary,
  };
}
