import { nextFreeTeam, type TeamConfig } from '../../../core/teams/teams';
import { Icon } from '../../ui/Icon';
import { SegmentedControl } from '../../ui/SegmentedControl';
import { TeamEditor } from '../TeamEditor';
import styles from './Setup.module.css';

interface Props {
  teams: readonly TeamConfig[];
  min: number;
  max: number;
  onChange: (teams: TeamConfig[]) => void;
}

/** Team count (if variable) and one editor per team; colours/symbols stay unique. */
export function TeamsSection({ teams, min, max, onChange }: Props) {
  const setCount = (count: number) => {
    const next = teams.slice(0, count);
    while (next.length < count) next.push(nextFreeTeam(next));
    onChange(next);
  };

  return (
    <>
      <h2 className={styles.sectionTitle}>Mannschaften</h2>
      {min < max && (
        <div className={styles.teamCount}>
          <SegmentedControl
            label="Anzahl der Mannschaften"
            options={Array.from({ length: max - min + 1 }, (_, i) => ({ value: String(min + i), label: `${min + i} Mannschaften` }))}
            value={String(teams.length)}
            onChange={(v) => setCount(Number(v))}
          />
        </div>
      )}
      <div className={`${styles.teamGrid} ${teams.length > 2 ? styles.teamGridMulti : ''}`}>
        {teams.map((team, i) => (
          <TeamEditor
            key={i}
            label={`Mannschaft ${i + 1}`}
            team={team}
            compact={teams.length > 2}
            others={teams.filter((_, j) => j !== i)}
            onChange={(t) => onChange(teams.map((old, j) => (j === i ? t : old)))}
          />
        ))}
      </div>
      <p className={styles.note}>
        <Icon name="info" /> Mannschaftsnamen statt Kindernamen – TafelArena speichert keine Schülerdaten.
      </p>
    </>
  );
}
