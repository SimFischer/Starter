import type { CSSProperties, ComponentType } from 'react';
import { Badge, type BadgeTone } from '../ui/Badge';
import { Icon, type IconName } from '../ui/Icon';
import styles from './GameTile.module.css';

export interface GameTileProps {
  title: string;
  eyebrow: string;
  tagline: string;
  Illustration: ComponentType;
  accent: { primary: string; secondary: string };
  status: { tone: BadgeTone; label: string };
  meta: { icon: IconName; label: string };
  styleBadge?: { tone: BadgeTone; label: string };
  variant?: 'game' | 'feature';
  index?: number;
  onOpen: () => void;
}

/**
 * Launcher tile. It is a real button that opens details – it never pretends
 * a game can be started before it is playable.
 */
export function GameTile({
  title,
  eyebrow,
  tagline,
  Illustration,
  accent,
  status,
  meta,
  styleBadge,
  variant = 'game',
  index = 0,
  onOpen,
}: GameTileProps) {
  const style = {
    '--accent': accent.primary,
    '--accent-2': accent.secondary,
    '--stagger': `${index * 45}ms`,
  } as CSSProperties;

  return (
    <button type="button" className={`${styles.tile} ${styles[variant]} ill-host`} style={style} onClick={onOpen}>
      <span className={styles.art}>
        <Illustration />
        <span className={styles.artShade} aria-hidden="true" />
        <Badge tone={status.tone} className={styles.status}>
          {status.label}
        </Badge>
      </span>
      <span className={styles.info}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <span className={styles.title}>{title}</span>
        <span className={styles.tagline}>{tagline}</span>
        <span className={styles.meta}>
          <span className={styles.metaItem}>
            <Icon name={meta.icon} className={styles.metaIcon} />
            {meta.label}
          </span>
          {styleBadge && <Badge tone={styleBadge.tone}>{styleBadge.label}</Badge>}
        </span>
      </span>
    </button>
  );
}
