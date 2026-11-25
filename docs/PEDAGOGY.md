# Pädagogik und Antwortmodi

Verbindlich für alle Spielmodule.

## Leitprinzipien

1. **Gemeinschaftlicher Erfolg.** Gespielt wird als Mannschaften oder als ganze Klasse. Keine individuellen Ranglisten, Punktestände, Leistungsprofile, Fehlerstatistiken oder Gewinner-/Verliereranzeigen für einzelne Kinder.
2. **Keine Bloßstellung.** Keine individuellen Fehleranzeigen, beschämenden Animationen, personenbezogenen Statistiken, kein Ausscheiden Einzelner, keine Antwortpflicht Einzelner, keine sichtbare Zuordnung Fehler ↔ Kind. Falsche Antworten führen standardmäßig weder zu Abzügen noch zu negativen Spielereignissen. Ein Kind darf eine Antwort schuldig bleiben, ohne dass die App es hervorhebt.
3. **Kognitive Aktivierung.** Erst denken alle nach, dann wird entschieden, wer antwortet. Nicht nur Schnelligkeit belohnen; unterschiedliche Antwortmodi und flexible Bedenkzeiten.
4. **Fehlerfreundlichkeit.** Die Lehrkraft kann jederzeit: Runde ohne Wertung beenden, Frage überspringen, Antwort gemeinsam besprechen, fehlerhaft vergebenen Spielzug rückgängig machen, neue Antwortmöglichkeit eröffnen.
5. **Zeitökonomie.** Start in wenigen Klicks; sinnvolle Standardwerte, zuletzt verwendete Einstellungen, Schnellstart. Keine erzwungene Vorbereitung.
6. **Lehrkraftautonomie.** Die Lehrkraft entscheidet über richtig/falsch, akzeptable Alternativen, Bedenkzeit, Spielzüge, Schwierigkeit, Tempo, Unterbrechungen und Spielende. Die App unterstützt, ersetzt aber keine pädagogischen Entscheidungen.

## Spielübergreifende Antwortmodi

Zentral und spielunabhängig implementiert (`src/core/answer-modes/`). Jedes Spiel bietet nur die sinnvoll kombinierbaren Modi an (siehe `GAME_RULES.md`).

### 1. Verdecktes Kartenduell (Alleinstellungsmerkmal)

Physische Spielkarten werden verdeckt verteilt (z. B. Herz = Mannschaft A, Pik = Mannschaft B). Der eigene Kartenwert bleibt möglichst geheim.

*Beispiel:* Lea hat Herz-7, Martin Pik-7. Die Lehrkraft fragt die ganze Klasse, alle denken nach. Dann: „Die Siebenen antworten!" Lea antwortet richtig → Spielzug für Herz. Martin weiß es nicht – da niemand wissen muss, wer Pik-7 hat, wird das nicht öffentlich. **Diese Grundidee ist unbedingt zu erhalten.**

**Ablauf:** Frage stellen → Bedenkzeit für alle → Lehrkraft beendet Bedenkzeit → App zieht Kartenwert (oder manuelle Wahl) → nur passende Kartenwerte antworten → Lehrkraft bewertet → erfolgreiche Mannschaft erhält Spielzug → neue Runde.

**Anforderungen:**
- Hochwertige visuelle Kartenenthüllung; Kartenwert erst nach der Bedenkzeit.
- Zufällige und manuelle Kartenauswahl; einstellbare Bedenkzeit; Antwortphase verlängerbar.
- Kartenpool einstellbar: Werte 2–Ass, Farben Pik/Herz/Karo/Kreuz, alternative Nummernsysteme, optional eigene Symbole.
- Ziehen mit/ohne Zurücklegen; Pool manuell oder optional automatisch zurücksetzen.
- Weiteren Kartenwert freigeben; Runde ohne Wertung beenden.
- Größere Pools, mehrere Kartensätze, unterschiedliche Mannschaftsgrößen, mehrfach vorkommende Werte, nummerierte Karten (ein Skatblatt hat nur 8 Karten pro Farbe – 27 Kinder passen nicht in zwei Farben). Die Lehrkraft legt fest, welche Werte tatsächlich verteilt wurden.
- **Die App erfasst niemals, welches Kind welche Karte hat.**
- Geschwindigkeitsduelle möglich, aber nie die einzige Mechanik.

### 2. Mannschaftsberatung
Mannschaften beraten gemeinsam (einstellbare Beratungszeit), die Lehrkraft bewertet.

### 3. Offene Klassenrunde
Frage an alle; die Lehrkraft spricht einer Mannschaft den Spielzug zu.

### 4. Kooperativer Klassenmodus
Die ganze Klasse arbeitet auf ein gemeinsames Ziel hin, keine gegnerische Schülergruppe.

### 5. Freie Lehrkraftsteuerung
Spielzüge direkt vergeben – ohne Fragensammlung, Kartenziehung, Pflicht-Bedenkzeit oder automatische Prüfung. Für den spontanen Einsatz (z. B. Tafelfußball starten und sofort mündlich Vokabeln abfragen). **Jedes Spiel unterstützt diesen Modus.**
