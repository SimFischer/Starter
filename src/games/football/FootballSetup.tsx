import { useState } from 'react';
import { ANSWER_MODES } from '../../core/answer-modes/answerModes';
import { CLASSIC_RANKS, poolValues, type ClassicRank } from '../../core/answer-modes/cardPool';
import { TEAM_SYMBOL_LABEL } from '../../core/teams/teams';
import { useFullscreen } from '../../hooks/useFullscreen';
import { TeamEditor } from '../../components/game/TeamEditor';
import { TeamSymbol } from '../../components/game/TeamSymbol';
import { Button, ButtonLink } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { Icon } from '../../components/ui/Icon';
import { SegmentedControl, type SegmentOption } from '../../components/ui/SegmentedControl';
import { FootballIllustration } from './Illustration';
import {
  CONSULT_OPTIONS,
  DEFAULT_FOOTBALL_SETTINGS,
  FIELDS_OPTIONS,
  FOOTBALL_MODES,
  GOALS_OPTIONS,
  STEP_OPTIONS,
  THINK_OPTIONS,
  TIME_OPTIONS,
  type FootballMode,
  type FootballSettings,
} from './settings';
import styles from './FootballSetup.module.css';

interface Props {
  initial: FootballSettings;
  onStart: (settings: FootballSettings) => void;
}

/** SegmentedControl works with strings; this maps number|null options both ways. */
function numberOptions<T extends number | null>(values: readonly T[], label: (v: T) => string, hint?: (v: T) => string) {
  const options: SegmentOption<string>[] = values.map((v) => {
    const option: SegmentOption<string> = { value: String(v), label: label(v) };
    const h = hint?.(v);
    if (h) option.hint = h;
    return option;
  });
  const parse = (s: string) => values.find((v) => String(v) === s) ?? values[0]!;
  return { options, parse };
}

const MODE_ICON: Record<FootballMode, 'cards' | 'users' | 'games' | 'sparkles'> = {
  'hidden-cards': 'cards',
  'team-consult': 'users',
  'open-round': 'games',
  'free-control': 'sparkles',
};

const goals = numberOptions(GOALS_OPTIONS, (v) => (v === null ? 'Offen' : String(v)), (v) => (v === null ? 'kein Spielende' : v === 1 ? 'Tor' : 'Tore'));
const time = numberOptions(TIME_OPTIONS, (v) => (v === null ? 'Ohne' : `${v} min`));
const fields = numberOptions(FIELDS_OPTIONS, (v) => String(v), (v) => `${v * 2 + 1} Positionen`);
const stepsOpt = numberOptions(STEP_OPTIONS, (v) => `${v} ${v === 1 ? 'Feld' : 'Felder'}`);
const think = numberOptions(THINK_OPTIONS, (v) => (v === 0 ? 'Offen' : `${v} s`), (v) => (v === 0 ? 'Lehrkraft beendet' : ''));
const consult = numberOptions(CONSULT_OPTIONS, (v) => `${v} s`);
const numberMax = numberOptions([10, 15, 20, 30, 40] as const, (v) => `1–${v}`);

