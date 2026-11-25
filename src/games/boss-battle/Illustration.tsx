/** Provisional launcher artwork – replace with games/boss-battle/tile.webp (docs/ASSETS.md). */
const mirror = (d: string) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x: string, y: string) => `${480 - Number(x)} ${y}`);

const ARM = 'M182 112 L150 120 L132 190 L150 210 L168 198 L178 142 Z';
const FIST = 'M126 194 L160 198 L163 228 L124 226 Z';
const LEG = 'M198 200 L228 200 L232 262 L192 262 Z';

export function BossBattleIllustration() {
  return (
    <svg viewBox="0 0 480 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="bb-bg" cx="0.5" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#3A1C6B" />
          <stop offset="0.6" stopColor="#170A2E" />
          <stop offset="1" stopColor="#08040F" />
        </radialGradient>
        <linearGradient id="bb-stone" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#5E5878" />
          <stop offset="1" stopColor="#2A2640" />
        </linearGradient>
        <radialGradient id="bb-core" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFE2A8" />
          <stop offset="0.5" stopColor="#FF8A3D" />
          <stop offset="1" stopColor="#C2410C" />
        </radialGradient>
        <radialGradient id="bb-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FF8A3D" stopOpacity="0.6" />
          <stop offset="1" stopColor="#FF8A3D" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bb-bolt" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#8B5CF6" stopOpacity="0" />
          <stop offset="0.5" stopColor="#B794FF" />
          <stop offset="1" stopColor="#FFE2A8" />
        </linearGradient>
        <linearGradient id="bb-hp" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FF8A3D" />
          <stop offset="1" stopColor="#F6D994" />
        </linearGradient>
      </defs>
      <rect width="480" height="300" fill="url(#bb-bg)" />
      {/* Arena floor with rune ring */}
      <ellipse cx="240" cy="268" rx="220" ry="38" fill="#140A26" />
      <ellipse cx="240" cy="266" rx="150" ry="22" fill="none" stroke="#8B5CF6" strokeOpacity="0.6" strokeWidth="2" strokeDasharray="3 9" />
      <ellipse cx="240" cy="266" rx="118" ry="16" fill="none" stroke="#8B5CF6" strokeOpacity="0.35" strokeWidth="1.5" />
      {/* Golem */}
      <g className="ill-sway">
        <circle cx="240" cy="158" r="90" fill="url(#bb-glow)" opacity="0.5" />
        <path d={LEG} fill="url(#bb-stone)" />
        <path d={mirror(LEG)} fill="url(#bb-stone)" />
        <path d={ARM} fill="url(#bb-stone)" />
        <path d={mirror(ARM)} fill="url(#bb-stone)" />
        <path d={FIST} fill="#4A4562" />
        <path d={mirror(FIST)} fill="#4A4562" />
        <path d="M180 110 L300 110 L292 206 L188 206 Z" fill="url(#bb-stone)" />
        <path d="M180 110 L300 110 L296 124 L184 124 Z" fill="#7A7398" opacity="0.6" />
        <path d="M214 70 L266 70 L274 106 L206 106 Z" fill="url(#bb-stone)" />
        <path d="M214 70 L266 70 L268 78 L212 78 Z" fill="#7A7398" opacity="0.6" />
        <rect x="222" y="84" width="13" height="6" rx="2" fill="#FF8A3D" />
        <rect x="245" y="84" width="13" height="6" rx="2" fill="#FF8A3D" />
        <circle cx="240" cy="158" r="34" fill="url(#bb-glow)" />
        <path d="M240 134 L257 158 L240 182 L223 158 Z" fill="url(#bb-core)" />
        <path d="M196 140 L210 160 L204 178 M284 132 L272 150 L280 170" fill="none" stroke="#FF8A3D" strokeOpacity="0.55" strokeWidth="2" />
      </g>
      {/* Floating rocks */}
      <path d="M96 92l14-6 8 10-12 8z" fill="#3D3856" />
      <path d="M380 70l12-4 6 9-10 6z" fill="#3D3856" />
      <path d="M402 150l9-3 5 7-8 4z" fill="#3D3856" />
      {/* Magic attack */}
      <path d="M-10 300 C60 250 120 200 206 148" fill="none" stroke="url(#bb-bolt)" strokeWidth="7" strokeLinecap="round" />
      <path d="M206 148 l6 -18 l4 18 l18 4 l-18 5 l-4 18 l-6 -18 l-18 -4 z" fill="#FFF1D6" className="ill-pulse" />
      {[[178, 170, 3], [192, 130, 2.5], [222, 168, 2], [168, 150, 2]].map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#E9DDFF" opacity="0.8" />
      ))}
      {/* Boss energy */}
      <rect x="140" y="22" width="200" height="12" rx="6" fill="#08040F" opacity="0.7" stroke="#B794FF" strokeOpacity="0.5" />
      <rect x="142" y="24" width="120" height="8" rx="4" fill="url(#bb-hp)" />
    </svg>
  );
}
