# CLAUDE.md – TafelArena

**TafelArena – Gemeinsam spielen. Gemeinsam lernen.** Tonlose, fachunabhängige Spielesammlung für den Unterricht am Smartboard (Kl. 5–10). Die Lehrkraft steuert zentral, Schüler brauchen keine Geräte. Kein Backend, Hosting auf GitHub Pages.

## Verbindliche Grundsätze (Vorrang vor allem anderen)

1. **Vollständig tonlos.** Keine Sounds, Musik, Sprachausgabe, Audiodateien/-bibliotheken, Lautstärke- oder Stummschalter. Jede Rückmeldung ist visuell (Animation, Licht, Partikel, Farbe, Zustandsanzeige).
2. **Pädagogik** (Details: `docs/PEDAGOGY.md`): Erfolg gehört Mannschaften oder der Klasse – keine individuellen Ranglisten, Fehleranzeigen oder Bloßstellung. Falsche Antworten standardmäßig ohne Abzug/negatives Ereignis. Lehrkraft entscheidet über Bewertung, Bedenkzeit, Spielzüge, Ende; Rückgängig, Überspringen und „Runde ohne Wertung" immer möglich. Jedes Spiel ist spontan ohne Fragensammlung spielbar (Freie Lehrkraftsteuerung).
3. **Datenschutz:** Keine Schülerdaten, keine Karte↔Kind-Zuordnung, kein Tracking, keine externen Dienste. Importe sind nicht vertrauenswürdig: validieren, nie als HTML/JS ausführen.
4. **Qualität vor Menge:** Pädagogischer Nutzen › Zuverlässigkeit › visuelle Qualität › Bedienbarkeit › Performance › Wartbarkeit › Ressourceneffizienz. Keine funktionslosen Bedienelemente, die Fertiges vortäuschen – Unfertiges ist sichtbar „In Entwicklung"/„Geplant".

## Effizientes Arbeiten

- Nur relevante Dateien/Abschnitte lesen; Bekanntes nicht erneut lesen; `ROADMAP.md` ist der verbindliche Stand.
- Weiterführende Docs nur bei Bedarf: `docs/MASTERPLAN.md` (Vision, Umfang, Phasen), `docs/PEDAGOGY.md`, `docs/GAME_RULES.md`, `docs/DESIGN_SYSTEM.md`, `docs/DATA_SCHEMA.md`, `docs/ASSETS.md`.
- Keine redundanten Befehle, Builds, Git-Status- oder Speicherstandsprüfungen. Nur benötigte Abhängigkeiten. Funktionierendes nicht ohne Grund umbauen. Keine spekulativen Abstraktionen.
- Risikobasiert testen: gezielt bei geänderter Logik; Spiellogik, Validierung, Speicherung, Import besonders sorgfältig. Typecheck + Tests + Build gebündelt an Meilensteinen. Visuelles per Screenshot (1366×768, 1920×1080, 3840×2160).
- Kompakt berichten; nie behaupten, etwas sei getestet/fertig, wenn nicht.
- Reversible Standardentscheidungen selbst treffen; bei Produktgrundsatzfragen, irreversiblen oder weitreichenden Änderungen fragen. Kein Push/Deploy/destruktive Git-Operation ohne Auftrag. Neue Phasen nur nach Freigabe.

## Workflow

Auftrag erfassen → relevante Infos lesen → betroffenen Code prüfen → umsetzen → risikobasiert prüfen → Fehler beheben → bei Bedarf `ROADMAP.md`/`CHANGELOG.md` aktualisieren → kurze Zusammenfassung.

## Architektur (Kurzfassung)

- React 19 + TypeScript (strict, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`) + Vite 8, Vitest.
- Styling: CSS Modules + Design-Tokens in `src/styles/tokens.css` (kein Tailwind, siehe DESIGN_SYSTEM). Motion nur bei echtem Bedarf.
- Routing: eigener Hash-Router `src/app/router.ts` (GitHub-Pages-tauglich), `base: './'`.
- Skalierung: Root-`font-size` proportional zum Viewport (1rem = 16px bei 1920×1080); Layout in `rem`, Startseite füllt genau einen Bildschirm.
- `src/core/` gemeinsame Systeme: `games/` (Typen, Registry), `teams/`, `game-session/` (Undo-History), `answer-modes/` (Katalog, Kartenpool, `useAnswerRound`), `settings/` (App + `persistedSettings` je Spiel), `storage/`. `src/games/<id>/` je Spielmodul (reine `logic.ts` + Tests, `settings.ts`, Setup, Spielansicht, `…Module.tsx` als lazy Einstieg via `load` in `src/games/definitions.ts`). `src/components/` UI (ui/, layout/, game/, game-tile/, illustrations/). `src/app/` App, Hash-Router (`#/spiel/<id>`), Seiten.
- Spiellogik als reine Funktionen; Spielansicht hält `History<State>`; Antwortmodi über `useAnswerRound` + `RoundControls`/`RoundStage` wiederverwenden. Animationen per CSS (Motion bisher nicht nötig).
- Einstellungen: `localStorage` (Präfix `tafelarena:`), immer über `sanitize…`-Funktionen gelesen. Größere Daten später IndexedDB, Validierung mit Zod (Phase 4).
- Code/Bezeichner englisch, UI und Dokumentation deutsch.

## Befehle

`npm run dev` · `npm test` · `npm run typecheck` · `npm run build` · `npm run preview`
