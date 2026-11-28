import { Component, type ErrorInfo, type ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
  /** Short context, e.g. "Das Spiel". */
  what: string;
  onBack?: () => void;
}

/**
 * Catches render and lazy-loading errors (e.g. a game file that cannot be
 * loaded because the dev server stopped or a new version was deployed) and
 * shows a calm message instead of an empty white page.
 */
export class ErrorBoundary extends Component<Props, { failed: boolean; chunk: boolean }> {
  override state = { failed: false, chunk: false };

  static getDerivedStateFromError(error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return { failed: true, chunk: /dynamically imported module|Importing a module script failed|Failed to fetch|Loading chunk|Unable to preload/i.test(message) };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('TafelArena:', error, info.componentStack);
  }

  override render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className={styles.box} role="alert">
        <h1>{this.props.what} konnte nicht geladen werden.</h1>
        <p>
          {this.state.chunk
            ? 'Die Datei wurde nicht gefunden – meist läuft der Entwicklungsserver nicht mehr oder es gibt eine neue Version. Seite neu laden hilft in der Regel.'
            : 'Es ist ein unerwarteter Fehler aufgetreten. Bitte die Seite neu laden.'}
        </p>
        <div className={styles.actions}>
          <button type="button" className={styles.primary} onClick={() => window.location.reload()}>
            Seite neu laden
          </button>
          {this.props.onBack && (
            <button
              type="button"
              className={styles.secondary}
              onClick={() => {
                this.setState({ failed: false, chunk: false });
                this.props.onBack?.();
              }}
            >
              Zur Spielesammlung
            </button>
          )}
        </div>
      </main>
    );
  }
}
