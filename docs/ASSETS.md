# Grafische Assets

## Provisorische Assets (im Code, zu ersetzen)

| Asset | Ort | Ersatz durch |
|---|---|---|
| Wortmarke + Emblem (SVG im Code) | `src/components/layout/Wordmark.tsx`, `public/favicon.svg` | `shared/logo-wordmark.svg`, `shared/logo-emblem.svg` |
| 7 Spielkachel-Illustrationen (SVG im Code) | `src/games/<id>/Illustration.tsx` | `<id>/tile.webp` |
| Kachel „Verdecktes Kartenduell" | `src/components/illustrations/CardDuelIllustration.tsx` | `shared/card-duel.webp` |

Die Kachel zeigt die Illustration mit `object-fit: cover`-Verhalten in einem Format von ca. 2,6:1 (Kachel) bzw. ca. 0,8:1 (Detaildialog). **Motiv daher zentriert komponieren**, wichtige Elemente im mittleren Drittel, Ränder dürfen beschnitten werden.

## Wunschliste – Priorität 1

Gemeinsamer Stil: hochwertig stilisierte Videospiel-Illustration (Richtung moderner Indie-/Mobile-Premium-Titel), atmosphärisches Licht, räumliche Tiefe, leicht gesättigte Farben auf dunklem Grund, keine Schrift im Bild, keine realen Marken/Logos, nicht kindlich, keine Gewalt. Ablage unter `public/assets/`.

| Dateiname | Zweck | Maße | Format | Transparenz | Stil / Perspektive |
|---|---|---|---|---|---|
| `shared/logo-wordmark.svg` | Wortmarke „TafelArena" im Header | ca. 640×160 (4:1) | SVG | ja | Kräftige, moderne Grotesk mit Charakter; „Arena" in Gold-Verlauf, „Tafel" hell; dezenter Bezug zu Tafel/Kreide oder Arena (z. B. Hexagon-Emblem). Muss auf #101827 und in 40px Höhe funktionieren. |
| `shared/logo-emblem.svg` | Favicon, App-Icon, Ladebildschirm | 512×512 (1:1) | SVG (+ PNG 512/192) | ja | Emblem allein, ohne Text lesbar bis 32px |
| `football/tile.webp` | Kachel Tafelfußball | 1600×1000 (16:10) | WebP | nein | Flutlicht-Stadion bei Nacht, leicht erhöhte Seitenperspektive auf das Spielfeld, Ball in Feldmitte, beide Tore sichtbar; Smaragdgrün |
| `horse-race/tile.webp` | Kachel Pferderennen | 1600×1000 | WebP | nein | Rennbahn im Abendlicht, seitliche Perspektive, 3–4 galoppierende Pferde mit farbigen Satteldecken, Ziellinie rechts; Bernstein/Naturtöne |
| `connect-four/tile.webp` | Kachel Vier gewinnt | 1600×1000 | WebP | nein | Räumliches Spielbrett, leicht von schräg vorn, fallender Stein, rote Steine mit Ring-, blaue mit Rautensymbol, leuchtende Gewinnreihe |
| `boss-battle/tile.webp` | Kachel Bosskampf | 1600×1000 | WebP | nein | Magische Arena, großer Endgegner (z. B. Steingolem) frontal, violetter Nebel, orangefarbener Kristallkern, magischer Treffer – episch, nicht brutal |
| `jeopardy/tile.webp` | Kachel Jeopardy | 1600×1000 | WebP | nein | Eigenständige Quizshow-Bühne, Raster aus leuchtenden Feldern mit Punktwerten, Königsblau/Gold, Scheinwerfer; keine Anlehnung an TV-Branding |
| `memory/tile.webp` | Kachel Memory | 1600×1000 | WebP | nein | Karten auf türkisfarbenem Tisch, Aufsicht leicht geneigt, ein aufgedecktes leuchtendes Paar, eine Karte im Umdrehen |
| `treasure-hunt/tile.webp` | Kachel Schatzsuche | 1600×1000 | WebP | nein | Illustrierte Schatzinsel aus Vogelperspektive, geöffnete Truhe mit Gold und Edelsteinen, Gold/Petrol |
| `shared/card-duel.webp` | Kachel/Dialog Verdecktes Kartenduell | 1600×1000 | WebP | nein | Eine verdeckte, eine aufgedeckte Spielkarte (Herz 7) mit goldenem Lichtschein, eigene Kartenrückseite im TafelArena-Stil |

## Wunschliste – Tafelfußball (Phase 2)

Spielwelt in Ebenen; bewegliche Objekte separat und animierbar per CSS/SVG.

| Dateiname | Zweck | Maße | Format | Transparenz | Stil / Perspektive / Animierbarkeit |
|---|---|---|---|---|---|
| `football/stadium-bg.webp` | Hintergrund: Tribünen, Flutlicht, Himmel | 3840×2160 (16:9) | WebP | nein | Nachtstadion, Tribünen mit stilisierter Menge (keine Gesichter), Lichtkegel; untere 60 % ruhig/dunkel, da dort das Spielfeld liegt |
| `football/pitch.svg` | Spielfeld mit Markierungen | 1920×900 | SVG | ja | Leicht perspektivisch oder frontal, Rasenstreifen; Positionen werden im Code darübergelegt (variable Anzahl) |
| `football/goal-left.webp`, `goal-right.webp` | Tore mit Netz | je 400×600 | WebP | ja | passend zur Spielfeldperspektive; Netz als eigene Ebene wünschenswert (Netz-„Beulen" bei Tor animierbar) |
| `football/ball.svg` | Ball | 256×256 | SVG | ja | Stilisiert, klar erkennbar; Rotation per CSS |
| `football/ball-shadow.svg` | Schatten | 256×64 | SVG | ja | weich, skaliert beim „Rollen" |
| `football/team-crests.svg` | Mannschaftssymbole (Sprite, 8 Stück) | je 128×128 | SVG | ja | geometrisch unterscheidbar (Kreis, Dreieck, Stern, Raute …), einfarbig umfärbbar |
| `football/goal-burst.webp` | Toreffekt (Lichtexplosion) | 1024×1024 | WebP | ja | Goldener Strahlenkranz, wird skaliert/ausgeblendet; Konfetti entsteht im Code |
