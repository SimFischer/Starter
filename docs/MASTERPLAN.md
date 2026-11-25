# Masterplan TafelArena

Langfristige Produktvision und übergreifende Anforderungen. Pädagogik → `PEDAGOGY.md`, Spiele → `GAME_RULES.md`, Gestaltung → `DESIGN_SYSTEM.md`, Daten → `DATA_SCHEMA.md`.

## Vision

TafelArena ist eine fachunabhängige Sammlung digitaler Minispiele für das Smartboard – keine Demo, keine gewöhnliche Quizseite, keine lose Minispielsammlung, sondern eine durchdachte Unterrichtsplattform mit einheitlicher visueller Identität. Bewusst **tonlos**: Das Gespräch zwischen Lehrkraft und Klasse steht im Mittelpunkt; trotzdem soll das Spielerlebnis hochwertig, motivierend und atmosphärisch sein.

**Zielgruppe:** Lehrkräfte und Klassen 5–10 aller Schulformen und Fächer. Weder kindlich-verspielt noch nüchterne Verwaltungssoftware – attraktiv für Fünft- wie Zehntklässler.

**Einsatz:** Einstiege, Wiederholung, Vokabeln, Fachbegriffe, Kopfrechnen, Rechtschreibung, Ergebnissicherung, unbenotete Wissensüberprüfung, Aktivierung der ganzen Gruppe, Abschlüsse, spontane Kurzphasen.

**Bedienkonzept:** Die Lehrkraft steuert zentral (Smartboard oder angeschlossener Rechner). Schüler brauchen keine Geräte. Fragen werden mündlich gestellt, aus Sammlungen gezeigt oder spontan ergänzt; die Lehrkraft bewertet und vergibt Spielzüge. **Inhalte und Spielmechanik sind strikt getrennt;** jedes Spiel funktioniert ohne vorbereitete Sammlung.

## Zentrale Spieleinstellungen (ab Phase 2)

Wiederverwendbares, typisiertes Konfigurationssystem. Je nach Spiel: Anzahl/Namen/Farben/Symbole der Mannschaften, Antwortmodus, Kartenpool, Bedenkzeit, Spielzeit, Rundenzahl, Siegbedingungen, Spielfeldgröße, Schwierigkeit und Quelle der Fragen, Stärke von Spielzügen, Animationsintensität, optionale Zufallsereignisse, Sonderregeln.
- Nur relevante Einstellungen zeigen, keine überladenen Menüs.
- Stufen: **Schnellstart** (Standardwerte) · **Grundlegend** · **Erweitert**.
- Zuletzt verwendete Einstellungen je Spiel lokal speichern; Standardwerte jederzeit wiederherstellbar.

## Fragenbibliothek (Phase 4)

Lokal gespeichert: erstellen, bearbeiten, importieren, exportieren, duplizieren, löschen, durchsuchen, nach Fach/Klassenstufe/Thema filtern, spielübergreifend verwenden. Datentypen: allgemeine Fragen (Fußball, Pferderennen, Vier gewinnt, Bosskampf, Schatzsuche), Jeopardy, Memory. Formate → `DATA_SCHEMA.md`. Hinweis an Lehrkräfte: Löschen der Browserdaten löscht Sammlungen → Export/Sicherung anbieten.

## KI-Prompt-Generator (Phase 4/6)

Keine eigene, kostenpflichtige KI-API. Die App erzeugt Prompts für externe KIs (ChatGPT, Claude).

**Ablauf:** Spiel/Sammlungstyp → Fach → Klassenstufe → Thema → Schwierigkeit → Anzahl → optionale Vorgaben → Prompt generieren → mit einem Klick kopieren → in externer KI nutzen → JSON als Datei oder Text importieren → Vorschau prüfen → bearbeiten → speichern → Spiel starten. Die Lehrkraft muss JSON nicht verstehen.

**Prompt muss:** Datenstruktur und valides Beispiel enthalten; Fach, Stufe, Thema, Anzahl berücksichtigen; altersgerechte, fachlich korrekte Inhalte, eindeutige Musterlösungen und ggf. akzeptable Alternativen verlangen; Begleittext verhindern; ausschließlich valides JSON verlangen. Jeopardy: Kategorien und ansteigende Punktwerte. Memory: eindeutige Paare. Allgemeine Fragen bleiben spielübergreifend.

**Optionale Vorgaben:** Fachbegriffe, Unterrichtsinhalte, Schwerpunkte, zu vermeidende Inhalte, Vorwissen, sprachliche Anforderungen, Differenzierung, weitere didaktische Vorgaben.

**Import:** Datei-Upload oder Text einfügen; versionierte Schemas mit Pflichtfeldern; robuste Validierung ohne Absturz; verständliche, konkrete Fehlermeldungen; harmlose Abweichungen (z. B. mitkopierte Markdown-Codeblöcke) kontrolliert bereinigen; Vorschau und Bearbeitung vor Verwendung; Hinweis, dass KI-Inhalte fachlich zu prüfen sind.

## Unterrichtsmodus (ab Phase 2)

Spielwelt im Mittelpunkt, Oberfläche reduziert. Einheitliche Lehrkraftsteuerung, nur aktuell relevante Funktionen: richtige Antwort für Mannschaft A/B/…/Klasse, Spielzug vergeben, nächste Frage, Musterlösung zeigen, Bedenkzeit starten, Antwort freigeben, Kartenwert ziehen, überspringen, Runde ohne Wertung, Rückgängig, Pause, Vollbild, Spiel beenden.

