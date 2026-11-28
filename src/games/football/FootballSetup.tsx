import { useState } from 'react';
import { AnswerAdvanced, ModeSection } from '../../components/game/setup/AnswerSections';
import { numberOptions } from '../../components/game/setup/options';
import { Field, SetupLayout, setupStyles } from '../../components/game/setup/SetupLayout';
import { TeamsSection } from '../../components/game/setup/TeamsSection';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { FootballIllustration } from './Illustration';
import {
  DEFAULT_FOOTBALL_SETTINGS,
  FIELDS_OPTIONS,
  FOOTBALL_MODES,
  GOALS_OPTIONS,
  STEP_OPTIONS,
  TIME_OPTIONS,
  type FootballSettings,
} from './settings';

const goals = numberOptions(GOALS_OPTIONS, (v) => (v === null ? 'Offen' : String(v)), (v) => (v === null ? 'kein Spielende' : v === 1 ? 'Tor' : 'Tore'));
const time = numberOptions(TIME_OPTIONS, (v) => (v === null ? 'Ohne' : `${v} min`));
const fields = numberOptions(FIELDS_OPTIONS, (v) => String(v), (v) => `${v * 2 + 1} Positionen`);
const stepsOpt = numberOptions(STEP_OPTIONS, (v) => `${v} ${v === 1 ? 'Feld' : 'Felder'}`);

export function FootballSetup({ initial, onStart }: { initial: FootballSettings; onStart: (settings: FootballSettings) => void }) {
  const [s, setS] = useState<FootballSettings>(initial);
  const set = (patch: Partial<FootballSettings>) => setS((prev) => ({ ...prev, ...patch }));
  const setRules = (patch: Partial<FootballSettings['rules']>) => setS((prev) => ({ ...prev, rules: { ...prev.rules, ...patch } }));

  return (
    <SetupLayout
      eyebrow="Mannschaftsduell"
      title="Tafelfußball"
      accent={{ primary: '#2FBF71', secondary: '#8EE4AF' }}
      Illustration={FootballIllustration}
      startLabel="Anpfiff"
      onStart={() => onStart(s)}
      onDefaults={() => setS(DEFAULT_FOOTBALL_SETTINGS)}
      left={<TeamsSection teams={s.teams} min={2} max={2} onChange={(t) => set({ teams: [t[0]!, t[1]!] })} />}
      right={
        <>
          <ModeSection modes={FOOTBALL_MODES} mode={s.mode} onChange={(mode) => set({ mode })} teams={s.teams} cardPool={s.cardPool} />
          <div className={setupStyles.endRow}>
            <Field title="Tore bis zum Sieg">
              <SegmentedControl label="Tore bis zum Sieg" options={goals.options} value={String(s.rules.goalsToWin)} onChange={(v) => setRules({ goalsToWin: goals.parse(v) })} />
            </Field>
            <Field title="Spielzeit">
              <SegmentedControl label="Spielzeit" options={time.options} value={String(s.timeLimitMinutes)} onChange={(v) => set({ timeLimitMinutes: time.parse(v) })} />
            </Field>
          </div>
        </>
      }
      advanced={
        <>
          <div className={setupStyles.advGrid}>
            <Field title="Felder je Spielhälfte">
              <SegmentedControl label="Felder je Spielhälfte" options={fields.options} value={String(s.rules.fieldsPerSide)} onChange={(v) => setRules({ fieldsPerSide: fields.parse(v) })} />
            </Field>
            <Field title="Ballbewegung je richtiger Antwort">
              <SegmentedControl label="Ballbewegung" options={stepsOpt.options} value={String(s.rules.stepsPerAward)} onChange={(v) => setRules({ stepsPerAward: stepsOpt.parse(v) })} />
            </Field>
          </div>
          <AnswerAdvanced value={s} onChange={set} />
        </>
      }
    />
  );
}
