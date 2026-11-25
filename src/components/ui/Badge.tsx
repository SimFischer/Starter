import type { ReactNode } from 'react';
import styles from './Badge.module.css';

export type BadgeTone = 'development' | 'planned' | 'cooperative' | 'competitive' | 'neutral';

/** Status display – always text (+ shape), never colour alone. */
export function Badge({ tone = 'neutral', children, className }: { tone?: BadgeTone; children: ReactNode; className?: string | undefined }) {
  return (
    <span className={[styles.badge, styles[tone], className].filter(Boolean).join(' ')}>
      <span className={styles.marker} aria-hidden="true" />
      {children}
    </span>
  );
}
