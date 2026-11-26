import { useCallback, useEffect, useRef, useState } from 'react';

export interface Countdown {
  /** Total duration in ms; 0 = no countdown active. */
  duration: number;
  remaining: number;
  running: boolean;
  start(ms: number): void;
  stop(): void;
  extend(ms: number): void;
}

const TICK_MS = 100;

/**
 * Wall-clock based countdown that freezes while `paused` is true.
 * `onDone` fires once when the countdown reaches zero.
 */
export function useCountdown(paused: boolean, onDone?: () => void): Countdown {
  const [state, setState] = useState({ duration: 0, remaining: 0, running: false });
  const endAt = useRef(0);
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  const start = useCallback((ms: number) => {
    endAt.current = Date.now() + ms;
    setState({ duration: ms, remaining: ms, running: ms > 0 });
  }, []);

  const stop = useCallback(() => setState({ duration: 0, remaining: 0, running: false }), []);

  const extend = useCallback((ms: number) => {
    setState((s) => {
      if (s.duration === 0) return s;
      const remaining = s.remaining + ms;
      endAt.current = Date.now() + remaining;
      return { duration: Math.max(s.duration, remaining), remaining, running: true };
    });
  }, []);

  useEffect(() => {
    // While paused no interval runs; on resume the deadline is rebuilt from what was left.
    if (!state.running || paused) return;
    endAt.current = Date.now() + state.remaining;
    const id = window.setInterval(() => {
      const remaining = Math.max(0, endAt.current - Date.now());
      setState((s) => (s.running ? { ...s, remaining, running: remaining > 0 } : s));
      if (remaining === 0) {
        window.clearInterval(id);
        doneRef.current?.();
      }
    }, TICK_MS);
    return () => window.clearInterval(id);
    // state.remaining is intentionally read only when (re)starting the interval.
  }, [state.running, paused, state.duration]);

  return { ...state, start, stop, extend };
}