**Fragenanzeige:** groß, sinnvoll umbrochen; Musterlösung verborgen bis zur bewussten Freigabe (nie versehentlich sichtbar); optional Erklärung; überspringbar.

**Eingabesicherheit:** große Schaltflächen, Touch/Maus/Tastatur, sinnvolle Tastenkürzel, keine Mehrfacheingaben während Animationen, nichts nur per Hover erreichbar, Bestätigung vor vollständigem Zurücksetzen.

## Startseite und Navigation

Launcher einer hochwertigen Spielesammlung: Wortmarke + Claim, große individuell illustrierte Spielkacheln mit kurzer Mechanik, Kennzeichnung kooperativ/kompetitiv, Zugänge zu Fragenbibliothek, KI-Prompt-Generator, Einstellungen, Vollbild. Unfertiges eindeutig als „In Entwicklung"/„Geplant" markieren – keine funktionslosen Schaltflächen, die Fertiges vortäuschen.

## Technische Architektur

- **Stack:** React, TypeScript strict, Vite, schlankes Styling (CSS Modules + Tokens), Motion für relevante UI-Animationen (bei Bedarf), SVG für Spielobjekte, Canvas nur mit echtem Mehrwert, localStorage (Einstellungen), IndexedDB (Sammlungen), Zod (Validierung), Vitest; Testing Library/Playwright erst bei konkretem Nutzen.
- **Hosting:** Statischer Build für GitHub Pages (relative Pfade, Hash-Routing). Automatische Veröffentlichung via GitHub Actions erst nach Freigabe. Kein Backend.
- **Modularität:** Jedes Spiel eigenständig unter `src/games/<id>/`; gemeinsame Systeme in `src/core/`. Getrennt: Spiellogik, Zustand, Darstellung, Animation, Eingabe, Fragen, Antwortmodi, Mannschaften, Speicherung, Einstellungen. Schlanke typisierte Game-Registry, keine generische Engine, keine spekulativen Abstraktionen.
- **Abweichungen vom Ursprungsplan (Phase 1):** Kein Tailwind (spielerische, stark individuelle Gestaltung ist mit Tokens + CSS Modules übersichtlicher und abhängigkeitsfrei). Motion und Zod noch nicht installiert, da in Phase 1 nicht benötigt. Eigener ~30-Zeilen-Hash-Router statt Router-Bibliothek. TypeScript 5.9 (statt 7.x) wegen breitester Werkzeugkompatibilität.
- **Datenschutz:** keine Konten, keine Schülerdaten, keine Tracker oder externe Dienste (Schriften lokal gebündelt). Lokal gespeichert: Einstellungen, Mannschaftsnamen/-farben, bevorzugte Modi, Sammlungen. Wiederaufnahme unterbrochener Spiele langfristig, wenn zuverlässig machbar. Importe validieren, Größen begrenzen, nie als Code ausführen.
- **Sprache:** Code englisch, UI und Doku deutsch; spätere Internationalisierung möglich halten, ohne jetzt Infrastruktur dafür einzuführen.

## Entwicklungsphasen

1. **Projektfundament** – Doku, Architektur, Designsystem, UI-Komponenten, Startseite, Navigation, Registry, Einstellungen, Vollbild, Skalierung, Tests, Build.
2. **Tafelfußball** – Spiellogik, Spielwelt, Mannschaften, Spielstand, Siegbedingungen, Lehrkraftsteuerung, verdecktes Kartenduell, Bedenkzeit, Kartenenthüllung, Ballbewegung, Toranimation, Rückgängig, Tests, erste Unterrichtserprobung.
3. **Pferderennen & Vier gewinnt** – Wiederverwendung gemeinsamer Systeme, Logik, Einstellungen, Spielwelten, Animationen, Tests.
4. **Fragenbibliothek & KI-Prompt-Generator** – Datenmodelle, Speicherung, Import/Export, Validierung, Editor, Prompt-Generatoren, Integration, Beispielsammlungen.
5. **Bosskampf** – kooperativer Modus, Lebenspunkte, Endgegner, Phasen, Treffer- und Siegesanimation, Tests.
6. **Jeopardy & Memory** – eigene Datenstrukturen, Logik, Bibliotheks- und Prompt-Integration, Oberflächen, Animationen, Tests.
7. **Schatzsuche** – Karte, Truhen, Belohnungen, konfigurierbarer Zufall, kooperativ/kompetitiv, Animationen, Tests.
8. **Qualitätssicherung & Veröffentlichung** – Smartboard-Praxistests, Performance, Barrierefreiheit, Fehlerbehebung, Feinschliff, Regressionstests, Doku, Beispielsammlungen, GitHub Pages nach Freigabe.

Eine Phase beginnt erst nach ausdrücklicher Freigabe.

## Abnahmekriterien je Phase

- **Funktional:** keine bekannten kritischen Fehler, verständliche Mechanik, konsistente Bedienung, funktionierender Zustand, Fehlerbehandlung, keine Attrappen.
- **Visuell:** hochwertig, einheitlich, klare Hierarchie, lesbar, große Spielflächen, flüssige Animationen, keine Ablenkung, keine Layoutsprünge.
- **Pädagogisch:** gemeinschaftlicher Erfolg, keine Bloßstellung, Lehrkraftautonomie, Fehlerfreundlichkeit, flexible Antwortmodi, spontan einsetzbar.
- **Technisch:** wartbar, konsistent typisiert, keine unnötigen Abhängigkeiten, Wiederverwendung, kritische Funktionen getestet, Produktionsbuild an Meilensteinen.
