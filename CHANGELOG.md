# Changelog

## [0.3.0] – 2026-11-27 – Phase 3: Pferderennen & Vier gewinnt

### Hinzugefügt
- **Pferderennen spielbar:** 2–4 Mannschaften, einstellbare Streckenlänge, Spielzüge unterschiedlicher Stärke („Starker Zug ×2“), Galopp-Animation, Fortschritt je Bahn, Zieleinlauf und Platzierung (gleicher Fortschritt = gleicher Platz).
- **Vier gewinnt spielbar:** drei Brettgrößen, „Wer richtig antwortet, setzt“ oder „Abwechselnd“ mit „Weitergeben“, Spaltenwahl per Tippen oder Zifferntaste, fallende Steine mit Symbolen, Gewinnreihe mit Kreidestrich, Unentschieden-Erkennung.
- Gemeinsamer Spielrahmen für alle Mannschaftsspiele (Anzeigetafel, Steuerleiste, Pause, Beenden, Tastenkürzel, Ergebnisanzeige) und gemeinsame Setup-Bausteine inkl. 2–4 Mannschaften.

### Geändert
- Tafelfußball nutzt den gemeinsamen Spielrahmen (Verhalten unverändert).
- Steuerleiste bricht auf schmaleren Bildschirmen (unter 3:2) in zwei Zeilen um.
- Bildsprache „Kreide & Gold“ festgelegt (handgemalte Bilderbuch-Illustration, warmes Tageslicht, Kreide-Elemente als Markenzeichen, Gold als einziger Glanz); Asset-Wunschliste überarbeitet und kopierfertige Bild-Prompts in `docs/ASSET_PROMPTS.md`.

## [0.2.0] – 2026-11-26 – Phase 2: Tafelfußball

### Hinzugefügt
- **Tafelfußball spielbar:** Setup mit Schnellstart (zuletzt verwendete Einstellungen), Mannschaften mit Name/Farbe/Symbol, Antwortmodus, Siegbedingung, Spielzeit und erweiterten Optionen; Stadion-Spielwelt mit Positionen, rollendem Ball, Torjubel mit Konfetti, Sieg-/Unentschieden-/Endstand-Anzeige, Revanche.
- **Verdecktes Kartenduell:** Bedenkzeit-Ring, Kartenenthüllung mit Ansage („Die Siebenen antworten!“), weitere Karte, manuelle Kartenwahl, Spielkarten oder Nummernkarten, mit/ohne Zurücklegen, automatisches oder manuelles Neumischen.
- Mannschaftsberatung, offene Klassenrunde und freie Lehrkraftsteuerung als weitere Antwortmodi.
- Rückgängig über den ganzen Spielstand (auch nach Tor und Spielende), Pause mit angehaltenen Timern, Runde ohne Wertung, Bestätigung vor Spielende, Eingabesperre während der Ballbewegung.
- Tastenkürzel im Spiel: → / 1 und ← / 2 (Spielzug), Leertaste (nächster Rundenschritt), P / Esc (Pause), Rücktaste / Strg+Z (Rückgängig), F (Vollbild).
- Gemeinsame Systeme für weitere Spiele: Mannschaften, Spielverlauf mit Undo, Kartenpool, Rundenablauf, gespeicherte Spieleinstellungen, Spielkomponenten.
- Startseite: Tafelfußball als „Spielbereit“, Start mit einem Klick; Spiele werden bei Bedarf nachgeladen.

## [0.1.0] – 2026-11-25 – Phase 1: Projektfundament

### Hinzugefügt
- Projektgerüst: Vite 8, React 19, TypeScript (strict), Vitest; GitHub-Pages-tauglicher statischer Build.
- Designsystem mit Tokens, lokal gebündelten Schriften und viewport-proportionaler Smartboard-Skalierung.
- UI-Komponenten: Button, Badge, SegmentedControl, Dialog, ConfirmDialog, Icon, Header-Navigation, Wortmarke, Spielkachel.
- Startseite mit sieben Spielkacheln (provisorische SVG-Illustrationen, Status „In Entwicklung") und Kachel zum verdeckten Kartenduell.
- Game-Registry und Katalog der fünf Antwortmodi.
- Einstellungen: Animationen, Darstellungsgröße, Zurücksetzen; Vollbild per Schaltfläche und Taste F.
- Vorschauseiten für Fragenbibliothek und KI-Prompt-Generator (als „Geplant" gekennzeichnet).
- Projektdokumentation (CLAUDE.md, MASTERPLAN, PEDAGOGY, GAME_RULES, DESIGN_SYSTEM, DATA_SCHEMA, ASSETS, ROADMAP).
