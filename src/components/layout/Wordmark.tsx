import styles from './Wordmark.module.css';

/** Provisional typographic wordmark – replace with shared/logo-wordmark.svg (docs/ASSETS.md). */
export function Wordmark({ showClaim = true }: { showClaim?: boolean }) {
  return (
    <span className={styles.wordmark}>
      <svg className={styles.emblem} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="wm-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F6D994" />
            <stop offset="1" stopColor="#C9933A" />
          </linearGradient>
        </defs>
        <path d="M32 3 57 17v30L32 61 7 47V17Z" fill="#101827" stroke="url(#wm-gold)" strokeWidth="3.5" />
        <path d="M32 10 51 21v22L32 54 13 43V21Z" fill="none" stroke="#F6D994" strokeOpacity="0.25" strokeWidth="1.5" />
        <path d="M19 22h26v7H36v20h-8V29h-9Z" fill="url(#wm-gold)" />
      </svg>
      <span className={styles.text}>
        <span className={styles.name}>
          Tafel<span className={styles.accent}>Arena</span>
        </span>
        {showClaim && <span className={styles.claim}>Gemeinsam spielen. Gemeinsam lernen.</span>}
      </span>
    </span>
  );
}
