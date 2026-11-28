import { useState } from 'react';
import { AnswerAdvanced, ModeSection } from '../../components/game/setup/AnswerSections';
import { numberOptions } from '../../components/game/setup/options';
import { Field, SetupLayout, setupStyles } from '../../components/game/setup/SetupLayout';
import { TeamsSection } from '../../components/game/setup/TeamsSection';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { HorseRaceIllustration } from './Illustration';
import {
  DEFAULT_RACE_SETTINGS,
  MAX_TEAMS,
  MIN_TEAMS,
  RACE_MODES,
  RACE_STEP_OPTIONS,
  RACE_TIME_OPTIONS,
  TRACK_OPTIONS,
  type HorseRaceSettings,
} from './settings';

const track = numberOptions(TRACK_OPTIONS, (v) => String(v), () => 'Etappen');
const time = numberOptions(RACE_TIME_OPTIONS, (v) => (v === null ? 'Ohne' : `${v} min`));
const stepsOpt = numberOptions(RACE_STEP_OPTIONS, (v) => `${v} ${v === 1 ? 'Etappe' : 'Etappen'}`);

export function HorseRaceSetup({ initial, onStart }: { initial: HorseRaceSettings; onStart: (settings: HorseRaceSettings) => void }) {
  const [s, setS] = useState<HorseRaceSettings>(initial);
  const set = (patch: Partial<HorseRaceSettings>) => setS((prev) => ({ ...prev, ...patch }));
  const setRules = (patch: Partial<HorseRaceSettings['rules']>) => setS((prev) => ({ ...prev, rules: { ...prev.rules, ...patch } }));

  return (
    <SetupLayout
      eyebrow="Mannschaftswettlauf"
      title="Pferderennen"
      accent={{ primary: '#E0A040', secondary: '#F2C98A' }}
      Illustration={HorseRaceIllustration}
      startLabel="Startschuss"
      onStart={() => onStart(s)}
      onDefaults={() => setS(DEFAULT_RACE_SETTINGS)}
      left={<TeamsSection teams={s.teams} min={MIN_TEAMS} max={MAX_TEAMS} onChange={(teams) => set({ teams })} />}
      right={
        <>
          <ModeSection modes={RACE_MODES} mode={s.mode} onChange={(mode) => set({ mode })} teams={s.teams} cardPool={s.cardPool} />
          <div className={setupStyles.endRow}>
            <Field title="Streckenlänge">
              <SegmentedControl label="Streckenlänge" options={track.options} value={String(s.rules.trackLength)} onChange={(v) => setRules({ trackLength: track.parse(v) })} />
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
            <Field title="Fortschritt je richtiger Antwort">
              <SegmentedControl label="Fortschritt je richtiger Antwort" options={stepsOpt.options} value={String(s.rules.stepsPerAward)} onChange={(v) => setRules({ stepsPerAward: stepsOpt.parse(v) })} />
            </Field>
          </div>
          <AnswerAdvanced value={s} onChange={set} />
        </>
      }
    />
  );
}
