# Roadmap

**Aktuelle Phase:** 2 – Tafelfußball ✅ umgesetzt (2026-11-26), Branch `phase-2/tafelfussball`. Offen: Erprobung im echten Unterricht.
**Nächste Phase:** 3 – Pferderennen & Vier gewinnt (wartet auf Freigabe).

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

## Phase 3 – Pferderennen & Vier gewinnt (offen)

Wiederverwendung von Teams, History, Antwortmodi, Setup-Bausteinen; je Spiel: Logik + Tests, Setup, Spielwelt, Animationen. Pferderennen benötigt 2–4 Mannschaften → Teamauswahl auf n Mannschaften erweitern (TeamEditor ist bereits dafür ausgelegt).

## Später

Phase 4 Fragenbibliothek + KI-Prompt-Generator · Phase 5 Bosskampf · Phase 6 Jeopardy + Memory · Phase 7 Schatzsuche · Phase 8 QS + Veröffentlichung (Details: `docs/MASTERPLAN.md`).

## Bekannte Einschränkungen

- **Noch keine Unterrichtserprobung** am echten Smartboard (nur Browser-Emulation; Animationen bei ausgeblendetem Vorschaufenster nur per Skript geprüft).
- Fragen werden in Phase 2 mündlich gestellt; Fragenanzeige und „Musterlösung zeigen" folgen mit der Fragenbibliothek (Phase 4).
- Rückgängig betrifft den Spielstand, nicht bereits gezogene Kartenwerte (Kartenwahl ist jederzeit manuell möglich).
- Wird ein durch Zeitablauf beendetes Spiel rückgängig gemacht, läuft es ohne Restzeit weiter (Ende dann manuell).
- Ein laufendes Spiel wird beim Neuladen der Seite nicht wiederhergestellt.
- Alle Grafiken sind provisorische SVGs (`docs/ASSETS.md`); kein ESLint; kein GitHub-Actions-Deployment.

## Offene Entscheidungen

- Produktname „TafelArena" vs. „TafelStarter" – aktuell TafelArena.
- Spielname „Jeopardy" vor Veröffentlichung prüfen.
