import { useState } from 'react';
import { AnswerAdvanced, ModeSection } from '../../components/game/setup/AnswerSections';
import { Field, SetupLayout, setupStyles } from '../../components/game/setup/SetupLayout';
import { TeamsSection } from '../../components/game/setup/TeamsSection';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { ConnectFourIllustration } from './Illustration';
import { C4_MODES, DEFAULT_C4_SETTINGS, type BoardSize, type ConnectFourSettings } from './settings';

const BOARD_LABEL: Record<BoardSize, { label: string; hint: string }> = {
  '6x5': { label: '6 × 5', hint: 'kurz' },
  '7x6': { label: '7 × 6', hint: 'Standard' },
  '8x7': { label: '8 × 7', hint: 'lang' },
};

export function ConnectFourSetup({ initial, onStart }: { initial: ConnectFourSettings; onStart: (settings: ConnectFourSettings) => void }) {
  const [s, setS] = useState<ConnectFourSettings>(initial);
  const set = (patch: Partial<ConnectFourSettings>) => setS((prev) => ({ ...prev, ...patch }));

  return (
    <SetupLayout
      eyebrow="Strategie & Mannschaftsduell"
      title="Vier gewinnt"
      accent={{ primary: '#E5484D', secondary: '#9CC5FF' }}
      Illustration={ConnectFourIllustration}
      startLabel="Spiel starten"
      onStart={() => onStart(s)}
      onDefaults={() => setS(DEFAULT_C4_SETTINGS)}
      left={<TeamsSection teams={s.teams} min={2} max={2} onChange={(t) => set({ teams: [t[0]!, t[1]!] })} />}
      right={
        <>
          <ModeSection modes={C4_MODES} mode={s.mode} onChange={(mode) => set({ mode })} teams={s.teams} cardPool={s.cardPool} />
          <div className={setupStyles.endRow}>
            <Field title="Wer setzt den nächsten Stein?">
              <SegmentedControl
                label="Wer setzt den nächsten Stein?"
                options={[
                  { value: 'earn', label: 'Wer richtig antwortet', hint: 'Antwort verdient den Zug' },
                  { value: 'alternate', label: 'Abwechselnd', hint: 'klassisch, Frage an die Mannschaft am Zug' },
                ]}
                value={s.turnMode}
                onChange={(turnMode) => set({ turnMode })}
              />
            </Field>
            <Field title="Spielbrett">
              <SegmentedControl
                label="Spielbrett"
                options={(Object.keys(BOARD_LABEL) as BoardSize[]).map((value) => ({ value, ...BOARD_LABEL[value] }))}
                value={s.board}
                onChange={(board) => set({ board })}
              />
            </Field>
          </div>
        </>
      }
      advanced={<AnswerAdvanced value={s} onChange={set} />}
    />
  );
}
