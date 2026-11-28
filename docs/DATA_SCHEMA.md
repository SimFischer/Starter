# Datenformate (vorläufig)

Status: **Entwurf.** Die Schemas werden in Phase 4 (allgemeine Fragen) bzw. Phase 6 (Jeopardy, Memory) mit Zod implementiert und hier finalisiert.

## Gemeinsame Metadaten

| Feld | Pflicht | Hinweis |
|---|---|---|
| `schemaVersion` | ja | Ganzzahl, aktuell `1` |
| `type` | ja | `"questions"` · `"jeopardy"` · `"memory"` |
| `title` | ja | |
| `subject` | ja | Unterrichtsfach |
| `grade` | ja | Klassenstufe (5–10, offen für andere) |
| `topic` | ja | |
| `description` | nein | |
| `id`, `createdAt`, `updatedAt` | nein | werden beim Import automatisch ergänzt – Lehrkraft/KI müssen keine technischen Felder erzeugen |

Allgemeine Fragensammlungen sind mit Tafelfußball, Pferderennen, Vier gewinnt, Bosskampf und Schatzsuche kompatibel und nicht an ein Spiel gebunden.

## `questions`

Pro Frage: `question` (Pflicht), `answer` (Pflicht, Musterlösung), optional `acceptedAnswers` (string[]), `explanation`, `difficulty` (`"easy" | "medium" | "hard"`), `hint`, `image` (Asset-Referenz, später).

```json
{
  "schemaVersion": 1,
  "type": "questions",
  "title": "Wortarten wiederholen",
  "subject": "Deutsch",
  "grade": 5,
  "topic": "Wortarten",
  "questions": [
    { "question": "Welche Wortart bezeichnet Tätigkeiten?", "answer": "Verb", "acceptedAnswers": ["Verben", "Tätigkeitswort"], "difficulty": "easy" }
  ]
}
```

## `jeopardy`

`categories[]` mit `name` und `questions[]`; je Frage `points`, `question`, `answer`, optional `acceptedAnswers`, `hint`. Punktwerte steigen innerhalb einer Kategorie.

```json
{
  "schemaVersion": 1,
  "type": "jeopardy",
  "title": "Martin Luther und die Reformation",
  "subject": "Religion",
  "grade": 7,
  "topic": "Reformation",
  "categories": [
    { "name": "Martin Luther", "questions": [
      { "points": 100, "question": "In welchem Jahr veröffentlichte Luther seine 95 Thesen?", "answer": "1517", "acceptedAnswers": [] }
    ] }
  ]
}
```

## `memory`

`pairs[]` mit `first` und `second`; jede Seite `{ "type": "text" | "image", "content": string }`. Bilder später über sichere lokale Asset-Verwaltung (keine externen URLs, kein HTML).

```json
{
  "schemaVersion": 1,
  "type": "memory",
  "title": "Englische Vokabeln",
  "subject": "Englisch",
  "grade": 5,
  "topic": "Animals",
  "pairs": [ { "first": { "type": "text", "content": "Dog" }, "second": { "type": "text", "content": "Hund" } } ]
}
```

## Import-Regeln (verbindlich)

- Daten sind nicht vertrauenswürdig: validieren, Inhalte nur als Text rendern, nie als HTML/JS.
- Größenlimits für Dateien und Anzahl Einträge (Werte in Phase 4 festlegen).
- Mitkopierte Markdown-Codeblöcke und umgebender Text kontrolliert entfernen.
- Fehlermeldungen konkret („Frage 3: Feld ‚answer' fehlt").
- Vorschau und Bearbeitung vor dem Speichern; Hinweis zur fachlichen Prüfung KI-generierter Inhalte.

## Lokale Speicherschlüssel (implementiert)

| Schlüssel | Inhalt |
|---|---|
| `tafelarena:settings:app:v1` | `{ motion: "system"\|"full"\|"reduced", uiScale: "standard"\|"large"\|"xlarge" }` – wird beim Lesen bereinigt |
| `tafelarena:settings:game:football:v1` | zuletzt verwendete Tafelfußball-Einstellungen (Mannschaften, Modus, Regeln, Zeiten, Kartenpool) – wird beim Lesen bereinigt |
