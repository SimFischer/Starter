import type { CSSProperties } from 'react';
import { RANK_NAME, type CardSystem, type ClassicRank } from '../../core/answer-modes/cardPool';
import type { TeamConfig } from '../../core/teams/teams';
import { teamColor } from '../../core/teams/teams';
import { TeamSymbol } from './TeamSymbol';
import styles from './PlayingCard.module.css';

interface Props {
  value: string;
  system: CardSystem;
  /** Teams whose holders of this value may answer – shown as their marks. */
  teams: readonly TeamConfig[];
  index?: number;
}

/** Revealed card with a flip-in animation. Shows the value, never a person. */
export function PlayingCard({ value, system, teams, index = 0 }: Props) {
  const label = system === 'classic' ? (RANK_NAME[value as ClassicRank] ?? value) : `Nummer ${value}`;
  return (
    <div className={styles.slot} style={{ '--i': index } as CSSProperties} role="img" aria-label={`Karte: ${label}`}>
      <div className={styles.card}>
        <div className={`${styles.face} ${styles.back}`} aria-hidden="true">
          <span className={styles.backEmblem} />
        </div>
        <div className={`${styles.face} ${styles.front}`} aria-hidden="true">
          <span className={styles.corner}>{value}</span>
          <span className={styles.value}>{value}</span>
          <span className={styles.marks}>
            {teams.map((t) => (
              <TeamSymbol key={t.symbol} symbol={t.symbol} className={styles.mark} />
            ))}
          </span>
          <span className={`${styles.corner} ${styles.cornerBottom}`}>{value}</span>
          <span className={styles.markColors}>
            {teams.map((t) => (
              <i key={t.symbol} style={{ background: teamColor(t) }} />
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}
