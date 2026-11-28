# Grafische Assets

Alle Illustrationen folgen der Bildsprache **„Kreide & Gold"** (`DESIGN_SYSTEM.md`): handgemalte Bilderbuch-Illustration, warmes Nachmittagslicht, ein bis zwei Kreide-Elemente pro Bild, Gold als einziger Glanz, Ränder laufen in Marineblau aus. Fertige, kopierbare Prompts: [`ASSET_PROMPTS.md`](ASSET_PROMPTS.md).

## Provisorische Assets (im Code, zu ersetzen)

| Asset | Ort | Ersatz durch |
|---|---|---|
| Wortmarke + Emblem (SVG im Code) | `src/components/layout/Wordmark.tsx`, `public/favicon.svg` | `shared/logo-wordmark.svg`, `shared/logo-emblem.svg` |
| 7 Spielkachel-Illustrationen (SVG im Code) | `src/games/<id>/Illustration.tsx` | `<id>/tile.webp` |
| Kachel „Verdecktes Kartenduell" | `src/components/illustrations/CardDuelIllustration.tsx` | `shared/card-duel.webp` |
| Tafelfußball-Spielfeld, Ball, Tore (SVG im Code) | `src/games/football/Pitch.tsx`, `FootballGame.tsx` | `football/*` (siehe unten) |

Kacheln zeigen die Illustration beschnitten im Format ca. 2,6:1, der Detaildialog ca. 0,8:1. **Motiv zentriert komponieren**, wichtige Elemente im mittleren Drittel.

## Wunschliste – Priorität 1

Ablage unter `public/assets/`. Reihenfolge: zuerst Nr. 3 (Tafelfußball-Kachel) als Leitbild fertigstellen und bei allen weiteren als Stilreferenz verwenden.

| Nr. | Dateiname | Zweck | Maße | Format | Transparenz | Motiv (Kurzfassung) |
|---|---|---|---|---|---|---|
| 1 | `shared/logo-wordmark.svg` | Wortmarke im Header | ca. 640×160 (4:1) | SVG (aus PNG vektorisiert) | ja | „Tafel" in Kreideweiß, „Arena" in Gold, freundlich-kräftige Schrift; Emblem: sechseckige Schiefertafel mit Goldrahmen und Kreide-„T" |
| 2 | `shared/logo-emblem.svg` | Favicon, App-Icon | 512×512 | SVG (+ PNG 512/192) | ja | Sechseckige Schiefertafel, Goldrahmen, Kreide-„T"; lesbar bis 32px |
| 3 | `football/tile.webp` | Kachel Tafelfußball | 1600×1000 (16:10) | WebP | nein | Gemütliches Kleinstadtstadion im Nachmittagslicht, Kreide-Spielfeldlinien, Lederball auf dem Anstoßpunkt |
| 4 | `horse-race/tile.webp` | Kachel Pferderennen | 1600×1000 | WebP | nein | Rennbahn auf dem Land, drei galoppierende Pferde mit Teamfarben, Ziellinie als Kreidelinie |
| 5 | `connect-four/tile.webp` | Kachel Vier gewinnt | 1600×1000 | WebP | nein | Hölzernes Spielbrett im hellen Raum, rote Steine mit Ring, blaue mit Raute, Gewinnreihe mit Kreidestrich markiert |
| 6 | `boss-battle/tile.webp` | Kachel Bosskampf | 1600×1000 | WebP | nein | Freundlich-majestätischer Moos-Steingolem in sonniger Ruine, Kreide-Runenkreis, violette und orange Magie – nicht gruselig |
| 7 | `jeopardy/tile.webp` | Kachel Quiz | 1600×1000 | WebP | nein | Große alte Bibliothekshalle, hölzerne Quizwand 5×5 mit Gold-Punktwerten, Kategorietafeln mit Kreidegekritzel |
| 8 | `memory/tile.webp` | Kachel Memory | 1600×1000 | WebP | nein | Sonniger Holztisch, bemalte Karten, aufgedecktes Paar (Sonne/Sonnenaufgang) mit Kreidelinie verbunden |
| 9 | `treasure-hunt/tile.webp` | Kachel Schatzsuche | 1600×1000 | WebP | nein | Handgemalte Schatzinsel aus der Vogelperspektive, Kreide-Route und Kreide-Kompassrose, offene Truhe mit Gold |
| 10 | `shared/card-duel.webp` | Kachel/Dialog Kartenduell | 1600×1000 | WebP | nein | Zwei Spielkarten auf sonnigem Schulpult (eine verdeckt, eine Herz-7), Kreidepfeil, unscharfe Tafel dahinter |

## Wunschliste – Tafelfußball (Phase 2)

Spielwelt in Ebenen; bewegliche Objekte separat und per CSS/SVG animierbar. Stilreferenz: Nr. 3.

| Nr. | Dateiname | Zweck | Maße | Format | Transparenz | Motiv / Animierbarkeit |
|---|---|---|---|---|---|---|
| 11 | `football/stadium-bg.webp` | Hintergrund | 3840×2160 (16:9) | WebP | nein | Stadion aus Nr. 3, Tribünen mit Fahnen oben; untere 60 % ruhig, dort liegt das Spielfeld |
| 12 | `football/pitch.svg` | Spielfeld | 1920×900 | SVG/PNG | ja | Draufsicht, handgemalter Rasen, alle Linien als Kreidelinien; Positionen legt der Code darüber |
| 13 | `football/goal-left.webp`, `goal-right.webp` | Tore | je 400×600 | WebP | ja | Weiße Holzpfosten, weiches Netz; Netz möglichst als eigene Ebene (Ausbeulen beim Tor) |
| 14 | `football/ball.svg` | Ball | 256×256 | SVG/PNG | ja | Klassischer Lederball, Nähte sichtbar; Rotation per CSS |
| 15 | `football/ball-shadow.svg` | Schatten | 256×64 | SVG/PNG | ja | weich, skaliert beim Rollen |
| 16 | `football/team-crests.svg` | Mannschaftssymbole (Sprite, 8 Stück) | je 128×128 | SVG | ja | Weiß mit Kreidetextur, im Code einfärbbar: Herz, Pik, Karo, Kreuz, Stern, Kreis, Dreieck, Sechseck |
| 17 | `football/goal-burst.webp` | Toreffekt | 1024×1024 | WebP | ja | Goldenes Licht mit Kreidestaub-Wirbeln; Konfetti entsteht im Code |
