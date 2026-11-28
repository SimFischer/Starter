# Roadmap

**Aktuelle Phase:** 3 – Pferderennen & Vier gewinnt ✅ umgesetzt (2026-11-27), Branch `phase-3/pferderennen-vier-gewinnt` (baut auf `phase-2/tafelfussball` auf). Offen: Erprobung im echten Unterricht.
**Nächste Phase:** 4 – Fragenbibliothek & KI-Prompt-Generator (wartet auf Freigabe).

## Phase 1 – Projektfundament (erledigt, 2026-11-25)

Doku, Vite/React/TS-Gerüst, Designsystem, UI-Komponenten, Startseite, Registry, Einstellungen, Vollbild, Skalierung.

## Phase 2 – Tafelfußball (erledigt, 2026-11-26)

- **Gemeinsame Systeme (für alle weiteren Spiele):**
  - `core/teams` – Mannschaften (Name, Farbe, Symbol), garantiert unterscheidbar (Farbe und Symbol)
  - `core/game-session/history` – Rückgängig über den vollständigen Spielzustand
  - `core/answer-modes/cardPool` – Kartenpool: Spielkarten 2–Ass oder Nummern 1–40, Auswahl der ausgeteilten Werte, mit/ohne Zurücklegen, automatisch/manuell neu mischen, kein doppelter Wert pro Runde
  - `core/answer-modes/useAnswerRound` – Rundenablauf für Kartenduell, Mannschaftsberatung, offene Runde, freie Steuerung (Bedenkzeit, +15 s, Ziehen, manuelle Wahl, weitere Karte, Runde ohne Wertung)
  - `core/settings/persistedSettings` – zuletzt verwendete Spieleinstellungen
  - `components/game` – TeamEditor, TeamSymbol, PlayingCard, CountdownRing, RoundStage, RoundControls, Confetti
  - Registry: `load` für spielbare Spiele (Code-Splitting), Route `#/spiel/<id>`, Kachel „Spielbereit"
- **Tafelfußball:** Setup (Mannschaften, Antwortmodus, Tore bis Sieg 1/3/5/offen, Spielzeit, Erweitert: Felder je Hälfte 2–5, 1–2 Felder je Antwort, Bedenk-/Beratungszeit, Kartenpool), Stadion-Spielwelt, Ballbewegung, Torjubel (überspringbar), Sieg/Unentschieden/Endstand, Revanche, Pause (hält alle Timer an), Spiel beenden mit Bestätigung, Rückgängig (auch nach Tor und Spielende), Eingabesperre während der Ballbewegung, Tastenkürzel.
- **Geprüft:** 27 Unit-Tests (Fußballregeln, Undo, Kartenpool, Einstellungen, Registry, Router), Typecheck, Build; im Browser: Kartenduell, Beratung, Tor-Ablauf, Rückgängig während Torjubel, Doppeltipp-Sperre, Sieg, Revanche, manuelles Ende + Rückgängig, Pause friert Timer ein, Kartenwahl-Dialog, 1366×768 / 1920×1080 / 3840×2160.

## Phase 3 – Pferderennen & Vier gewinnt (erledigt, 2026-11-27)

- **Gemeinsamer Spielrahmen:** `useGameSession` (History/Undo, Pause, Eingabesperre, Spieluhr), `GameShell` (Anzeigetafel, Bühne mit Rundenanzeige, Steuerleiste, Pause, Beenden-Bestätigung, Tastenkürzel), `GameModule` (Setup → Spiel → Revanche), Setup-Bausteine (`SetupLayout`, `TeamsSection` für 2–4 Mannschaften, `ModeSection`, `AnswerAdvanced`), `answerSettings`, `sanitizeTeams`. Tafelfußball darauf umgestellt (gespeicherte Einstellungen bleiben kompatibel).
- **Pferderennen:** 2–4 Mannschaften, Streckenlänge 6–15 Etappen, 1–2 Etappen je Antwort, „Starker Zug ×2“ für den nächsten Spielzug, optionale Spielzeit, Galopp-Animation, Fortschritt je Bahn, Zieleinlauf, Platzierung mit geteilten Plätzen. Spielwelt im Tageslicht-Stil „Kreide & Gold“ (Kreide-Etappenmarken, Kreide-Zielband).
- **Vier gewinnt:** Brett 6×5 / 7×6 / 8×7, Modus „Wer richtig antwortet, setzt“ oder „Abwechselnd“ (mit „Weitergeben“), Spaltenwahl per Tippen oder Ziffer, fallende Holzsteine mit Symbolen, Gewinnreihe mit Kreidestrich, Unentschieden bei vollem Brett, Abbrechen eines gewährten Zugs. Holzbrett vor Schultafel.
- **Geprüft:** 45 Unit-Tests (u. a. Gewinnerkennung in allen Richtungen, Platzierungen, Einstellungs-Bereinigung), Typecheck, Build; im Browser: Pferderennen mit 4 Mannschaften inkl. ×2 und Zieleinlauf, Vier gewinnt in beiden Zugmodi inkl. Sieg und Rückgängig, Tafelfußball-Regression (Tor, Überspringen, Pause), 1366×768 / 1920×1080 / 3840×2160 sowie 4:3.

## Später

Phase 4 Fragenbibliothek + KI-Prompt-Generator · Phase 5 Bosskampf · Phase 6 Jeopardy + Memory · Phase 7 Schatzsuche · Phase 8 QS + Veröffentlichung (Details: `docs/MASTERPLAN.md`).

## Bekannte Einschränkungen

- **Noch keine Unterrichtserprobung** am echten Smartboard (nur Browser-Emulation; Animationen bei ausgeblendetem Vorschaufenster nur per Skript geprüft).
- Fragen werden in Phase 2 mündlich gestellt; Fragenanzeige und „Musterlösung zeigen" folgen mit der Fragenbibliothek (Phase 4).
- Vier gewinnt: Ein gewährter, noch nicht gesetzter Stein wird mit „Rückgängig“ zuerst zurückgenommen.
- Rückgängig betrifft den Spielstand, nicht bereits gezogene Kartenwerte (Kartenwahl ist jederzeit manuell möglich).
- Wird ein durch Zeitablauf beendetes Spiel rückgängig gemacht, läuft es ohne Restzeit weiter (Ende dann manuell).
- Ein laufendes Spiel wird beim Neuladen der Seite nicht wiederhergestellt.
- Alle Grafiken sind provisorische SVGs (`docs/ASSETS.md`); kein ESLint; kein GitHub-Actions-Deployment.

## Offene Entscheidungen

- Produktname „TafelArena" vs. „TafelStarter" – aktuell TafelArena.
- Spielname „Jeopardy" vor Veröffentlichung prüfen.
