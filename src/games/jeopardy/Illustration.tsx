/** Provisional launcher artwork – replace with games/jeopardy/tile.webp (docs/ASSETS.md). */
const COLS = 5;
const VALUES = [100, 200, 300, 400];
const colX = (c: number) => 60 + c * 73;
const rowY = (r: number) => 90 + r * 47;
const PLAYED = new Set(['0-0', '1-0', '3-0', '0-1', '4-1', '2-0', '2-2']);

export function JeopardyIllustration() {
  return (
    <svg viewBox="0 0 480 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="jp-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0B1A52" />
          <stop offset="1" stopColor="#040A22" />
        </linearGradient>
        <linearGradient id="jp-tile" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2F5BEA" />
          <stop offset="1" stopColor="#1A3699" />
        </linearGradient>
        <linearGradient id="jp-head" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1C3BB0" />
          <stop offset="1" stopColor="#12277A" />
        </linearGradient>
        <radialGradient id="jp-burst" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#F6D994" stopOpacity="0.65" />
          <stop offset="1" stopColor="#F6D994" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="480" height="300" fill="url(#jp-bg)" />
      {/* Stage lights */}
      <path d="M90 0L130 0L210 300H10Z" fill="#9FB8FF" opacity="0.06" />
      <path d="M350 0L390 0L470 300H270Z" fill="#9FB8FF" opacity="0.06" />
      <path d="M50 52H430" stroke="#E8B95B" strokeOpacity="0.5" strokeWidth="1.5" />
      {Array.from({ length: COLS }, (_, c) => (
        <g key={c}>
          <rect x={colX(c)} y="58" width="68" height="26" rx="4" fill="url(#jp-head)" />
          <rect x={colX(c) + 12} y="66" width="44" height="4" rx="2" fill="#F4F6FA" opacity="0.75" />
          <rect x={colX(c) + 20} y="74" width="28" height="3" rx="1.5" fill="#F4F6FA" opacity="0.4" />
          {VALUES.map((v, r) => {
            const key = `${c}-${r}`;
            const played = PLAYED.has(key);
            return (
              <g key={key}>
                <rect x={colX(c)} y={rowY(r)} width="68" height="42" rx="4" fill={played ? '#0E1A4A' : 'url(#jp-tile)'} />
                {!played && (
                  <text
                    x={colX(c) + 34}
                    y={rowY(r) + 28}
                    textAnchor="middle"
                    fill="#E8B95B"
                    style={{ font: '800 19px var(--font-display)' }}
                  >
                    {v}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      ))}
      {/* Selected field opening */}
      <g className="ill-pulse">
        <circle cx={colX(2) + 34} cy={rowY(2) + 21} r="70" fill="url(#jp-burst)" />
      </g>
      <rect x={colX(2) - 6} y={rowY(2) - 5} width="80" height="52" rx="6" fill="url(#jp-tile)" stroke="#F6D994" strokeWidth="3" />
      <text x={colX(2) + 34} y={rowY(2) + 31} textAnchor="middle" fill="#F6D994" style={{ font: '800 24px var(--font-display)' }}>
        {VALUES[2]}
      </text>
      <rect x={colX(2) - 6} y={rowY(2) - 5} width="80" height="52" rx="6" fill="none" stroke="#FFF6DE" strokeOpacity="0.35" strokeWidth="8" />
      <ellipse cx="240" cy="298" rx="230" ry="16" fill="#2F5BEA" opacity="0.25" />
    </svg>
  );
}
