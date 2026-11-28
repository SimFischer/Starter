import type { TeamSymbolId } from '../../core/teams/teams';

/** Team marks (24px grid, filled) – teams are never told apart by colour alone. */
export const TEAM_SYMBOL_PATHS: Readonly<Record<TeamSymbolId, string>> = {
  heart: 'M12 21s-7.6-4.7-9.4-9.7C1.3 7.7 3.6 4.3 7 4.3c2.1 0 3.7 1.1 5 3 1.3-1.9 2.9-3 5-3 3.4 0 5.7 3.4 4.4 7C19.6 16.3 12 21 12 21z',
  spade: 'M12 2.5s-8.2 5.7-8.2 11.1a4.1 4.1 0 0 0 7 2.9L9.9 21.5h4.2l-.9-5a4.1 4.1 0 0 0 7-2.9C20.2 8.2 12 2.5 12 2.5z',
  diamond: 'M12 2l8 10-8 10-8-10z',
  club: 'M12 2.8a4 4 0 0 1 3.6 5.8 4 4 0 1 1-2.4 7l1 5.9H9.8l1-5.9a4 4 0 1 1-2.4-7A4 4 0 0 1 12 2.8z',
  star: 'M12 2.3l3 6.1 6.7 1-4.9 4.7 1.2 6.7L12 17.6l-6 3.2 1.2-6.7-4.9-4.7 6.7-1z',
  circle: 'M12 2.8a9.2 9.2 0 1 1 0 18.4 9.2 9.2 0 0 1 0-18.4z',
  triangle: 'M12 2.8l9.8 17.6H2.2z',
  hexagon: 'M12 2l8.7 5v10L12 22l-8.7-5V7z',
};

export function TeamSymbol({ symbol, className, title }: { symbol: TeamSymbolId; className?: string | undefined; title?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" aria-hidden={title ? undefined : true} role={title ? 'img' : undefined} focusable="false">
      {title && <title>{title}</title>}
      <path d={TEAM_SYMBOL_PATHS[symbol]} fill="currentColor" />
    </svg>
  );
}
