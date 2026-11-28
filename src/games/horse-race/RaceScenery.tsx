/**
 * Provisional daylight scenery for the race (Kreide & Gold: warm afternoon
 * light, soft painted shapes). Replace with horse-race/scenery.webp later.
 */
export function RaceScenery() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="rs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7FA9C2" />
          <stop offset="0.55" stopColor="#E9C892" />
          <stop offset="1" stopColor="#F3B66B" />
        </linearGradient>
        <radialGradient id="rs-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFF4D6" />
          <stop offset="0.4" stopColor="#FFE2A3" stopOpacity="0.8" />
          <stop offset="1" stopColor="#FFD08A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rs-meadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7E9B4E" />
          <stop offset="1" stopColor="#4F6E34" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#rs-sky)" />
      <circle cx="1260" cy="210" r="190" fill="url(#rs-sun)" />
      <g fill="#FFF8EC" opacity="0.55">
        <ellipse cx="320" cy="140" rx="120" ry="26" />
        <ellipse cx="400" cy="122" rx="80" ry="22" />
        <ellipse cx="900" cy="96" rx="140" ry="24" />
      </g>
      <path d="M0 330C180 270 360 300 520 280C700 256 860 310 1040 290C1220 270 1400 300 1600 280V420H0Z" fill="#8FA36A" opacity="0.7" />
      <path d="M0 370C220 330 420 360 640 344C860 328 1080 370 1300 352C1440 340 1520 350 1600 346V460H0Z" fill="#6F8C48" />
      {[90, 210, 330, 1080, 1180, 1450].map((x, i) => (
        <g key={x} transform={`translate(${x} ${350 - (i % 2) * 8})`}>
          <rect x="-4" y="0" width="8" height="34" fill="#5A3E26" />
          <ellipse cx="0" cy="-8" rx="30" ry="34" fill={i % 2 ? '#56763A' : '#4C6C33'} />
        </g>
      ))}
      <rect y="400" width="1600" height="500" fill="url(#rs-meadow)" />
      {/* White fence */}
      <path d="M0 420H1600" stroke="#F6F1E6" strokeWidth="6" />
      <path d="M0 440H1600" stroke="#F6F1E6" strokeWidth="4" opacity="0.8" />
      {Array.from({ length: 33 }, (_, i) => (
        <rect key={i} x={i * 50 - 3} y="408" width="6" height="40" fill="#F6F1E6" />
      ))}
    </svg>
  );
}
