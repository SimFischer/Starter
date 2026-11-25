/** Provisional launcher artwork – replace with games/treasure-hunt/tile.webp (docs/ASSETS.md). */
function Chest({ x, y, s, open = false }: { x: number; y: number; s: number; open?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="24" rx="34" ry="6" fill="#000" opacity="0.3" />
      {open ? (
        <path d="M-28 -2 L-24 -30 L24 -30 L28 -2 Z" fill="#4E2A12" />
      ) : (
        <path d="M-28 -2 C-28 -22 28 -22 28 -2 Z" fill="#7A4521" />
      )}
      <rect x="-28" y="-4" width="56" height="28" rx="3" fill="#7A4521" />
      <rect x="-28" y="-4" width="56" height="6" fill="#E8B95B" />
      <rect x="-24" y="-4" width="6" height="28" fill="#C9933A" />
      <rect x="18" y="-4" width="6" height="28" fill="#C9933A" />
      <rect x="-5" y="2" width="10" height="11" rx="2" fill="#F6D994" />
    </g>
  );
}

export function TreasureHuntIllustration() {
  return (
    <svg viewBox="0 0 480 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="th-sea" cx="0.5" cy="0.45" r="0.85">
          <stop offset="0" stopColor="#13626A" />
          <stop offset="1" stopColor="#04191C" />
        </radialGradient>
        <linearGradient id="th-sand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E3C285" />
          <stop offset="1" stopColor="#B3854A" />
        </linearGradient>
        <radialGradient id="th-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFE7A6" stopOpacity="0.9" />
          <stop offset="0.4" stopColor="#E8B95B" stopOpacity="0.45" />
          <stop offset="1" stopColor="#E8B95B" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="480" height="300" fill="url(#th-sea)" />
      <g fill="none" stroke="#2A8A8C" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round">
        <path d="M22 40q10-6 20 0t20 0" />
        <path d="M400 30q10-6 20 0t20 0" />
        <path d="M30 250q10-6 20 0t20 0" />
        <path d="M420 262q10-6 20 0t20 0" />
      </g>
      {/* Island */}
      <path d="M70 170C60 120 120 80 190 86C250 60 340 70 390 110C430 140 420 200 370 224C320 250 250 236 200 246C130 258 80 220 70 170Z" fill="#E9D3A2" opacity="0.35" />
      <path d="M82 168C76 124 128 94 192 98C252 76 334 86 378 118C412 144 404 196 362 214C318 234 252 222 204 232C138 244 90 210 82 168Z" fill="url(#th-sand)" />
      <path d="M150 110L172 78L194 110Z M182 112L208 68L234 112Z" fill="#7C6A4B" />
      <path d="M172 78L180 90L166 92Z M208 68L218 84L200 86Z" fill="#F4F6FA" opacity="0.7" />
      {/* Palm */}
      <path d="M318 196C320 170 326 150 338 134" stroke="#6B4423" strokeWidth="5" fill="none" strokeLinecap="round" />
      <g fill="#2F7D5B">
        <ellipse cx="324" cy="132" rx="20" ry="6" transform="rotate(-20 324 132)" />
        <ellipse cx="352" cy="130" rx="20" ry="6" transform="rotate(25 352 130)" />
        <ellipse cx="340" cy="122" rx="18" ry="5" transform="rotate(-70 340 122)" />
      </g>
      {/* Route */}
      <path d="M110 190C140 160 170 196 200 170C224 150 244 176 268 166" fill="none" stroke="#7A3E1A" strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" />
      <path d="M128 132l10 10m0-10l-10 10" stroke="#A23B2A" strokeWidth="3" strokeLinecap="round" />
      <Chest x={130} y={196} s={0.42} />
      <Chest x={222} y={130} s={0.42} />
      {/* Opened chest with treasure */}
      <circle cx="286" cy="160" r="66" fill="url(#th-glow)" className="ill-pulse" />
      <Chest x={286} y={176} s={0.9} open />
      <g>
        <ellipse cx="276" cy="150" rx="9" ry="4" fill="#F6D994" />
        <ellipse cx="292" cy="146" rx="9" ry="4" fill="#E8B95B" />
        <ellipse cx="284" cy="141" rx="9" ry="4" fill="#F6D994" />
        <path d="M300 128l7 8-7 9-7-9z" fill="#2CE0D0" />
        <path d="M268 132l6 6-6 8-6-8z" fill="#E5484D" />
      </g>
      {([[262, 116], [312, 120], [300, 100]] as const).map(([sx, sy]) => (
        <path key={`${sx}`} d={`M${sx} ${sy - 6}l2 4 4 2-4 2-2 4-2-4-4-2 4-2z`} fill="#FFF6D8" />
      ))}
      {/* Compass rose */}
      <g transform="translate(424 214)" fill="none" stroke="#E8B95B" strokeOpacity="0.65" strokeWidth="1.5">
        <circle r="24" />
        <path d="M0 -32L6 -6L32 0L6 6L0 32L-6 6L-32 0L-6 -6Z" fill="#E8B95B" fillOpacity="0.2" />
      </g>
    </svg>
  );
}
