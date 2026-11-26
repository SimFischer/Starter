# Designsystem

Quelle der Wahrheit für Werte: `src/styles/tokens.css`. Dieses Dokument erklärt Regeln und Absichten.

## Gestalterische Richtung

Die Oberfläche ist ein ruhiger, dunkler Rahmen (Marineblau + Gold, klare Typografie). Davor wirken die Spielwelten als warme, handgemalte Bilder – wie Fenster in eine Bilderbuchwelt.
**Vermeiden:** kindliche Optik, Schulsoftware- oder Standard-Dashboard-Look, Emojis, Cliparts, überflüssige Karten-Container, überladene Oberflächen, übermäßige Verläufe, wahllose Glaseffekte, Deko-Animationen, Textwände im Spiel.

### Bildsprache „Kreide & Gold" (verbindlich für alle Illustrationen)

Referenz: Malstil des Bestiarium-Projekts der Lehrkraft (warm, handgemalt, goldenes Licht, echte Materialien).

1. **Handgemalte Bilderbuch-Illustration** in der Tradition klassischer handgemalter Animationsfilme: sichtbarer, weicher Pinselstrich, natürliche Texturen (Holz, Gras, Stein, Papier), atmosphärische Tiefe, ein klarer Blickpunkt.
2. **Licht:** warmes Nachmittags-Sonnenlicht mit langen, weichen Schatten – Tag statt Nacht, einladend statt düster.
3. **Markenzeichen Kreide & Gold:** In jedem Bild ein bis zwei Elemente, die wie mit weißer Schulkreide gezeichnet wirken (Spielfeldlinien, Pfeile, Routen, Runenkreise, Markierungen). Warmes Gold (#E8B95B) ist der einzige Glanz.
4. **Rand:** Bildränder laufen weich in tiefes Marineblau (#101827) aus, damit Bilder und Oberfläche verschmelzen.
5. **Zielgruppe:** freundlich und charmant für 10-Jährige, aber nicht babyhaft – auch Zehntklässler sollen es cool finden. Endgegner beeindruckend, nie gruselig.
6. **Ausgeschlossen:** glänzende 3D-Renderoptik, Plastik-Look, Neon, Lens Flares, übermäßiges Glitzern/Leuchten, Casino-/Slot-Optik, generischer Mobile-Game-Look, Übersättigung, Comic-Konturen, Text im Bild (außer ausdrücklich verlangt), echte Marken oder Personen, Gewalt.

Konsistenz: Erst ein Leitbild (Tafelfußball-Kachel) fertigstellen und bei allen weiteren Bildern als Stilreferenz mitgeben. Prompts: `docs/ASSET_PROMPTS.md`.
Platzhalter-SVGs im Code folgen derselben Richtung, soweit mit einfachen Formen möglich (Tageslicht statt Nacht, Kreidelinien, Gold als einziger Glanz).

## Farben

| Token | Wert | Rolle |
|---|---|---|
| `--c-navy-950` | #0B111C | tiefster Hintergrund (ergänzt) |
| `--c-navy-900` | #101827 | Hintergrund |
| `--c-slate-800` | #1B2940 | Flächen |
| `--c-slate-700` | #243552 | erhöhte Flächen (ergänzt) |
| `--c-slate-600` | #30445E | Linien, Steuerflächen |
| `--c-gold-500` | #E8B95B | Primärakzent, Fokus |
| `--c-gold-300` | #F6D994 | Hervorhebung, Fokusring |
| `--c-text` | #F4F6FA | Text |
| `--c-text-muted` | #A9B6C9 | Sekundärtext |

**Kontraste (WCAG, berechnet):** Text auf Navy-900 ≈ 16:1; Muted auf Navy-900 ≈ 8,6:1, auf Slate-800 ≈ 7,1:1, auf Slate-600 ≈ 4,8:1 (nur große Schrift); Gold auf Navy ≈ 9,7:1; Navy-950 auf Gold ≈ 10:1 (Primärbutton).

**Spielakzente** (`src/games/definitions.ts`, als `--accent`/`--accent-2` gesetzt):
Tafelfußball #2FBF71/#8EE4AF · Pferderennen #E0A040/#B9844F · Vier gewinnt #E5484D/#3E8BFF · Bosskampf #8B5CF6/#FF8A3D · Jeopardy #2F5BEA/#E8B95B · Memory #2CC7C0/#3A86FF · Schatzsuche #E8B95B/#1FA3A6.
Farbe ist nie das einzige Unterscheidungsmerkmal: Status-Badges haben unterschiedliche Marker-Formen (Punkt, Ring, Raute, Doppelbalken), Mannschaften bekommen Symbole/Muster.

## Typografie

- **Display:** Bricolage Grotesque (Variable) – Titel, Punktestände, Spielnamen.
- **Text:** Lexend (Variable) – für Lesbarkeit entwickelt; Fließtext, Bedienelemente.
- Lokal gebündelt via `@fontsource-variable` – keine Netzwerkabhängigkeit.
- Skala (rem): xs 0,875 · sm 1 · md 1,125 (Basis) · lg 1,375 · xl 1,75 · 2xl 2,5 · 3xl 3,5. Im Spiel: Fragen ≥ 2,5rem, Punktestände ≥ 3,5rem.
- Kurze Beschriftungen, Zeilenlängen ≤ ~60ch.

## Smartboard-Skalierung

- Ziel: 16:9 quer; geprüft bei 1366×768, 1920×1080, 2560×1440, 3840×2160.
- Root-Schriftgröße `clamp(11px, min(0.8333vw, 1.4815vh), 48px) × --ui-scale` → 1rem = 16px bei 1920×1080, 32px bei 4K, ~11,4px bei 1366×768. Da ein Board unabhängig von seiner Auflösung physisch gleich groß ist, bleibt die **physische Größe** konstant.
- Alles in `rem`; Startseite und später Spielansichten füllen genau einen Bildschirm (kein Scrollen). Hoch-/Schmalformat: scrollbare Rückfallansicht.
- „Darstellungsgröße" (Einstellungen): 100 / 110 / 120 %. Kacheln blenden bei wenig Höhe die Kurzbeschreibung aus (Container Query), statt zu überlaufen.
- Touch-Ziele ≥ 3,5rem (56px Basis). Nichts nur per Hover; Fokusring gold, 0,2rem.

## Komponenten (`src/components/`)

| Komponente | Zweck |
|---|---|
| `ui/Button` (`Button`, `ButtonLink`) | Varianten primary/secondary/ghost/danger, Größen md/lg, Icon, Icon-only mit zugänglichem Label |
| `ui/Badge` | Statusanzeige (development, planned, cooperative, competitive, neutral) |
| `ui/SegmentedControl` | Große Auswahl (Radiogroup, Pfeiltasten) |
| `ui/Dialog`, `ConfirmDialog` | Native `<dialog>`: Fokusfalle, Esc, Backdrop; Bestätigung kritischer Aktionen |
| `ui/Icon` | Eigenes Strich-Icon-Set (24er Raster) |
| `layout/AppHeader`, `layout/Wordmark` | Navigation, Vollbild-Schalter, Wortmarke |
| `game-tile/GameTile` | Spielkachel mit Illustration, Akzent, Status, Meta |
| `game/TeamEditor`, `TeamSymbol` | Mannschaft bearbeiten (Farbe und Symbol der Gegner gesperrt), Mannschaftssymbole |
| `game/RoundControls`, `RoundStage` | Lehrkraftsteuerung und Klassenansicht des Rundenablaufs (alle Antwortmodi) |
| `game/PlayingCard`, `CountdownRing`, `Confetti` | Kartenenthüllung (Flip), ruhiger Countdown ohne Blinken, CSS-Konfetti (bei reduzierter Bewegung aus) |

## Animation

- Kurz für gewöhnliche Aktionen (140–240ms), aufwendiger für besondere Ereignisse (Tor, Sieg), aber ohne den Unterricht aufzuhalten.
- Bevorzugt CSS-Transforms/Opacity und SVG; Canvas nur mit Mehrwert. Keine dauerhaft laufenden Animationen im Ruhezustand (Illustrationen bewegen sich nur bei Hover/Fokus).
- Keine Blinkeffekte, keine schnellen großflächigen Lichtwechsel, keine Layoutverschiebungen, keine unnötigen Eingabesperren.
- **Reduzierte Bewegung:** Einstellung „Wie im System / Voll / Reduziert"; `prefers-reduced-motion` wird respektiert. Umsetzung über `html[data-motion='reduced']`.
- Rückmeldungen sind ausschließlich visuell (tonlos).

## Assets

- Statische Welten und bewegliche Objekte getrennt (kein Komplettbild als Spielwelt-Ersatz).
- Formate: WebP für Hintergründe; PNG/WebP mit Transparenz für bewegliche Objekte; SVG für Symbole/geometrische Elemente; Spritesheets für komplexe Bewegungen.
- Nur eigene/lizenzierte/generierte Assets, keine geschützten Logos oder Figuren.
- Ablage: `public/assets/<bereich>/`. Wunschliste und Kennzeichnung provisorischer Assets: `ASSETS.md`; fertige Bild-Prompts: `ASSET_PROMPTS.md`.
- Jede Illustration folgt der Bildsprache „Kreide & Gold" (siehe oben).
