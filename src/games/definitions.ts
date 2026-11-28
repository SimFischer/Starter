import type { GameDefinition } from '../core/games/types';
import { FootballIllustration } from './football/Illustration';
import { HorseRaceIllustration } from './horse-race/Illustration';
import { ConnectFourIllustration } from './connect-four/Illustration';
import { BossBattleIllustration } from './boss-battle/Illustration';
import { JeopardyIllustration } from './jeopardy/Illustration';
import { MemoryIllustration } from './memory/Illustration';
import { TreasureHuntIllustration } from './treasure-hunt/Illustration';

/**
 * Launcher metadata of all game modules, in display order.
 * Playable games register their lazily loaded screen via `load`;
 * all others stay visibly 'in-development'.
 */
export const GAME_DEFINITIONS: readonly GameDefinition[] = [
  {
    id: 'football',
    title: 'Tafelfußball',
    genre: 'Mannschaftsduell',
    tagline: 'Jede richtige Antwort bringt den Ball ein Feld näher ans gegnerische Tor.',
    description:
      'Zwei Mannschaften spielen im Flutlichtstadion gegeneinander. Richtige Antworten bewegen den Ball Richtung Tor – erreicht er es, zählt der Treffer und der Ball startet wieder am Anstoßpunkt. Auch ganz spontan mit mündlichen Fragen spielbar.',
    playStyle: 'competitive',
    teams: { min: 2, max: 2 },
    answerModes: ['hidden-cards', 'team-consult', 'open-round', 'free-control'],
    contentType: 'questions',
    accent: { primary: '#2FBF71', secondary: '#8EE4AF' },
    status: 'playable',
    plannedPhase: 2,
    Illustration: FootballIllustration,
    load: () => import('./football/FootballModule'),
  },
  {
    id: 'horse-race',
    title: 'Pferderennen',
    genre: 'Mannschaftswettlauf',
    tagline: 'Bis zu vier Pferde galoppieren mit jeder richtigen Antwort Richtung Ziel.',
    description:
      'Zwei bis vier Mannschaften schicken je ein Pferd auf die Rennbahn. Jede richtige Antwort bringt das eigene Pferd voran, der Fortschritt aller bleibt jederzeit sichtbar. Wer zuerst die Ziellinie erreicht, gewinnt das Rennen.',
    playStyle: 'competitive',
    teams: { min: 2, max: 4 },
    answerModes: ['hidden-cards', 'team-consult', 'open-round', 'free-control'],
    contentType: 'questions',
    accent: { primary: '#E0A040', secondary: '#B9844F' },
    status: 'playable',
    plannedPhase: 3,
    Illustration: HorseRaceIllustration,
    load: () => import('./horse-race/HorseRaceModule'),
  },
  {
    id: 'connect-four',
    title: 'Vier gewinnt',
    genre: 'Strategie & Mannschaftsduell',
    tagline: 'Richtig geantwortet? Dann berät die Mannschaft, wohin ihr Stein fällt.',
    description:
      'Zwei Mannschaften versuchen, vier Steine in eine Reihe zu bringen – waagerecht, senkrecht oder diagonal. Eine richtige Antwort berechtigt zum Zug, die Mannschaft entscheidet gemeinsam über die beste Spalte.',
    playStyle: 'competitive',
    teams: { min: 2, max: 2 },
    answerModes: ['hidden-cards', 'team-consult', 'open-round', 'free-control'],
    contentType: 'questions',
    accent: { primary: '#E5484D', secondary: '#3E8BFF' },
    status: 'playable',
    plannedPhase: 3,
    Illustration: ConnectFourIllustration,
    load: () => import('./connect-four/ConnectFourModule'),
  },
  {
    id: 'boss-battle',
    title: 'Bosskampf',
    genre: 'Kooperative Klassenmission',
    tagline: 'Die ganze Klasse gemeinsam gegen einen fantastischen Endgegner.',
    description:
      'Alle kämpfen zusammen: Jede richtige Antwort löst einen magischen Angriff aus und schwächt den Endgegner. Es gibt keine gegnerische Mannschaft – der Sieg gehört der ganzen Klasse. Falsche Antworten schaden niemandem.',
    playStyle: 'cooperative',
    teams: null,
    answerModes: ['class-coop', 'free-control'],
    contentType: 'questions',
    accent: { primary: '#8B5CF6', secondary: '#FF8A3D' },
    status: 'in-development',
    plannedPhase: 5,
    Illustration: BossBattleIllustration,
  },
  {
    id: 'jeopardy',
    title: 'Jeopardy',
    genre: 'Wissensquiz',
    tagline: 'Kategorie wählen, Punktwert wagen – je schwieriger, desto wertvoller.',
    description:
      'Die Mannschaften wählen Felder aus einem Raster aus Kategorien und Schwierigkeitsstufen. Anspruchsvollere Fragen bringen mehr Punkte, falsche Antworten kosten standardmäßig nichts. Benötigt eine vorbereitete Jeopardy-Sammlung.',
    playStyle: 'competitive',
    teams: { min: 2, max: 4 },
    answerModes: ['team-consult', 'open-round', 'hidden-cards', 'free-control'],
    contentType: 'jeopardy',
    accent: { primary: '#2F5BEA', secondary: '#E8B95B' },
    status: 'in-development',
    plannedPhase: 6,
    Illustration: JeopardyIllustration,
  },
  {
    id: 'memory',
    title: 'Memory',
    genre: 'Zuordnung & Gedächtnis',
    tagline: 'Begriff und Definition, Vokabel und Übersetzung: Finde, was zusammengehört.',
    description:
      'Gesucht werden fachlich zusammengehörige Paare statt identischer Bilder – etwa Jahreszahl und Ereignis oder Rechenaufgabe und Ergebnis. Als ganze Klasse oder in Mannschaften spielbar; nicht passende Karten drehen sich neutral zurück.',
    playStyle: 'flexible',
    teams: { min: 2, max: 4 },
    answerModes: ['class-coop', 'team-consult', 'free-control'],
    contentType: 'memory',
    accent: { primary: '#2CC7C0', secondary: '#3A86FF' },
    status: 'in-development',
    plannedPhase: 6,
    Illustration: MemoryIllustration,
  },
  {
    id: 'treasure-hunt',
    title: 'Schatzsuche',
    genre: 'Abenteuer & Entdeckung',
    tagline: 'Richtige Antworten öffnen Schatztruhen voller Gold und Edelsteine.',
    description:
      'Auf einer Schatzkarte warten verdeckte Truhen. Jede richtige Antwort öffnet eine davon. Wie stark der Zufall die Belohnungen bestimmt, legt die Lehrkraft fest – von gleichwertigen Truhen bis zu seltenen Bonusfunden.',
    playStyle: 'flexible',
    teams: { min: 2, max: 4 },
    answerModes: ['hidden-cards', 'team-consult', 'open-round', 'class-coop', 'free-control'],
    contentType: 'questions',
    accent: { primary: '#E8B95B', secondary: '#1FA3A6' },
    status: 'in-development',
    plannedPhase: 7,
    Illustration: TreasureHuntIllustration,
  },
];
