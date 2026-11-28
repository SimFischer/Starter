import styles from './CountdownRing.module.css';

interface Props {
  /** 0 = open thinking time without limit. */
  duration: number;
  remaining: number;
  label: string;
  timeUp: boolean;
}

const R = 54;
const C = 2 * Math.PI * R;

/** Calm visual countdown for the whole class – no blinking, no alarm colours. */
export function CountdownRing({ duration, remaining, label, timeUp }: Props) {
  const open = duration === 0;
  const progress = open ? 1 : remaining / duration;
  const seconds = Math.ceil(remaining / 1000);
  return (
    <div className={`${styles.wrap} ${timeUp ? styles.up : ''}`} role="timer" aria-live="off" aria-label={open ? label : `${label}: ${seconds} Sekunden`}>
      <svg viewBox="0 0 128 128" className={styles.ring} aria-hidden="true">
        <circle cx="64" cy="64" r={R} className={styles.track} />
        {!open && (
          <circle
            cx="64"
            cy="64"
            r={R}
            className={styles.progress}
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
          />
        )}
      </svg>
      <span className={styles.center}>
        {timeUp ? <span className={styles.upText}>Zeit!</span> : open ? <span className={styles.dots}>···</span> : seconds}
      </span>
      <span className={styles.label}>{timeUp ? 'Die Bedenkzeit ist vorbei' : label}</span>
    </div>
  );
}
