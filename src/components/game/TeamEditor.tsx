import { useId, type CSSProperties } from 'react';
import {
  TEAM_COLORS,
  TEAM_NAME_MAX,
  TEAM_SYMBOLS,
  TEAM_SYMBOL_LABEL,
  teamColor,
  type TeamColorId,
  type TeamConfig,
} from '../../core/teams/teams';
import { TeamSymbol } from './TeamSymbol';
import styles from './TeamEditor.module.css';

interface Props {
  label: string;
  team: TeamConfig;
  /** Other teams: their colour and symbol are not selectable (always distinguishable). */
  others: readonly TeamConfig[];
  onChange: (team: TeamConfig) => void;
  /** Smaller controls when several teams share the column. */
  compact?: boolean;
}

/** Edits one team's name, colour and symbol. Names are team names, never student names. */
export function TeamEditor({ label, team, others, onChange, compact = false }: Props) {
  const nameId = useId();
  const takenColors = new Set(others.map((t) => t.color));
  const takenSymbols = new Set(others.map((t) => t.symbol));

  return (
    <fieldset className={`${styles.editor} ${compact ? styles.compact : ''}`} style={{ '--team': teamColor(team) } as CSSProperties}>
      <legend className="visually-hidden">{label}</legend>
      <div className={styles.head}>
        <span className={styles.badge} aria-hidden="true">
          <TeamSymbol symbol={team.symbol} />
        </span>
        <div className={styles.nameField}>
          <label htmlFor={nameId} className={styles.fieldLabel}>
            {label}
          </label>
          <input
            id={nameId}
            className={styles.input}
            value={team.name}
            maxLength={TEAM_NAME_MAX}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => onChange({ ...team, name: e.target.value })}
            onBlur={(e) => {
              const name = e.target.value.replace(/\s+/g, ' ').trim();
              if (name !== team.name) onChange({ ...team, name: name || label });
            }}
          />
        </div>
      </div>

      <div className={styles.row} role="radiogroup" aria-label={`${label}: Farbe`}>
        {(Object.keys(TEAM_COLORS) as TeamColorId[]).map((id) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={team.color === id}
            aria-label={TEAM_COLORS[id].label}
            title={TEAM_COLORS[id].label}
            disabled={takenColors.has(id)}
            className={styles.swatch}
            style={{ '--swatch': TEAM_COLORS[id].value } as CSSProperties}
            onClick={() => onChange({ ...team, color: id })}
          />
        ))}
      </div>

      <div className={styles.row} role="radiogroup" aria-label={`${label}: Symbol`}>
        {TEAM_SYMBOLS.map((symbol) => (
          <button
            key={symbol}
            type="button"
            role="radio"
            aria-checked={team.symbol === symbol}
            aria-label={TEAM_SYMBOL_LABEL[symbol]}
            title={TEAM_SYMBOL_LABEL[symbol]}
            disabled={takenSymbols.has(symbol)}
            className={styles.symbol}
            onClick={() => onChange({ ...team, symbol })}
          >
            <TeamSymbol symbol={symbol} />
          </button>
        ))}
      </div>
    </fieldset>
  );
}
