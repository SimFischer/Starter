import { useMemo, type CSSProperties } from 'react';
import styles from './Confetti.module.css';

/** Lightweight CSS confetti (transform/opacity only). Not rendered with reduced motion. */
export function Confetti({ colors, count = 70 }: { colors: readonly string[]; count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: Math.random() * 100,
        drift: (Math.random() - 0.5) * 30,
        delay: Math.random() * 400,
        duration: 1600 + Math.random() * 1200,
        rot: Math.random() * 720 - 360,
        color: colors[i % colors.length],
        round: i % 3 === 0,
      })),
    [colors, count],
  );

  return (
    <div className={styles.layer} aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className={`${styles.piece} ${p.round ? styles.round : ''}`}
          style={
            {
              left: `${p.x}%`,
              background: p.color,
              '--drift': `${p.drift}vw`,
              '--rot': `${p.rot}deg`,
              animationDelay: `${p.delay}ms`,
              animationDuration: `${p.duration}ms`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
