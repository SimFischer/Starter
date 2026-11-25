# TafelArena

**Gemeinsam spielen. Gemeinsam lernen.**

TafelArena ist eine tonlose, fachunabhängige Spielesammlung für den Unterricht am Smartboard (Klassen 5–10). Die Lehrkraft steuert zentral, Schülerinnen und Schüler brauchen keine eigenen Geräte. Gespielt wird in Mannschaften oder als ganze Klasse – ohne individuelle Ranglisten und ohne Bloßstellung einzelner Kinder.

> Arbeitstitel des Repositorys: *Starter / TafelStarter*. Produktname in der Anwendung: **TafelArena**.

## Stand

Phase 1 (Projektfundament) – siehe [ROADMAP.md](ROADMAP.md).

Verfügbar:
- Startseite mit sieben Spielkacheln (alle **„In Entwicklung"**, Details per Klick) und Erklärung des verdeckten Kartenduells
- Navigation; Fragenbibliothek und KI-Prompt-Generator als gekennzeichnete Vorschau („Geplant")
- Einstellungen: Animationen (System / Voll / Reduziert), Darstellungsgröße (100–120 %), Zurücksetzen
- Vollbild (Schaltfläche oder Taste **F**), Skalierung für 1366×768 bis 3840×2160

Noch nicht spielbar: alle Spiele (ab Phase 2 Tafelfußball).

## Lokale Entwicklung

Voraussetzung: Node.js ≥ 20.

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # Unit-Tests (Vitest)
npm run typecheck  # TypeScript
npm run build      # Produktionsbuild nach dist/
npm run preview    # Build lokal ansehen
```

## Bedienung

- Spielkachel antippen → Beschreibung, Antwortmodi und Entwicklungsstand.
- **F** oder Schaltfläche oben rechts → Vollbild.
- Einstellungen werden nur lokal im Browser gespeichert. Es werden keine Schülerdaten erhoben, keine externen Dienste genutzt und keine Töne ausgegeben.

## Veröffentlichung

Der Build ist statisch, nutzt relative Pfade und Hash-Routing und läuft damit direkt auf GitHub Pages (auch unter einem Repository-Unterpfad): Inhalt von `dist/` veröffentlichen. Eine automatische Veröffentlichung per GitHub Actions wird erst nach Freigabe eingerichtet.

## Dokumentation

[CLAUDE.md](CLAUDE.md) · [docs/MASTERPLAN.md](docs/MASTERPLAN.md) · [docs/PEDAGOGY.md](docs/PEDAGOGY.md) · [docs/GAME_RULES.md](docs/GAME_RULES.md) · [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) · [docs/DATA_SCHEMA.md](docs/DATA_SCHEMA.md) · [docs/ASSETS.md](docs/ASSETS.md) · [CHANGELOG.md](CHANGELOG.md)
