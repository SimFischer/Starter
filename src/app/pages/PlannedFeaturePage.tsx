import { ROUTE_PATHS } from '../router';
import { Badge } from '../../components/ui/Badge';
import { ButtonLink } from '../../components/ui/Button';
import { Icon, type IconName } from '../../components/ui/Icon';
import styles from './PlannedFeaturePage.module.css';

export interface PlannedFeature {
  icon: IconName;
  eyebrow: string;
  title: string;
  lead: string;
  phase: number;
  steps: readonly string[];
}

export const LIBRARY_FEATURE: PlannedFeature = {
  icon: 'library',
  eyebrow: 'Fragenbibliothek',
  title: 'Eigene Fragensammlungen – einmal anlegen, in jedem Spiel nutzen',
  lead: 'Sammlungen werden lokal im Browser gespeichert und lassen sich nach Fach, Klassenstufe und Thema ordnen. Bis dahin funktionieren alle Spiele auch spontan mit mündlich gestellten Fragen.',
  phase: 4,
  steps: [
    'Sammlungen erstellen, bearbeiten, duplizieren und löschen',
    'Nach Fach, Klassenstufe und Thema filtern',
    'Als Datei exportieren und sichern',
    'Allgemeine Fragen, Jeopardy-Raster und Memory-Paare',
  ],
};

export const PROMPT_FEATURE: PlannedFeature = {
  icon: 'sparkles',
  eyebrow: 'KI-Prompt-Generator',
  title: 'Fragensammlungen mit ChatGPT oder Claude erstellen – ohne JSON-Kenntnisse',
  lead: 'TafelArena erzeugt einen passenden Prompt für Fach, Klassenstufe und Thema. Das Ergebnis wird eingefügt, geprüft und gespeichert. Es fallen keine Kosten an, TafelArena nutzt keine eigene KI-Schnittstelle.',
  phase: 4,
  steps: [
    'Fach, Klassenstufe, Thema und Umfang wählen',
    'Prompt mit einem Klick kopieren',
    'Antwort der KI einfügen oder als Datei hochladen',
    'Inhalte in der Vorschau fachlich prüfen und speichern',
  ],
};

/** Clearly labelled placeholder for a not yet implemented area – no fake controls. */
export function PlannedFeaturePage({ feature }: { feature: PlannedFeature }) {
  return (
    <main className={styles.page} id="main" tabIndex={-1}>
      <div className={styles.emblem} aria-hidden="true">
        <Icon name={feature.icon} />
      </div>
      <div className={styles.text}>
        <div className={styles.badges}>
          <span className={styles.eyebrow}>{feature.eyebrow}</span>
          <Badge tone="planned">Geplant · Phase {feature.phase}</Badge>
        </div>
        <h1 className={styles.heading}>{feature.title}</h1>
        <p className={styles.lead}>{feature.lead}</p>
        <ol className={styles.steps}>
          {feature.steps.map((step, i) => (
            <li key={step}>
              <span className={styles.stepNo}>{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
        <ButtonLink href={ROUTE_PATHS.home} variant="primary" size="lg" icon="back">
          Zur Spielesammlung
        </ButtonLink>
      </div>
    </main>
  );
}
