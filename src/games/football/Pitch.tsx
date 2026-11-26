import type { TeamConfig } from '../../core/teams/teams';
import { teamColor } from '../../core/teams/teams';
import { TEAM_SYMBOL_PATHS } from '../../components/game/TeamSymbol';
import styles from './FootballGame.module.css';

/** Static pitch artwork (SVG, 1600×700). Moving objects are rendered separately. */
export function Pitch({ teams, netShake }: { teams: readonly [TeamConfig, TeamConfig]; netShake: 0 | 1 | null }) {
  return (
    <svg className={styles.pitchSvg} viewBox="0 0 1600 700" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="fp-grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1B8A51" />
          <stop offset="1" stopColor="#0E5A34" />
        </linearGradient>
        <radialGradient id="fp-light" cx="0.5" cy="0" r="0.9">
          <stop offset="0" stopColor="#FFF7DC" stopOpacity="0.2" />
          <stop offset="1" stopColor="#FFF7DC" stopOpacity="0" />
        </radialGradient>
        <pattern id="fp-net" width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M0 0L12 12M12 0L0 12" stroke="#F4F6FA" strokeOpacity="0.45" strokeWidth="1.4" />
        </pattern>
      </defs>
      <rect width="1600" height="700" rx="28" fill="url(#fp-grass)" />
      {Array.from({ length: 16 }, (_, i) =>
        i % 2 ? <rect key={i} x={i * 100} y="0" width="100" height="700" fill="#000" opacity="0.07" /> : null,
      )}
      {/* Team halves: faint team mark where each team defends */}
      {teams.map((team, side) => (
        <svg key={side} x={side ? 1050 : 250} y="150" width="300" height="300" viewBox="0 0 24 24">
          <path d={TEAM_SYMBOL_PATHS[team.symbol]} fill={teamColor(team)} opacity="0.13" />
        </svg>
      ))}
      <rect width="1600" height="700" rx="28" fill="url(#fp-light)" />
      <g fill="none" stroke="#F4F6FA" strokeOpacity="0.8" strokeWidth="4">
        <rect x="110" y="50" width="1380" height="600" rx="4" />
        <path d="M800 50V650" />
        <circle cx="800" cy="350" r="95" />
        <rect x="110" y="160" width="200" height="380" />
        <rect x="110" y="255" width="75" height="190" />
        <rect x="1290" y="160" width="200" height="380" />
        <rect x="1415" y="255" width="75" height="190" />
        <path d="M310 280.7A95 95 0 0 1 310 419.3M1290 280.7A95 95 0 0 0 1290 419.3" />
      </g>
      <g fill="#F4F6FA" fillOpacity="0.85">
        <circle cx="800" cy="350" r="7" />
        <circle cx="245" cy="350" r="5" />
        <circle cx="1355" cy="350" r="5" />
      </g>
      {/* Goals – left goal is defended by team 0, right goal by team 1 */}
      {[0, 1].map((side) => (
        <g key={side} className={netShake === side ? styles.netShake : undefined} style={{ transformOrigin: side ? '1520px 350px' : '80px 350px' }}>
          <rect x={side ? 1490 : 50} y="285" width="60" height="130" fill="#08261A" opacity="0.55" />
          <rect x={side ? 1490 : 50} y="285" width="60" height="130" fill="url(#fp-net)" />
          <path
            d={side ? 'M1490 285H1550V415H1490' : 'M110 285H50V415H110'}
            fill="none"
            stroke="#F4F6FA"
            strokeWidth="7"
            strokeLinejoin="round"
          />
        </g>
      ))}
    </svg>
  );
}