export function FootballSetup({ initial, onStart }: Props) {
  const [s, setS] = useState<FootballSettings>(initial);
  const [advanced, setAdvanced] = useState(false);
  const fullscreen = useFullscreen();
  const [a, b] = s.teams;
  const valueCount = poolValues(s.cardPool).length;

  const set = (patch: Partial<FootballSettings>) => setS((prev) => ({ ...prev, ...patch }));
  const setRules = (patch: Partial<FootballSettings['rules']>) => setS((prev) => ({ ...prev, rules: { ...prev.rules, ...patch } }));
  const setPool = (patch: Partial<FootballSettings['cardPool']>) => setS((prev) => ({ ...prev, cardPool: { ...prev.cardPool, ...patch } }));

  const toggleRank = (rank: ClassicRank) => {
    const has = s.cardPool.classicRanks.includes(rank);
    if (has && s.cardPool.classicRanks.length <= 2) return; // at least two values
    setPool({ classicRanks: has ? s.cardPool.classicRanks.filter((r) => r !== rank) : CLASSIC_RANKS.filter((r) => r === rank || s.cardPool.classicRanks.includes(r)) });
  };

  return (
    <div className={styles.screen}>
      <div className={styles.backdrop} aria-hidden="true">
        <FootballIllustration />
      </div>

      <header className={styles.top}>
        <ButtonLink href="#/" variant="ghost" icon="back">
          Spielesammlung
        </ButtonLink>
        <div className={styles.title}>
          <span className={styles.eyebrow}>Mannschaftsduell</span>
          <h1>Tafelfußball</h1>
        </div>
        <Button variant="secondary" icon={fullscreen.active ? 'compress' : 'expand'} iconOnly onClick={fullscreen.toggle} disabled={!fullscreen.supported}>
          Vollbild (F)
        </Button>
      </header>

      <main className={styles.body} id="main" tabIndex={-1}>
        <section className={styles.teams} aria-labelledby="teams-heading">
          <h2 id="teams-heading" className={styles.sectionTitle}>
            Mannschaften
          </h2>
          <div className={styles.teamGrid}>
            <TeamEditor label="Mannschaft 1" team={a} others={[b]} onChange={(t) => set({ teams: [t, b] })} />
            <TeamEditor label="Mannschaft 2" team={b} others={[a]} onChange={(t) => set({ teams: [a, t] })} />
          </div>
          <p className={styles.note}>
            <Icon name="info" /> Mannschaftsnamen statt Kindernamen – TafelArena speichert keine Schülerdaten.
          </p>
        </section>

        <section className={styles.rules} aria-labelledby="mode-heading">
          <h2 id="mode-heading" className={styles.sectionTitle}>
            Antwortmodus
          </h2>
          <div className={styles.modes} role="radiogroup" aria-labelledby="mode-heading">
            {FOOTBALL_MODES.map((mode) => (
              <button
                key={mode}
                type="button"
                role="radio"
                aria-checked={s.mode === mode}
                className={styles.mode}
                onClick={() => set({ mode })}
              >
                <Icon name={MODE_ICON[mode]} className={styles.modeIcon} />
                <span className={styles.modeTitle}>{ANSWER_MODES[mode].label}</span>
                <span className={styles.modeText}>{ANSWER_MODES[mode].summary}</span>
              </button>
            ))}
          </div>

          {s.mode === 'hidden-cards' && (
            <p className={styles.cardHint}>
              <span className={styles.cardSuits} aria-hidden="true">
                <TeamSymbol symbol={a.symbol} />
                <TeamSymbol symbol={b.symbol} />
              </span>
              <span>
                Vorher verdeckt austeilen: {TEAM_SYMBOL_LABEL[a.symbol]}-Karten an {a.name}, {TEAM_SYMBOL_LABEL[b.symbol]}-Karten an {b.name}.{' '}
                {valueCount} Werte × 2 = <strong>{valueCount * 2} Karten</strong>. Mehr Kinder? Werte doppelt austeilen oder unter „Erweitert“ Nummernkarten wählen.
              </span>
            </p>
          )}

          <div className={styles.endRow}>
            <div>
              <h3 className={styles.fieldTitle}>Tore bis zum Sieg</h3>
              <SegmentedControl label="Tore bis zum Sieg" options={goals.options} value={String(s.rules.goalsToWin)} onChange={(v) => setRules({ goalsToWin: goals.parse(v) })} />
            </div>
            <div>
              <h3 className={styles.fieldTitle}>Spielzeit</h3>
              <SegmentedControl label="Spielzeit" options={time.options} value={String(s.timeLimitMinutes)} onChange={(v) => set({ timeLimitMinutes: time.parse(v) })} />
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.bottom}>
        <Button variant="ghost" icon="settings" onClick={() => setAdvanced(true)}>
          Erweitert
        </Button>
        <Button variant="ghost" icon="reset" onClick={() => setS(DEFAULT_FOOTBALL_SETTINGS)}>
          Standard
        </Button>
        <Button variant="primary" size="lg" icon="play" className={styles.kickoff} onClick={() => onStart(s)}>
          Anpfiff
        </Button>
      </footer>

      <Dialog
        open={advanced}
        size="lg"
        onClose={() => setAdvanced(false)}
        title="Erweiterte Einstellungen"
        footer={
          <Button variant="primary" onClick={() => setAdvanced(false)}>
            Übernehmen
          </Button>
        }
      >
        <div className={styles.advGrid}>
          <div>
            <h3 className={styles.fieldTitle}>Felder je Spielhälfte</h3>
            <SegmentedControl label="Felder je Spielhälfte" options={fields.options} value={String(s.rules.fieldsPerSide)} onChange={(v) => setRules({ fieldsPerSide: fields.parse(v) })} />
          </div>
          <div>
            <h3 className={styles.fieldTitle}>Ballbewegung je richtiger Antwort</h3>
            <SegmentedControl label="Ballbewegung" options={stepsOpt.options} value={String(s.rules.stepsPerAward)} onChange={(v) => setRules({ stepsPerAward: stepsOpt.parse(v) })} />
          </div>
          <div>
            <h3 className={styles.fieldTitle}>Bedenkzeit</h3>
            <SegmentedControl label="Bedenkzeit" options={think.options} value={String(s.thinkSeconds)} onChange={(v) => set({ thinkSeconds: think.parse(v) })} />
          </div>
          <div>
            <h3 className={styles.fieldTitle}>Beratungszeit</h3>
            <SegmentedControl label="Beratungszeit" options={consult.options} value={String(s.consultSeconds)} onChange={(v) => set({ consultSeconds: consult.parse(v) })} />
          </div>
        </div>

        <h3 className={styles.advHeading}>Kartenpool für das verdeckte Kartenduell</h3>
        <div className={styles.advGrid}>
          <div>
            <h3 className={styles.fieldTitle}>Kartenset</h3>
            <SegmentedControl
              label="Kartenset"
              options={[
                { value: 'classic', label: 'Spielkarten', hint: '2 bis Ass' },
                { value: 'numbers', label: 'Nummernkarten', hint: 'z. B. Uno, Zahlen' },
              ]}
              value={s.cardPool.system}
              onChange={(system) => setPool({ system })}
            />
          </div>
          <div>
            <h3 className={styles.fieldTitle}>Ziehen</h3>
            <SegmentedControl
              label="Ziehen"
              options={[
                { value: 'without', label: 'Ohne Zurücklegen', hint: 'jeder Wert einmal' },
                { value: 'with', label: 'Mit Zurücklegen', hint: 'Wiederholung möglich' },
              ]}
              value={s.cardPool.withReplacement ? 'with' : 'without'}
              onChange={(v) => setPool({ withReplacement: v === 'with' })}
            />
          </div>
        </div>

        {s.cardPool.system === 'classic' ? (
          <div>
            <h3 className={styles.fieldTitle}>Ausgeteilte Kartenwerte ({valueCount})</h3>
            <div className={styles.rankGrid} role="group" aria-label="Ausgeteilte Kartenwerte">
              {CLASSIC_RANKS.map((rank) => (
                <button key={rank} type="button" aria-pressed={s.cardPool.classicRanks.includes(rank)} className={styles.rank} onClick={() => toggleRank(rank)}>
                  {rank}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h3 className={styles.fieldTitle}>Nummern</h3>
            <SegmentedControl label="Nummern" options={numberMax.options} value={String(s.cardPool.numberMax)} onChange={(v) => setPool({ numberMax: numberMax.parse(v) })} />
          </div>
        )}

        {!s.cardPool.withReplacement && (
          <div>
            <h3 className={styles.fieldTitle}>Wenn alle Werte gezogen sind</h3>
            <SegmentedControl
              label="Wenn alle Werte gezogen sind"
              options={[
                { value: 'auto', label: 'Automatisch neu mischen' },
                { value: 'manual', label: 'Lehrkraft mischt neu' },
              ]}
              value={s.cardPool.autoReset ? 'auto' : 'manual'}
              onChange={(v) => setPool({ autoReset: v === 'auto' })}
            />
          </div>
        )}
      </Dialog>
    </div>
  );
}
