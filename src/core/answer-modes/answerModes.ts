/**
 * Catalogue of the game-independent answer modes (see docs/PEDAGOGY.md).
 * Phase 1 only describes them; the interactive flow follows in Phase 2.
 */
export type AnswerModeId = 'hidden-cards' | 'team-consult' | 'open-round' | 'class-coop' | 'free-control';

export interface AnswerModeInfo {
  id: AnswerModeId;
  label: string;
  summary: string;
}

export const ANSWER_MODES: Readonly<Record<AnswerModeId, AnswerModeInfo>> = {
  'hidden-cards': {
    id: 'hidden-cards',
    label: 'Verdecktes Kartenduell',
    summary: 'Alle denken nach – erst danach wird ein Kartenwert gezogen. Nur wer ihn verdeckt hält, antwortet.',
  },
  'team-consult': {
    id: 'team-consult',
    label: 'Mannschaftsberatung',
    summary: 'Jede Mannschaft berät gemeinsam und einigt sich auf eine Antwort.',
  },
  'open-round': {
    id: 'open-round',
    label: 'Offene Klassenrunde',
    summary: 'Die Frage geht an alle, die Lehrkraft vergibt den Spielzug.',
  },
  'class-coop': {
    id: 'class-coop',
    label: 'Kooperativer Klassenmodus',
    summary: 'Die ganze Klasse arbeitet gemeinsam auf ein Ziel hin.',
  },
  'free-control': {
    id: 'free-control',
    label: 'Freie Lehrkraftsteuerung',
    summary: 'Ohne Vorbereitung: mündlich fragen und Spielzüge direkt vergeben.',
  },
};
