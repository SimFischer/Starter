# Roadmap

**Aktuelle Phase:** 1 – Projektfundament ✅ abgeschlossen (2026-11-25), Branch `phase-1/fundament`.
**Nächste Phase:** 2 – Tafelfußball (wartet auf Freigabe).

## Phase 1 – erledigt

- Projektdokumentation (CLAUDE.md, docs/*, README, CHANGELOG)
- Vite 8 + React 19 + TypeScript strict + Vitest; relative Pfade + Hash-Routing (GitHub Pages)
- Designsystem: Tokens, lokale Schriften (Bricolage Grotesque, Lexend), viewport-proportionale Skalierung
- UI-Komponenten: Button/ButtonLink, Badge, SegmentedControl, Dialog/ConfirmDialog, Icon, AppHeader, Wordmark, GameTile
- Startseite mit 7 Spielkacheln + Antwortmodus-Kachel, Detaildialoge, alles als „In Entwicklung" markiert
- Game-Registry (`src/games/definitions.ts`, `src/core/games/`) inkl. Antwortmodi-Katalog
- Einstellungen (Animationen, Darstellungsgröße, Reset mit Bestätigung), sicher in localStorage
- Vollbild (Button + Taste F), prefers-reduced-motion
- Geprüft: 1366×768, 1920×1080, 3840×2160 (kein Scrollen, keine Konsolenfehler); 11 Unit-Tests, Typecheck, Build grün

## Phase 2 – Tafelfußball (offen)

1. Spielsitzungs-Kern: Mannschaften (Name, Farbe, Symbol), Zustandsverlauf mit Rückgängig, Pause, Ende
2. Antwortmodi-Ablauf: Bedenkzeit, Kartenduell (Pool, Ziehen mit/ohne Zurücklegen, manuelle Wahl, Kartenenthüllung), Beratung, offene Runde, freie Steuerung
3. Spiel-Setup: Schnellstart / Grundlegend / Erweitert, letzte Einstellungen speichern
4. Fußball-Logik (Positionen, Tore, Siegbedingung, Zeitlimit/offenes Ende) + Tests
5. Spielwelt, Ballbewegung, Toranimation, Lehrkraft-Steuerleiste, Tastenkürzel
6. Unterrichtserprobung

**Abhängigkeiten:** Assets aus `docs/ASSETS.md` (Tafelfußball) wünschenswert, nicht blockierend (SVG-Platzhalter möglich). Motion ggf. als Abhängigkeit für Ballbewegung/Toranimation.

## Später

Phase 3 Pferderennen + Vier gewinnt · Phase 4 Fragenbibliothek + KI-Prompt-Generator · Phase 5 Bosskampf · Phase 6 Jeopardy + Memory · Phase 7 Schatzsuche · Phase 8 QS + Veröffentlichung (Details: `docs/MASTERPLAN.md`).

## Bekannte Einschränkungen

- Alle Spielillustrationen und die Wortmarke sind **provisorische SVGs** (siehe `docs/ASSETS.md`).
- Kein Spiel ist spielbar; Fragenbibliothek und KI-Prompt-Generator sind nur Vorschauseiten.
- Kein Linting (ESLint) eingerichtet; Strenge über TypeScript.
- Visuelle Prüfung nur im Browser-Emulator, noch nicht auf echtem Smartboard/Touch-Gerät.
- Vollbild wird auf iPhone/iPad-Safari nicht unterstützt (Schaltfläche dort deaktiviert).
- GitHub-Actions-Deployment noch nicht eingerichtet (bewusst, erst nach Freigabe).

## Offene Entscheidungen

- Produktname: „TafelArena" (Anwendung) vs. „TafelStarter" (Projektname im Auftrag) – aktuell TafelArena.
- Spielname „Jeopardy" vor Veröffentlichung prüfen.
