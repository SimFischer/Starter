/** Provisional launcher artwork – replace with games/horse-race/tile.webp (docs/ASSETS.md). */
const HORSE =
  'M14 26C20 19 34 18 46 19C54 19 60 18 64 15C68 10 73 5 80 3L84 1L86 5C90 7 95 10 98 14L96 18C92 18 88 17 85 16C82 20 79 25 76 28C79 33 86 37 96 38L95 42C84 42 76 38 70 34L67 36C71 41 77 46 84 50L81 53C73 49 66 44 61 38C56 40 48 40 42 39C38 44 31 49 22 53L19 50C26 46 31 42 33 37C29 37 22 40 13 45L11 42C17 37 22 34 25 31C20 31 16 30 14 26ZM15 25C8 22 3 25 0 33C5 29 10 29 15 29Z';

const RUNNERS = [
  { x: 214, y: 150, s: 0.95, cloth: '#3E8BFF' },
  { x: 282, y: 186, s: 1.1, cloth: '#E8B95B' },
  { x: 140, y: 226, s: 1.25, cloth: '#E5484D' },
];

export function HorseRaceIllustration() {
  return (
    <svg viewBox="0 0 480 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="hr-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1E1008" />
          <stop offset="0.55" stopColor="#A85E22" />
          <stop offset="1" stopColor="#F2B35C" />
        </linearGradient>
        <radialGradient id="hr-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFF1C9" />
          <stop offset="0.35" stopColor="#FFD58A" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FFB34D" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hr-track" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8A5A2E" />
          <stop offset="1" stopColor="#4E3018" />
        </linearGradient>
        <pattern id="hr-check" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="#F4F6FA" />
          <rect width="5" height="5" fill="#1A0E06" />
          <rect x="5" y="5" width="5" height="5" fill="#1A0E06" />
        </pattern>
        <path id="hr-horse" d={HORSE} />
      </defs>
      <rect width="480" height="300" fill="url(#hr-sky)" />
      <circle cx="372" cy="118" r="70" fill="url(#hr-sun)" />
      <path d="M0 132C60 108 120 120 180 110C250 98 300 124 370 112C420 104 450 112 480 108V160H0Z" fill="#6E3F1C" opacity="0.7" />
      <path d="M0 148C70 132 140 146 210 138C290 128 360 148 480 136V170H0Z" fill="#3E2412" />
      {/* Track */}
      <path d="M0 160H480V300H0Z" fill="url(#hr-track)" />
      <g stroke="#F6E2BE" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="14 10">
        <path d="M0 196H480" />
        <path d="M0 236H480" />
      </g>
      <path d="M0 160H480" stroke="#F4F6FA" strokeOpacity="0.8" strokeWidth="3" />
      {Array.from({ length: 13 }, (_, i) => (
        <rect key={i} x={i * 40 + 8} y="150" width="3" height="12" fill="#F4F6FA" opacity="0.7" />
      ))}
      {/* Finish line */}
      <rect x="404" y="160" width="14" height="140" fill="url(#hr-check)" opacity="0.92" />
      <rect x="402" y="96" width="4" height="66" fill="#F4F6FA" />
      <path d="M406 98H440L432 108L440 118H406Z" fill="#E8B95B" />
      {RUNNERS.map((r) => (
        <g key={r.cloth} transform={`translate(${r.x} ${r.y}) scale(${r.s})`}>
          <ellipse cx="-14" cy="52" rx="26" ry="5" fill="#F6D9A8" opacity="0.22" />
          <ellipse cx="-40" cy="48" rx="16" ry="4" fill="#F6D9A8" opacity="0.12" />
          <ellipse cx="50" cy="56" rx="40" ry="4" fill="#000" opacity="0.25" />
          <use href="#hr-horse" fill="#1A0E06" />
          <rect x="38" y="18" width="18" height="13" rx="2" fill={r.cloth} />
        </g>
      ))}
    </svg>
  );
}
