/** Provisional launcher artwork – replace with games/football/tile.webp (docs/ASSETS.md). */
const STRIPES = Array.from({ length: 8 }, (_, i) => i);
const POSITIONS = [96, 144, 192, 240, 288, 336, 384];

export function FootballIllustration() {
  return (
    <svg viewBox="0 0 480 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="fb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#040D0B" />
          <stop offset="1" stopColor="#0E2C23" />
        </linearGradient>
        <radialGradient id="fb-flood-l" cx="0.09" cy="0.04" r="0.75">
          <stop offset="0" stopColor="#FFF6D8" stopOpacity="0.5" />
          <stop offset="0.45" stopColor="#E8F5EC" stopOpacity="0.1" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="fb-flood-r" cx="0.91" cy="0.04" r="0.75">
          <stop offset="0" stopColor="#FFF6D8" stopOpacity="0.5" />
          <stop offset="0.45" stopColor="#E8F5EC" stopOpacity="0.1" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fb-pitch" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1C8452" />
          <stop offset="1" stopColor="#0F5A35" />
        </linearGradient>
        <radialGradient id="fb-ball-glow">
          <stop offset="0" stopColor="#F6D994" stopOpacity="0.75" />
          <stop offset="1" stopColor="#F6D994" stopOpacity="0" />
        </radialGradient>
        <pattern id="fb-crowd" width="9" height="8" patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="1.6" fill="#8FB9A9" opacity="0.32" />
          <circle cx="7" cy="6.5" r="1.6" fill="#D5EBE0" opacity="0.2" />
        </pattern>
      </defs>
      <rect width="480" height="300" fill="url(#fb-sky)" />
      {/* Tribunes */}
      <path d="M0 68H480V152H0Z" fill="#0A1E18" />
      <path d="M0 68H480V152H0Z" fill="url(#fb-crowd)" />
      <path d="M0 60H480V70H0Z" fill="#17392F" />
      <path d="M0 146H480V154H0Z" fill="#0D2A21" />
      {/* Floodlights */}
      {[0, 1].map((side) => (
        <g key={side} transform={side ? 'translate(480 0) scale(-1 1)' : undefined}>
          <rect x="41" y="14" width="4" height="48" fill="#6E8C81" />
          <rect x="24" y="4" width="38" height="14" rx="2" fill="#2A4A40" />
          {[30, 39, 48].map((x) => (
            <circle key={x} cx={x + 2} cy="11" r="3" fill="#FFF7DC" />
          ))}
        </g>
      ))}
      {/* Pitch */}
      <path d="M60 150H420L520 300H-40Z" fill="url(#fb-pitch)" />
      {STRIPES.filter((i) => i % 2 === 1).map((i) => (
        <path
          key={i}
          d={`M${60 + i * 45} 150H${105 + i * 45}L${30 + i * 70} 300H${-40 + i * 70}Z`}
          fill="#000"
          opacity="0.09"
        />
      ))}
      <rect width="480" height="300" fill="url(#fb-flood-l)" />
      <rect width="480" height="300" fill="url(#fb-flood-r)" />
      <g fill="none" stroke="#F4F6FA" strokeOpacity="0.72" strokeWidth="2" strokeLinejoin="round">
        <path d="M70 156H410L500 296H-20Z" />
        <path d="M240 156V296" />
        <ellipse cx="240" cy="222" rx="48" ry="21" />
      </g>
      {/* Goals */}
      {[0, 1].map((side) => (
        <g key={side} transform={side ? 'translate(480 0) scale(-1 1)' : undefined}>
          <path d="M42 176L28 172L-1 217L13 221Z" fill="#F4F6FA" opacity="0.14" />
          <path d="M28 172V196L-1 241V217Z" fill="#F4F6FA" opacity="0.08" />
          <path d="M42 200V176L13 221V245" fill="none" stroke="#F4F6FA" strokeWidth="3" strokeLinejoin="round" />
        </g>
      ))}
      {/* Field positions – the core mechanic */}
      {POSITIONS.map((x) => (
        <ellipse key={x} cx={x} cy="222" rx="6" ry="2.8" fill={x === 240 ? '#F6D994' : '#F4F6FA'} opacity={x === 240 ? 0.9 : 0.38} />
      ))}
      <g fill="#F6D994">
        <path d="M266 206l9 8-9 8" fill="none" stroke="#F6D994" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
        <path d="M281 206l9 8-9 8" fill="none" stroke="#F6D994" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
      </g>
      <g className="ill-bob">
        <circle cx="240" cy="206" r="34" fill="url(#fb-ball-glow)" />
        <ellipse cx="240" cy="221" rx="13" ry="3.5" fill="#000" opacity="0.35" />
        <circle cx="240" cy="206" r="11" fill="#F4F6FA" />
        <path d="M240 200.5l5 3.6-1.9 5.9h-6.2l-1.9-5.9Z" fill="#1B2940" />
        <path d="M232 198.5l2.5 3.5M248 198.5l-2.5 3.5M231.5 212l3.5-2M248.5 212l-3.5-2M240 216.5v-3.5" stroke="#1B2940" strokeWidth="1.6" strokeLinecap="round" />
      </g>
    </svg>
  );
}
