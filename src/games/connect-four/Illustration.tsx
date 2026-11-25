/** Provisional launcher artwork – replace with games/connect-four/tile.webp (docs/ASSETS.md). */
const COLS = 7;
const ROWS = 6;
const cx = (c: number) => 124 + c * 36;
const cy = (r: number) => 96 + r * 34;

type Team = 'red' | 'blue';
const DISCS: [number, number, Team][] = [
  [1, 5, 'red'], [2, 5, 'blue'], [3, 5, 'blue'], [4, 5, 'red'], [5, 5, 'blue'],
  [2, 4, 'red'], [3, 4, 'blue'], [4, 4, 'blue'], [5, 4, 'red'],
  [3, 3, 'red'], [4, 3, 'blue'],
  [4, 2, 'red'],
];

function Disc({ c, r, team }: { c: number; r: number; team: Team }) {
  const x = cx(c);
  const y = cy(r);
  return team === 'red' ? (
    <g>
      <circle cx={x} cy={y} r="13" fill="url(#c4-red)" />
      <circle cx={x} cy={y} r="6.5" fill="none" stroke="#FFD3D5" strokeWidth="2.5" opacity="0.85" />
    </g>
  ) : (
    <g>
      <circle cx={x} cy={y} r="13" fill="url(#c4-blue)" />
      <path d={`M${x} ${y - 7}L${x + 7} ${y}L${x} ${y + 7}L${x - 7} ${y}Z`} fill="#D6E6FF" opacity="0.85" />
    </g>
  );
}

export function ConnectFourIllustration() {
  return (
    <svg viewBox="0 0 480 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="c4-bg" cx="0.5" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#1A2244" />
          <stop offset="1" stopColor="#070B18" />
        </radialGradient>
        <radialGradient id="c4-red" cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#FF8A8D" />
          <stop offset="0.6" stopColor="#E5484D" />
          <stop offset="1" stopColor="#A82A30" />
        </radialGradient>
        <radialGradient id="c4-blue" cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#9CC5FF" />
          <stop offset="0.6" stopColor="#3E8BFF" />
          <stop offset="1" stopColor="#1F55B8" />
        </radialGradient>
        <linearGradient id="c4-board" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2C3E6E" />
          <stop offset="1" stopColor="#1A2648" />
        </linearGradient>
        <filter id="c4-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      <rect width="480" height="300" fill="url(#c4-bg)" />
      <circle cx="70" cy="150" r="140" fill="#E5484D" opacity="0.13" />
      <circle cx="410" cy="150" r="140" fill="#3E8BFF" opacity="0.15" />
      {/* Stand + board with depth */}
      <path d="M96 300L116 270H140L130 300Z M384 300L364 270H340L350 300Z" fill="#141D38" />
      <rect x="108" y="80" width="260" height="214" rx="14" fill="#0E1630" />
      <rect x="102" y="74" width="260" height="214" rx="14" fill="url(#c4-board)" />
      <rect x="102" y="74" width="260" height="214" rx="14" fill="none" stroke="#5B74B5" strokeOpacity="0.5" strokeWidth="2" />
      {Array.from({ length: COLS * ROWS }, (_, i) => (
        <circle key={i} cx={cx(i % COLS)} cy={cy(Math.floor(i / COLS))} r="13.5" fill="#080D1E" />
      ))}
      {DISCS.map(([c, r, team]) => (
        <Disc key={`${c}-${r}`} c={c} r={r} team={team} />
      ))}
      {/* Winning line */}
      <path d={`M${cx(1)} ${cy(5)}L${cx(4)} ${cy(2)}`} stroke="#F6D994" strokeWidth="10" strokeLinecap="round" opacity="0.55" filter="url(#c4-glow)" />
      <path d={`M${cx(1)} ${cy(5)}L${cx(4)} ${cy(2)}`} stroke="#F6D994" strokeWidth="3" strokeLinecap="round" />
      {/* Falling disc */}
      <g className="ill-drop">
        <ellipse cx={cx(6)} cy="20" rx="9" ry="5" fill="#3E8BFF" opacity="0.15" />
        <ellipse cx={cx(6)} cy="34" rx="11" ry="6" fill="#3E8BFF" opacity="0.25" />
        <circle cx={cx(6)} cy="54" r="13" fill="url(#c4-blue)" />
        <path d={`M${cx(6)} 47L${cx(6) + 7} 54L${cx(6)} 61L${cx(6) - 7} 54Z`} fill="#D6E6FF" opacity="0.85" />
      </g>
    </svg>
  );
}
