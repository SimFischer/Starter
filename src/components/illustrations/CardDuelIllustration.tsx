/** Provisional artwork for the hidden card duel – replace with shared/card-duel.webp (docs/ASSETS.md). */
const HEART = 'M0 -10C-6 -20 -22 -16 -20 -2C-18 8 -6 14 0 22C6 14 18 8 20 -2C22 -16 6 -20 0 -10Z';

export function CardDuelIllustration() {
  return (
    <svg viewBox="0 0 480 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="cd-bg" cx="0.55" cy="0.45" r="0.8">
          <stop offset="0" stopColor="#2A3550" />
          <stop offset="1" stopColor="#0B111C" />
        </radialGradient>
        <radialGradient id="cd-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#F6D994" stopOpacity="0.55" />
          <stop offset="1" stopColor="#F6D994" stopOpacity="0" />
        </radialGradient>
        <pattern id="cd-back" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="14" height="14" fill="#1B2940" />
          <rect width="7" height="7" fill="#E8B95B" opacity="0.16" />
        </pattern>
      </defs>
      <rect width="480" height="300" fill="url(#cd-bg)" />
      {/* Face-down card */}
      <g transform="translate(176 160) rotate(-14)">
        <rect x="-62" y="-84" width="124" height="172" rx="12" fill="#000" opacity="0.35" transform="translate(6 8)" />
        <rect x="-62" y="-86" width="124" height="172" rx="12" fill="#1B2940" stroke="#E8B95B" strokeWidth="3" />
        <rect x="-50" y="-74" width="100" height="148" rx="7" fill="url(#cd-back)" stroke="#E8B95B" strokeOpacity="0.5" />
        <circle r="20" fill="#101827" stroke="#E8B95B" strokeWidth="2" />
        <path d="M-8 -6h16v4h-6v14h-4V-2h-6z" fill="#E8B95B" />
      </g>
      {/* Revealed card */}
      <circle cx="300" cy="150" r="130" fill="url(#cd-glow)" className="ill-pulse" />
      <g transform="translate(300 150) rotate(8)">
        <rect x="-62" y="-84" width="124" height="172" rx="12" fill="#000" opacity="0.35" transform="translate(6 8)" />
        <rect x="-62" y="-86" width="124" height="172" rx="12" fill="#FBF7EE" />
        <text x="-44" y="-50" fill="#C8283E" style={{ font: '800 34px var(--font-display)' }}>
          7
        </text>
        <path d={HEART} transform="translate(-37 -32) scale(0.42)" fill="#C8283E" />
        <path d={HEART} transform="translate(0 6) scale(1.5)" fill="#C8283E" />
        <g transform="rotate(180)">
          <text x="-44" y="-50" fill="#C8283E" style={{ font: '800 34px var(--font-display)' }}>
            7
          </text>
        </g>
      </g>
      {([[230, 60], [380, 92], [372, 236], [216, 250]] as const).map(([x, y]) => (
        <path key={`${x}-${y}`} d={`M${x} ${y - 8}l2.5 5.5 5.5 2.5-5.5 2.5-2.5 5.5-2.5-5.5-5.5-2.5 5.5-2.5z`} fill="#F6D994" opacity="0.8" />
      ))}
    </svg>
  );
}
