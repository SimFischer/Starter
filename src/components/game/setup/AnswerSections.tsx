import { ANSWER_MODES, type AnswerModeId } from '../../../core/answer-modes/answerModes';
import { CONSULT_OPTIONS, THINK_OPTIONS, type AnswerSettings } from '../../../core/answer-modes/answerSettings';
import { CLASSIC_RANKS, poolValues, type CardPoolConfig, type ClassicRank } from '../../../core/answer-modes/cardPool';
import { TEAM_SYMBOL_LABEL, type TeamConfig } from '../../../core/teams/teams';
import { Icon, type IconName } from '../../ui/Icon';
import { SegmentedControl } from '../../ui/SegmentedControl';
import { TeamSymbol } from '../TeamSymbol';
import { numberOptions } from './options';
import { Field } from './SetupLayout';
import styles from './Setup.module.css';

const MODE_ICON: Record<AnswerModeId, IconName> = {
  'hidden-cards': 'cards',
  'team-consult': 'users',
  'open-round': 'games',
  'class-coop': 'users',
  'free-control': 'sparkles',
};

/** Answer mode choice with a practical hint for dealing the cards. */
export function ModeSection<M extends AnswerModeId>({
  modes,
  mode,
  onChange,
  teams,
  cardPool,
}: {
  modes: readonly M[];
  mode: M;
  onChange: (mode: M) => void;
  teams: readonly TeamConfig[];
  cardPool: CardPoolConfig;
}) {
  const valueCount = poolValues(cardPool).length;
  return (
    <>
      <h2 id="mode-heading" className={styles.sectionTitle}>
        Antwortmodus
      </h2>
      <div className={styles.modes} role="radiogroup" aria-labelledby="mode-heading">
        {modes.map((m) => (
          <button key={m} type="button" role="radio" aria-checked={mode === m} className={styles.mode} onClick={() => onChange(m)}>
            <Icon name={MODE_ICON[m]} className={styles.modeIcon} />
            <span className={styles.modeTitle}>{ANSWER_MODES[m].label}</span>
            <span className={styles.modeText}>{ANSWER_MODES[m].summary}</span>
          </button>
        ))}
      </div>
      {mode === 'hidden-cards' && (
        <p className={styles.cardHint}>
          <span className={styles.cardSuits} aria-hidden="true">
            {teams.map((t) => (
              <TeamSymbol key={t.symbol} symbol={t.symbol} />
            ))}
          </span>
          <span>
            Vorher verdeckt austeilen: {teams.map((t) => `${TEAM_SYMBOL_LABEL[t.symbol]} → ${t.name}`).join(', ')}. {valueCount} Werte ×{' '}
            {teams.length} = <strong>{valueCount * teams.length} Karten</strong>. Mehr Kinder? Werte doppelt austeilen oder unter „Erweitert“
            Nummernkarten wählen.
          </span>
        </p>
      )}
    </>
  );
}

const think = numberOptions(THINK_OPTIONS, (v) => (v === 0 ? 'Offen' : `${v} s`), (v) => (v === 0 ? 'Lehrkraft beendet' : ''));
const consult = numberOptions(CONSULT_OPTIONS, (v) => `${v} s`);
const numberMax = numberOptions([10, 15, 20, 30, 40] as const, (v) => `1–${v}`);

/** Advanced answer settings: thinking/consultation time and the card pool. */
export function AnswerAdvanced<M extends AnswerModeId>({
  value,
  onChange,
}: {
  value: AnswerSettings<M>;
  onChange: (patch: Partial<AnswerSettings<M>>) => void;
}) {
  const pool = value.cardPool;
  const setPool = (patch: Partial<CardPoolConfig>) => onChange({ cardPool: { ...pool, ...patch } });
  const toggleRank = (rank: ClassicRank) => {
    const has = pool.classicRanks.includes(rank);
    if (has && pool.classicRanks.length <= 2) return; // at least two values
    setPool({ classicRanks: has ? pool.classicRanks.filter((r) => r !== rank) : CLASSIC_RANKS.filter((r) => r === rank || pool.classicRanks.includes(r)) });
  };

  return (
    <>
      <div className={styles.advGrid}>
        <Field title="Bedenkzeit">
          <SegmentedControl label="Bedenkzeit" options={think.options} value={String(value.thinkSeconds)} onChange={(v) => onChange({ thinkSeconds: think.parse(v) })} />
        </Field>
        <Field title="Beratungszeit">
          <SegmentedControl label="Beratungszeit" options={consult.options} value={String(value.consultSeconds)} onChange={(v) => onChange({ consultSeconds: consult.parse(v) })} />
        </Field>
      </div>

      <h3 className={styles.advHeading}>Kartenpool für das verdeckte Kartenduell</h3>
      <div className={styles.advGrid}>
        <Field title="Kartenset">
          <SegmentedControl
            label="Kartenset"
            options={[
              { value: 'classic', label: 'Spielkarten', hint: '2 bis Ass' },
              { value: 'numbers', label: 'Nummernkarten', hint: 'z. B. Zahlenkarten' },
            ]}
            value={pool.system}
            onChange={(system) => setPool({ system })}
          />
        </Field>
        <Field title="Ziehen">
          <SegmentedControl
            label="Ziehen"
            options={[
              { value: 'without', label: 'Ohne Zurücklegen', hint: 'jeder Wert einmal' },
              { value: 'with', label: 'Mit Zurücklegen', hint: 'Wiederholung möglich' },
            ]}
            value={pool.withReplacement ? 'with' : 'without'}
            onChange={(v) => setPool({ withReplacement: v === 'with' })}
          />
        </Field>
      </div>

      {pool.system === 'classic' ? (
        <Field title={`Ausgeteilte Kartenwerte (${poolValues(pool).length})`}>
          <div className={styles.rankGrid} role="group" aria-label="Ausgeteilte Kartenwerte">
            {CLASSIC_RANKS.map((rank) => (
              <button key={rank} type="button" aria-pressed={pool.classicRanks.includes(rank)} className={styles.rank} onClick={() => toggleRank(rank)}>
                {rank}
              </button>
            ))}
          </div>
        </Field>
      ) : (
        <Field title="Nummern">
          <SegmentedControl label="Nummern" options={numberMax.options} value={String(pool.numberMax)} onChange={(v) => setPool({ numberMax: numberMax.parse(v) })} />
        </Field>
      )}

      {!pool.withReplacement && (
        <Field title="Wenn alle Werte gezogen sind">
          <SegmentedControl
            label="Wenn alle Werte gezogen sind"
            options={[
              { value: 'auto', label: 'Automatisch neu mischen' },
              { value: 'manual', label: 'Lehrkraft mischt neu' },
            ]}
            value={pool.autoReset ? 'auto' : 'manual'}
            onChange={(v) => setPool({ autoReset: v === 'auto' })}
          />
        </Field>
      )}
    </>
  );
}
