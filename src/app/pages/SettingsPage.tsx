import { useState, type ReactNode } from 'react';
import { appSettingsStore, useAppSettings } from '../../core/settings/useAppSettings';
import type { MotionPreference, UiScale } from '../../core/settings/appSettings';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/Dialog';
import { Icon, type IconName } from '../../components/ui/Icon';
import { SegmentedControl, type SegmentOption } from '../../components/ui/SegmentedControl';
import styles from './SettingsPage.module.css';

const MOTION_OPTIONS: readonly SegmentOption<MotionPreference>[] = [
  { value: 'system', label: 'Wie im System', hint: 'Betriebssystem entscheidet' },
  { value: 'full', label: 'Volle Animationen', hint: 'Empfohlen' },
  { value: 'reduced', label: 'Reduziert', hint: 'Kaum Bewegung' },
];

const SCALE_OPTIONS: readonly SegmentOption<UiScale>[] = [
  { value: 'standard', label: 'Standard', hint: '100 %' },
  { value: 'large', label: 'Groß', hint: '110 %' },
  { value: 'xlarge', label: 'Sehr groß', hint: '120 %' },
];

function SettingRow({ icon, title, description, children }: { icon: IconName; title: string; description: string; children: ReactNode }) {
  return (
    <section className={styles.row}>
      <div className={styles.rowText}>
        <h2 className={styles.rowTitle}>
          <Icon name={icon} className={styles.rowIcon} />
          {title}
        </h2>
        <p>{description}</p>
      </div>
      <div className={styles.control}>{children}</div>
    </section>
  );
}

export function SettingsPage() {
  const settings = useAppSettings();
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <main className={styles.page} id="main" tabIndex={-1}>
      <header className={styles.head}>
        <p className={styles.eyebrow}>Einstellungen</p>
        <h1 className={styles.heading}>Darstellung im Klassenraum</h1>
        <p className={styles.lead}>
          Gilt für die ganze App und wird nur in diesem Browser gespeichert. Spielspezifische Einstellungen folgen mit
          den einzelnen Spielen.
        </p>
      </header>

      <div className={styles.rows}>
        <SettingRow
          icon="motion"
          title="Animationen"
          description="Reduzierte Animationen verkürzen Bewegungen und Effekte auf ein Minimum – hilfreich bei sehr unruhigen Lerngruppen oder langsamen Geräten."
        >
          <SegmentedControl
            label="Animationen"
            options={MOTION_OPTIONS}
            value={settings.motion}
            onChange={(motion) => appSettingsStore.update({ motion })}
          />
        </SettingRow>

        <SettingRow
          icon="text"
          title="Darstellungsgröße"
          description="Vergrößert Schrift und Bedienelemente, falls die letzte Reihe auf eurem Board schlecht lesen kann."
        >
          <SegmentedControl
            label="Darstellungsgröße"
            options={SCALE_OPTIONS}
            value={settings.uiScale}
            onChange={(uiScale) => appSettingsStore.update({ uiScale })}
          />
        </SettingRow>

        <SettingRow
          icon="reset"
          title="Standardwerte"
          description="Setzt alle Einstellungen dieser Seite auf die Standardwerte zurück."
        >
          <Button variant="danger" icon="reset" onClick={() => setConfirmReset(true)}>
            Zurücksetzen …
          </Button>
        </SettingRow>
      </div>

      <aside className={styles.facts} aria-label="Hinweise">
        <p>
          <Icon name="info" className={styles.factIcon} />
          <span>
            <strong>Bewusst tonlos.</strong> TafelArena gibt keine Geräusche aus – alle Rückmeldungen sind visuell,
            damit das Gespräch in der Klasse im Mittelpunkt steht.
          </span>
        </p>
        <p>
          <Icon name="check" className={styles.factIcon} />
          <span>
            <strong>Keine Schülerdaten.</strong> Es werden keine Namen, Leistungen oder Kartenzuordnungen gespeichert
            und keine Daten an Dritte übertragen.
          </span>
        </p>
        <p>
          <Icon name="expand" className={styles.factIcon} />
          <span>
            <strong>Tastenkürzel:</strong> <kbd>F</kbd> schaltet den Vollbildmodus um.
          </span>
        </p>
      </aside>

      {!appSettingsStore.isPersisted() && (
        <p className={styles.warning} role="status">
          Die Einstellungen konnten in diesem Browser nicht dauerhaft gespeichert werden und gelten nur bis zum
          Schließen der Seite.
        </p>
      )}

      <ConfirmDialog
        open={confirmReset}
        title="Einstellungen zurücksetzen?"
        message="Animationen und Darstellungsgröße werden auf die Standardwerte zurückgesetzt."
        confirmLabel="Zurücksetzen"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          appSettingsStore.reset();
          setConfirmReset(false);
        }}
      />
    </main>
  );
}
