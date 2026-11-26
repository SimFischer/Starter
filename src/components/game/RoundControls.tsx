import { useState } from 'react';
import { poolValues, type CardPoolConfig } from '../../core/answer-modes/cardPool';
import { EXTEND_MS, type AnswerRound } from '../../core/answer-modes/useAnswerRound';
import { Button } from '../ui/Button';
import { Dialog } from '../ui/Dialog';
import styles from './RoundControls.module.css';

interface Props {
  round: AnswerRound;
  cardPool: CardPoolConfig;
  disabled?: boolean;
}

/** Teacher controls for the round flow of the selected answer mode. */
export function RoundControls({ round, cardPool, disabled = false }: Props) {
  const [picking, setPicking] = useState(false);
  const { mode, phase } = round;
  const cards = mode === 'hidden-cards';
  const timed = phase === 'timing' && round.countdown.duration > 0;

  if (mode === 'free-control') {
    return <p className={styles.hint}>Freie Steuerung: Frage mündlich stellen und den Spielzug direkt vergeben.</p>;
  }

  const stepLabel =
    phase === 'idle'
      ? 'Frage stellen – dann:'
      : phase === 'timing'
        ? round.timeUp
          ? 'Zeit ist um'
          : round.timerLabel
        : cards
          ? 'Antwortphase'
          : 'Bewerten';

  const remaining = cardPool.withReplacement ? null : round.pool.remaining.length;

  return (
    <div className={styles.controls}>
      <span className={styles.step}>{stepLabel}</span>
      <div className={styles.buttons}>
        {round.primary && (
          <Button variant="primary" size="lg" icon={phase === 'idle' ? 'timer' : cards ? 'card' : 'skip'} onClick={round.primary.run} disabled={disabled} aria-keyshortcuts="Space" title="Leertaste">
            {round.primary.label}
          </Button>
        )}
        {cards && phase === 'answering' && (
          <Button variant="secondary" size="lg" icon="plus" onClick={round.draw} disabled={disabled}>
            Weitere Karte
          </Button>
        )}
        {timed && (
          <Button variant="secondary" size="lg" icon="plus" onClick={round.extendTimer} disabled={disabled}>
            {`${EXTEND_MS / 1000} s`}
          </Button>
        )}
        {cards && (
          <Button variant="ghost" icon="pick" onClick={() => setPicking(true)} disabled={disabled}>
            Karte wählen
          </Button>
        )}
        {phase !== 'idle' && (
          <Button variant="ghost" icon="skip" onClick={round.endRound} disabled={disabled}>
            Ohne Wertung
          </Button>
        )}
      </div>
      {round.notice && (
        <p className={styles.notice} role="status">
          {round.notice}
          {round.notice.endsWith('?') && (
            <button type="button" className={styles.inlineAction} onClick={round.resetPool}>
              Neu mischen
            </button>
          )}
        </p>
      )}

      {cards && (
        <Dialog
          open={picking}
          onClose={() => setPicking(false)}
          title="Kartenwert wählen"
          footer={
            <Button variant="secondary" icon="shuffle" onClick={round.resetPool}>
              Stapel neu mischen
            </Button>
          }
        >
          <p>
            {remaining === null
              ? 'Ziehen mit Zurücklegen: alle Werte sind jederzeit möglich.'
              : `Noch ${remaining} von ${round.poolSize} Werten im Stapel. Bereits gezogene Werte sind abgeblendet, bleiben aber wählbar.`}
          </p>
          <div className={styles.valueGrid}>
            {poolValues(cardPool).map((value) => {
              const used = remaining !== null && !round.pool.remaining.includes(value);
              return (
                <button
                  key={value}
                  type="button"
                  className={`${styles.value} ${used ? styles.used : ''}`}
                  onClick={() => {
                    round.pick(value);
                    setPicking(false);
                  }}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </Dialog>
      )}
    </div>
  );
}
