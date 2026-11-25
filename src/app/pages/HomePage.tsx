import { useState } from 'react';
import { ANSWER_MODES, type AnswerModeId } from '../../core/answer-modes/answerModes';
import { PLAY_STYLE_LABEL, describeTeams, getGame, listGames } from '../../core/games/registry';
import type { GameDefinition, GameId, PlayStyle } from '../../core/games/types';
import { GameTile } from '../../components/game-tile/GameTile';
import { CardDuelIllustration } from '../../components/illustrations/CardDuelIllustration';
import { Badge, type BadgeTone } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import styles from './HomePage.module.css';

const STYLE_TONE: Record<PlayStyle, BadgeTone> = {
  competitive: 'competitive',
  cooperative: 'cooperative',
  flexible: 'cooperative',
};

type Selection = { kind: 'game'; id: GameId } | { kind: 'answer-modes' } | null;

export function HomePage() {
  const [selection, setSelection] = useState<Selection>(null);
  const games = listGames();
  const selectedGame = selection?.kind === 'game' ? getGame(selection.id) : undefined;
  const close = () => setSelection(null);

  return (
    <main className={styles.page} id="main" tabIndex={-1}>
      <div className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>Spielesammlung</p>
          <h1 className={styles.heading}>Welches Spiel spielt ihr heute?</h1>
        </div>
        <ul className={styles.legend} aria-label="Legende">
          <li>
            <Badge tone="competitive">Kompetitiv</Badge> Mannschaften treten gegeneinander an
          </li>
          <li>
            <Badge tone="cooperative">Kooperativ</Badge> die ganze Klasse gemeinsam
          </li>
        </ul>
      </div>

      <ul className={styles.grid} aria-label="Spiele">
        {games.map((game, index) => (
          <li key={game.id} className={styles.cell}>
            <GameTile
              index={index}
              title={game.title}
              eyebrow={game.genre}
              tagline={game.tagline}
              Illustration={game.Illustration}
              accent={game.accent}
              status={{ tone: 'development', label: 'In Entwicklung' }}
              meta={{ icon: 'users', label: describeTeams(game) }}
              styleBadge={{ tone: STYLE_TONE[game.playStyle], label: PLAY_STYLE_LABEL[game.playStyle] }}
              onOpen={() => setSelection({ kind: 'game', id: game.id })}
            />
          </li>
        ))}
        <li className={styles.cell}>
          <GameTile
            variant="feature"
            index={games.length}
            title="Verdecktes Kartenduell"
            eyebrow="Antwortmodus für alle Spiele"
            tagline="Alle denken nach – erst dann entscheidet eine gezogene Karte, wer antwortet."
            Illustration={CardDuelIllustration}
            accent={{ primary: '#E8B95B', secondary: '#F6D994' }}
            status={{ tone: 'development', label: 'In Entwicklung' }}
            meta={{ icon: 'cards', label: '5 Antwortmodi' }}
            onOpen={() => setSelection({ kind: 'answer-modes' })}
          />
        </li>
      </ul>

      {selectedGame && <GameDetailsDialog game={selectedGame} onClose={close} />}
      <AnswerModesDialog open={selection?.kind === 'answer-modes'} onClose={close} />
    </main>
  );
}

function ModeList({ modes }: { modes: readonly AnswerModeId[] }) {
  return (
    <ul className={styles.modeList}>
      {modes.map((id) => (
        <li key={id}>
          <strong>{ANSWER_MODES[id].label}</strong>
          <span>{ANSWER_MODES[id].summary}</span>
        </li>
      ))}
    </ul>
  );
}

function DevelopmentNotice({ phase }: { phase: number }) {
  return (
    <p className={styles.notice}>
      <Badge tone="development">In Entwicklung</Badge>
      <span>
        Noch nicht spielbar – geplant für <strong>Phase {phase}</strong> der Entwicklung.
      </span>
    </p>
  );
}

function GameDetailsDialog({ game, onClose }: { game: GameDefinition; onClose: () => void }) {
  const { Illustration } = game;
  return (
    <Dialog
      open
      size="lg"
      onClose={onClose}
      title={game.title}
      media={<Illustration />}
      footer={
        <Button variant="primary" onClick={onClose}>
          Zurück zur Übersicht
        </Button>
      }
    >
      <div className={styles.detailBadges}>
        <Badge tone={STYLE_TONE[game.playStyle]}>{PLAY_STYLE_LABEL[game.playStyle]}</Badge>
        <Badge>{game.genre}</Badge>
        <Badge>{describeTeams(game)}</Badge>
      </div>
      <p className={styles.description}>{game.description}</p>
      <h3 className={styles.subheading}>Geplante Antwortmodi</h3>
      <ModeList modes={game.answerModes} />
      <DevelopmentNotice phase={game.plannedPhase} />
    </Dialog>
  );
}

function AnswerModesDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const all = Object.keys(ANSWER_MODES) as AnswerModeId[];
  return (
    <Dialog
      open={open}
      size="lg"
      onClose={onClose}
      title="Verdecktes Kartenduell"
      media={<CardDuelIllustration />}
      footer={
        <Button variant="primary" onClick={onClose}>
          Verstanden
        </Button>
      }
    >
      <p className={styles.description}>
        Die Lehrkraft verteilt physische Spielkarten verdeckt – zum Beispiel Herz für die eine, Pik für die andere
        Mannschaft. Alle denken über die Frage nach. Erst danach wird ein Kartenwert gezogen: „Die Siebenen
        antworten!“ Wer nicht antworten kann, bleibt unerkannt. TafelArena speichert nie, wer welche Karte hat.
      </p>
      <h3 className={styles.subheading}>Alle Antwortmodi</h3>
      <ModeList modes={all} />
      <DevelopmentNotice phase={2} />
    </Dialog>
  );
}
