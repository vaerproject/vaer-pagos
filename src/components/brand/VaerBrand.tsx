"use client";

// ─── VAER Wordmark SVG ────────────────────────────────────────
export function VaerWordmark({ color = "#FBFBFB", height = 16 }: { color?: string; height?: number }) {
  return (
    <svg viewBox="0 0 340 72" height={height} fill="none" style={{ display: "block" }}>
      <polyline points="0,4 28,68 56,4"    stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="76,68 104,4 132,68" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="86" y1="46" x2="122" y2="46" stroke={color} strokeWidth="6" strokeLinecap="round"/>
      <line x1="152" y1="7"  x2="192" y2="7"  stroke={color} strokeWidth="6" strokeLinecap="round"/>
      <line x1="152" y1="36" x2="184" y2="36" stroke={color} strokeWidth="6" strokeLinecap="round"/>
      <line x1="152" y1="65" x2="188" y2="65" stroke={color} strokeWidth="6" strokeLinecap="round"/>
      <path d="M212,68 L212,4 L242,4 Q268,4 268,30 Q268,52 242,52 L212,52" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="242" y1="52" x2="272" y2="68" stroke={color} strokeWidth="6" strokeLinecap="round"/>
    </svg>
  );
}

// ─── VAER Isologo (zigzag mark) ───────────────────────────────
export function IsoMark({ color = "#FBFBFB", size = 20 }: { color?: string; size?: number }) {
  return (
    <svg viewBox="0 0 70 115" width={size} height={size * 1.64} fill="none" style={{ display: "block" }}>
      <polyline points="66,5 4,38 66,38"  stroke={color} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="4" y1="63" x2="66" y2="63" stroke={color} strokeWidth="10" strokeLinecap="round"/>
      <polyline points="4,88 66,88 4,110"  stroke={color} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
