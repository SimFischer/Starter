# Spielregeln und Anforderungen der sieben Spielmodule

Gemeinsam für alle: Rückgängig-Funktion (letzter logischer Zustand inkl. Punkte/Fortschritt), Pause, manuelles Spielende, Freie Lehrkraftsteuerung, keine Abzüge für falsche Antworten (Standard), eigene visuelle Identität im gemeinsamen Designsystem, Mannschaften zusätzlich zur Farbe über Symbol/Form/Muster unterscheidbar. Antwortmodi siehe `PEDAGOGY.md`.

| Spiel | Typ | Mannschaften | Antwortmodi | Daten | Akzent | Phase |
|---|---|---|---|---|---|---|
| Tafelfußball | Mannschaftsduell | 2 | Karten, Beratung, Offen, Frei | Fragen | Smaragdgrün | 2 |
| Pferderennen | Mannschaftswettlauf | 2–4 | Karten, Beratung, Offen, Frei | Fragen | Bernstein, Naturtöne | 3 |
| Vier gewinnt | Strategie & Duell | 2 | Karten, Beratung, Offen, Frei | Fragen | Rot & Blau | 3 |
| Bosskampf | Kooperative Mission | Klasse | Kooperativ, Frei | Fragen | Violett & Feuerorange | 5 |
| Jeopardy | Wissensquiz | 2–4 | Beratung, Offen, Karten, Frei | Jeopardy | Königsblau & Gold | 6 |
| Memory | Zuordnung | Klasse oder 2–4 | Kooperativ, Beratung, Frei | Memory | Türkis & Blau | 6 |
| Schatzsuche | Abenteuer | Klasse oder 2–4 | alle | Fragen | Gold & Petrol | 7 |

Die Metadaten sind in `src/games/definitions.ts` hinterlegt und per Test (`tests/registry.test.ts`) abgesichert.

## Tafelfußball
**Idee:** Zwei Mannschaften im stilisierten Stadion. Richtige Antwort → Ball eine Position Richtung gegnerisches Tor. Ball im Tor → Punkt, Neustart in der Mitte.
**Funktionen:** Namen, Farben, Symbole anpassbar; Anzahl Spielfeldpositionen; Toranzahl als Siegbedingung; optional Zeitlimit oder offenes Ende; Spielstand; Spielzüge über eine oder mehrere Positionen; Rückgängig, Pause, manuelles Ende.
**Visuell:** Große Spielfläche, Tribünen, Flutlicht, klar erkennbare Positionen, animierte Ballbewegung, sichtbare Tore, Toranimation (deutliches Ereignis ohne den Unterricht aufzuhalten), Konfetti/positive Effekte, hervorgehobener Spielstand.

## Pferderennen
**Idee:** 2–4 Mannschaften mit je einem Pferd. Richtige Antwort → Fortschritt. Wer zuerst im Ziel ist, gewinnt.
**Funktionen:** individuelle Pferde und Farben; Streckenlänge/Etappenzahl; Spielzüge unterschiedlicher Stärke; Fortschrittsanzeige; Zielerkennung; Platzierung; Rückgängig; optionales Zeitlimit.
**Visuell:** stilisierte Pferde, seitliche/leicht perspektivische Strecke, klar getrennte Bahnen, Galoppanimation, Ziellinie, Zieleinlauf, Siegerehrung. Fortschritt aller jederzeit erkennbar. Weitere Landschaften später. Zufallsereignisse nur optional – Antworten bestimmen das Rennen.

## Vier gewinnt
**Idee:** Vier zusammenhängende Steine (waagerecht, senkrecht, diagonal). Richtige Antwort → Stein in beliebige nicht volle Spalte; die Mannschaft berät taktisch.
**Funktionen:** Standard 7×6, optional andere Größen; automatische Gewinn- und Unentschieden-Erkennung; ungültige Züge verhindern; Rückgängig; abwechselnde Züge **oder** „wer richtig antwortet, setzt"; optional direkte Zugvergabe.
**Visuell:** räumliches Brett, fallende Steine mit dezenter Physik, gültige Spalten hervorgehoben, Gewinnreihe deutlich markiert, Siegesanimation. Steine zusätzlich durch Symbole/Muster unterscheidbar.

