import { useState, type CSSProperties, type ComponentType, type ReactNode } from 'react';
import { useFullscreen } from '../../../hooks/useFullscreen';
import { Button, ButtonLink } from '../../ui/Button';
import { Dialog } from '../../ui/Dialog';
import styles from './Setup.module.css';

interface Props {
  eyebrow: string;
  title: string;
  accent: { primary: string; secondary: string };
  Illustration: ComponentType;
  /** Left column (teams). */
  left: ReactNode;
  /** Right column (answer mode, game end …). */
  right: ReactNode;
  /** Content of the "Erweitert" dialog. */
  advanced: ReactNode;
  onDefaults: () => void;
  onStart: () => void;
  startLabel: string;
}

/** Shared pre-game screen: quick start with last settings, basic options, advanced dialog. */
export function SetupLayout(props: Props) {
  const [advanced, setAdvanced] = useState(false);
  const fullscreen = useFullscreen();
  const { Illustration } = props;

  return (
    <div className={styles.screen} style={{ '--accent': props.accent.primary, '--accent-2': props.accent.secondary } as CSSProperties}>
      <div className={styles.backdrop} aria-hidden="true">
        <Illustration />
      </div>

      <header className={styles.top}>
        <ButtonLink href="#/" variant="ghost" icon="back">
          Spielesammlung
        </ButtonLink>
        <div className={styles.title}>
          <span className={styles.eyebrow}>{props.eyebrow}</span>
          <h1>{props.title}</h1>
        </div>
        <Button variant="secondary" icon={fullscreen.active ? 'compress' : 'expand'} iconOnly onClick={fullscreen.toggle} disabled={!fullscreen.supported}>
          Vollbild (F)
        </Button>
      </header>

      <main className={styles.body} id="main" tabIndex={-1}>
        <section className={styles.teams}>{props.left}</section>
        <section className={styles.rules}>{props.right}</section>
      </main>

      <footer className={styles.bottom}>
        <Button variant="ghost" icon="settings" onClick={() => setAdvanced(true)}>
          Erweitert
        </Button>
        <Button variant="ghost" icon="reset" onClick={props.onDefaults}>
          Standard
        </Button>
        <Button variant="primary" size="lg" icon="play" className={styles.kickoff} onClick={props.onStart}>
          {props.startLabel}
        </Button>
      </footer>

      <Dialog
        open={advanced}
        size="lg"
        onClose={() => setAdvanced(false)}
        title="Erweiterte Einstellungen"
        footer={
          <Button variant="primary" onClick={() => setAdvanced(false)}>
            Übernehmen
          </Button>
        }
      >
        {props.advanced}
      </Dialog>
    </div>
  );
}

/** Labelled field block used inside setup screens and the advanced dialog. */
export function Field({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className={styles.fieldTitle}>{title}</h3>
      {children}
    </div>
  );
}

export { styles as setupStyles };
