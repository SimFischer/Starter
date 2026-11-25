/** Provisional launcher artwork – replace with games/memory/tile.webp (docs/ASSETS.md). */
const W = 74;
const H = 100;
const x = (c: number) => 71 + c * (W + 14);
const y = (r: number) => 42 + r * (H + 14);

type Card = { c: number; r: number; rot: number; face?: string; flipping?: boolean };
const CARDS: Card[] = [
  { c: 0, r: 0, rot: -3 },
  { c: 1, r: 0, rot: 2, face: 'Dog' },
  { c: 2, r: 0, rot: -1 },
  { c: 3, r: 0, rot: 3, flipping: true },
  { c: 0, r: 1, rot: 2 },
  { c: 1, r: 1, rot: -2 },
  { c: 2, r: 1, rot: 1, face: 'Hund' },
  { c: 3, r: 1, rot: -3 },
];

function CardShape({ card }: { card: Card }) {
  const cx = x(card.c) + W / 2;
  const cy = y(card.r) + H / 2;
  const sx = card.flipping ? 0.28 : 1;
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${card.rot}) scale(${sx} 1)`}>
      <rect x={-W / 2 + 3} y={-H / 2 + 5} width={W} height={H} rx="9" fill="#000" opacity="0.3" />
      {card.face ? (
        <>
          <rect x={-W / 2 - 4} y={-H / 2 - 4} width={W + 8} height={H + 8} rx="12" fill="none" stroke="#2CC7C0" strokeWidth="3" opacity="0.9" />
          <rect x={-W / 2} y={-H / 2} width={W} height={H} rx="9" fill="#F4F6FA" />
          <text y="7" textAnchor="middle" fill="#0E3A4A" style={{ font: '700 19px var(--font-display)' }}>
            {card.face}
          </text>
        </>
      ) : (
        <>
          <rect x={-W / 2} y={-H / 2} width={W} height={H} rx="9" fill={card.flipping ? '#3A9FB0' : '#11506A'} />
          {!card.flipping && (
            <>
              <rect x={-W / 2 + 6} y={-H / 2 + 6} width={W - 12} height={H - 12} rx="6" fill="url(#mm-pattern)" />
              <circle r="13" fill="#0B3447" stroke="#2CC7C0" strokeWidth="2" />
              <path d="M-6 0L0 -7L6 0L0 7Z" fill="#2CC7C0" />
            </>
          )}
        </>
      )}
    </g>
  );
}

export function MemoryIllustration() {
  return (
    <svg viewBox="0 0 480 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="mm-bg" cx="0.5" cy="0.4" r="0.8">
          <stop offset="0" stopColor="#0F4651" />
          <stop offset="1" stopColor="#051419" />
        </radialGradient>
        <pattern id="mm-pattern" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="12" height="12" fill="#11506A" />
          <rect width="6" height="6" fill="#2CC7C0" opacity="0.18" />
        </pattern>
        <radialGradient id="mm-match" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#2CC7C0" stopOpacity="0.55" />
          <stop offset="1" stopColor="#2CC7C0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="480" height="300" fill="url(#mm-bg)" />
      <circle cx="380" cy="40" r="160" fill="#3A86FF" opacity="0.1" />
      <circle cx={x(1) + W / 2} cy={y(0) + H / 2} r="70" fill="url(#mm-match)" className="ill-pulse" />
      <circle cx={x(2) + W / 2} cy={y(1) + H / 2} r="70" fill="url(#mm-match)" className="ill-pulse" />
      {CARDS.map((card) => (
        <CardShape key={`${card.c}-${card.r}`} card={card} />
      ))}
      <path
        d={`M${x(1) + W / 2 + 18} ${y(0) + H + 4} Q ${x(2) + 10} ${y(1) - 2} ${x(2) + W / 2 - 14} ${y(1) - 6}`}
        fill="none"
        stroke="#7FF0E6"
        strokeWidth="2.5"
        strokeDasharray="2 6"
        strokeLinecap="round"
      />
    </svg>
  );
}