## Bosskampf
**Idee:** Die ganze Klasse gegen einen fantastischen Endgegner (Drache, Steingolem, Eismonster, Schattenwesen, Mechanischer Wächter). Richtige Antworten = Angriffe, die Lebensenergie senken. Keine gegnerische Schülermannschaft.
**Funktionen:** Lebenspunkte bzw. benötigte Antworten einstellbar; unterschiedlich starke Angriffe; optional Zeitlimit und Bossphasen; Fortschrittsanzeige; Rückgängig; gemeinsamer Klassenerfolg; manuelles Ende.
**Visuell:** atmosphärische Arena, großer Endgegner mit Bewegung, Lebensenergieanzeige, magische/elementare Angriffs- und Treffereffekte, Veränderung je Bossphase, gemeinsame Siegesanimation. Episch, nicht brutal: kein Blut, keine explizite Gewalt. Falsche Antworten schaden der Klasse standardmäßig nicht.

## Jeopardy
**Idee:** Kategorien × Schwierigkeitsstufen; schwierigere Fragen bringen mehr Punkte.
**Funktionen:** 2–4 Mannschaften; Anzahl Kategorien und Fragen pro Kategorie; Kategorienamen; Punktwerte; große Fragenansicht; Musterlösung manuell aufdecken; Punktevergabe durch Lehrkraft; gespielte Felder markiert; optional Joker, Risikofragen, Abschlussfrage; Rückgängig. Keine Minuspunkte (Standard). Benötigt Jeopardy-Datenformat.
**Visuell:** Quizshow-Atmosphäre, großes Raster, gut lesbare Punktwerte, Königsblau/Gold, animiertes Öffnen, klare Punktestände. Eigenständige Gestaltung ohne Logos/Elemente der TV-Sendung. **Vor Veröffentlichung prüfen, ob ein eigener Spielname nötig ist.**

## Memory
**Idee:** Fachlich zusammengehörige Paare finden: Begriff–Definition, Vokabel–Übersetzung, Bild–Begriff, Jahreszahl–Ereignis, Frage–Antwort, Aufgabe–Ergebnis, Person–Beschreibung, Symbol–Bedeutung, Fachbegriff–Beispiel.
**Funktionen:** Anzahl Paare; zufällige Anordnung; automatische Zuordnungsprüfung; kooperativ oder Mannschaften; Anzeigedauer nicht passender Karten; optionale Zeitmessung; eigene Bilder; Rückgängig bei Fehleingaben. Eigenes Memory-Datenformat.
**Visuell:** hochwertige Karten, Umdreh-Animation, klar lesbare Inhalte, positive Hervorhebung gefundener Paare, Fortschrittsanzeige. Nicht passende Karten drehen sich **neutral** zurück. Kartenanzahl passt zu Bildschirm und Textlänge.

## Schatzsuche
**Idee:** Schatzkarte mit Truhen; richtige Antwort öffnet eine Truhe/ein Feld mit Belohnung.
**Funktionen:** Anzahl Truhen; Punktwerte; Goldmünzen und Edelsteine; verdeckte Belohnungen; optionale Bonusfunde; konfigurierbare Verteilung; kooperativ oder Mannschaften; Rückgängig. **Zufallseinfluss konfigurierbar:** mindestens gleichwertige Truhen, zufällig verteilte Werte, optionale seltene Bonusfunde.
**Visuell:** illustrierte Karte, Landschaften, sichtbare Truhen, Öffnungsanimation, Münzen/Edelsteine, Leuchteffekte, Fortschritt/Punkte, Abschlussanimation. Später weitere Karten (Pirateninsel, Tempel, Mittelalter, Wald, Berge).
