import { answerCallout, type CardSystem } from '../../core/answer-modes/cardPool';
import type { AnswerRound } from '../../core/answer-modes/useAnswerRound';
import type { TeamConfig } from '../../core/teams/teams';
import { CountdownRing } from './CountdownRing';
import { PlayingCard } from './PlayingCard';
import styles from './RoundStage.module.css';

/**
 * What the class sees of the current round: the shared countdown and the
 * revealed card values. Floats above the game world without blocking it.
 */
export function RoundStage({ round, teams, cardSystem }: { round: AnswerRound; teams: readonly TeamConfig[]; cardSystem: CardSystem }) {
  if (round.phase === 'timing') {
    return (
      <div className={styles.stage}>
        <CountdownRing
          duration={round.countdown.duration}
          remaining={round.countdown.remaining}
          label={round.timerLabel}
          timeUp={round.timeUp}
        />
      </div>
    );
  }

  if (round.phase === 'answering' && round.revealed.length > 0) {
    const last = round.revealed.at(-1)!;
    return (
      <div className={styles.stage}>
        <div className={styles.cards}>
          {round.revealed.map((value, i) => (
            <PlayingCard key={value} value={value} system={cardSystem} teams={teams} index={i} />
          ))}
        </div>
        <p key={last} className={styles.callout} aria-live="polite">
          {round.revealed.length > 1 ? 'Außerdem: ' : ''}
          {answerCallout(cardSystem, last)}
        </p>
      </div>
    );
  }

  return null;
}
