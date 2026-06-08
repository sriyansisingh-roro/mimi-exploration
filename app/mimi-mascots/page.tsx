"use client";

import { Instrument_Serif, Manrope, Space_Grotesk } from "next/font/google";

const instrument = Instrument_Serif({ weight: "400", subsets: ["latin"], variable: "--font-instrument" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });

const C = {
  ink: "#3A3460", soft: "#7C7F95", line: "#E7E6F2", primary: "#6C73FF",
  bg: "#FBFAFF", cool: "#F2F1FC", warm: "#FFF8F1",
  hi: "#ECE6FC", mid: "#C9BDF1", lo: "#A78FDE", deep: "#8676C4",
  blush: "#E7B8CE", glow: "#FFD79A",
  gHi: "#A9DC8E", gLo: "#74BE78",
};

/* shared soft face — calm, restrained (not childish) */
function Face({ x, y, gap = 16, blush = 0.55, smile = "gentle" }: { x: number; y: number; gap?: number; blush?: number; smile?: string }) {
  const sm = smile === "soft" ? `M${x - 6} ${y + 14} Q${x} ${y + 18} ${x + 6} ${y + 14}` : `M${x - 7} ${y + 14} Q${x} ${y + 19} ${x + 7} ${y + 14}`;
  return (
    <g>
      <ellipse cx={x - gap - 8} cy={y + 6} rx="6" ry="3.6" fill={C.blush} opacity={blush} />
      <ellipse cx={x + gap + 8} cy={y + 6} rx="6" ry="3.6" fill={C.blush} opacity={blush} />
      <ellipse cx={x - gap} cy={y} rx="4.2" ry="5.2" fill={C.ink} />
      <circle cx={x - gap - 1.4} cy={y - 1.8} r="1.3" fill="#fff" />
      <ellipse cx={x + gap} cy={y} rx="4.2" ry="5.2" fill={C.ink} />
      <circle cx={x + gap - 1.4} cy={y - 1.8} r="1.3" fill="#fff" />
      <path d={sm} stroke={C.ink} strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </g>
  );
}
function Defs({ id }: { id: string }) {
  return (
    <defs>
      <radialGradient id={`${id}-b`} cx="40%" cy="28%" r="86%">
        <stop offset="0%" stopColor={C.hi} /><stop offset="55%" stopColor={C.mid} /><stop offset="100%" stopColor={C.lo} />
      </radialGradient>
      <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0%" stopColor={C.gHi} /><stop offset="100%" stopColor={C.gLo} />
      </linearGradient>
      <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={C.glow} stopOpacity="0.8" /><stop offset="100%" stopColor={C.glow} stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

/* 1 · Cloud-Bud */
function CloudBud({ id }: { id: string }) {
  return (<><Defs id={id} />
    <ellipse cx="100" cy="174" rx="46" ry="7.5" fill={C.ink} opacity="0.07" />
    <path d="M100 70 Q100 60 100 52" stroke={C.gLo} strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M100 56 C92 54 85 47 87 41 C94 40 101 49 100 56 Z" fill={`url(#${id}-g)`} />
    <path d="M100 56 C108 54 115 47 113 41 C106 40 99 49 100 56 Z" fill={`url(#${id}-g)`} />
    <ellipse cx="86" cy="158" rx="10" ry="7" fill={C.lo} /><ellipse cx="118" cy="158" rx="10" ry="7" fill={C.lo} />
    <path d="M54 150 C36 151 27 134 34 118 C23 112 25 92 43 90 C45 73 65 68 79 79 C87 63 112 63 120 80 C136 71 157 77 157 96 C174 100 176 122 161 130 C163 147 147 156 130 151 C116 158 80 158 66 151 C61 153 56 152 54 150 Z" fill={`url(#${id}-b)`} />
    <ellipse cx="78" cy="98" rx="20" ry="12" fill="#fff" opacity="0.22" transform="rotate(-18 78 98)" />
    <Face x={100} y={113} gap={16} />
  </>);
}
/* 2 · Pebble */
function Pebble({ id }: { id: string }) {
  return (<><Defs id={id} />
    <ellipse cx="100" cy="174" rx="44" ry="7.5" fill={C.ink} opacity="0.07" />
    <ellipse cx="86" cy="167" rx="9" ry="6" fill={C.lo} /><ellipse cx="114" cy="167" rx="9" ry="6" fill={C.lo} />
    <path d="M100 50 C139 50 161 80 161 116 C161 150 135 168 100 168 C65 168 39 150 39 116 C39 80 61 50 100 50 Z" fill={`url(#${id}-b)`} />
    <ellipse cx="78" cy="86" rx="22" ry="13" fill="#fff" opacity="0.24" transform="rotate(-18 78 86)" />
    <Face x={100} y={108} gap={17} />
  </>);
}
/* 3 · Sprout */
function Sprout({ id }: { id: string }) {
  return (<><Defs id={id} />
    <ellipse cx="100" cy="176" rx="42" ry="7" fill={C.ink} opacity="0.07" />
    <path d="M100 74 Q100 60 100 49" stroke={C.gLo} strokeWidth="3.4" strokeLinecap="round" fill="none" />
    <path d="M100 56 C89 52 80 43 82 34 C91 33 101 46 100 56 Z" fill={`url(#${id}-g)`} />
    <path d="M100 56 C111 52 120 43 118 34 C109 33 99 46 100 56 Z" fill={`url(#${id}-g)`} />
    <path d="M99 52 Q92 46 86 40" stroke={C.gLo} strokeWidth="1" opacity="0.5" fill="none" />
    <ellipse cx="87" cy="167" rx="9" ry="6" fill={C.lo} /><ellipse cx="113" cy="167" rx="9" ry="6" fill={C.lo} />
    <path d="M100 72 C133 72 151 98 151 126 C151 154 129 170 100 170 C71 170 49 154 49 126 C49 98 67 72 100 72 Z" fill={`url(#${id}-b)`} />
    <ellipse cx="80" cy="104" rx="19" ry="11" fill="#fff" opacity="0.22" transform="rotate(-18 80 104)" />
    <Face x={100} y={124} gap={16} />
  </>);
}
/* 4 · Glow */
function Glow({ id }: { id: string }) {
  return (<><Defs id={id} />
    <ellipse cx="100" cy="174" rx="44" ry="7.5" fill={C.ink} opacity="0.07" />
    <circle cx="100" cy="124" r="62" fill={`url(#${id}-glow)`} />
    <ellipse cx="86" cy="167" rx="9" ry="6" fill={C.lo} /><ellipse cx="114" cy="167" rx="9" ry="6" fill={C.lo} />
    <path d="M100 54 C138 54 160 82 160 118 C160 150 134 166 100 166 C66 166 40 150 40 118 C40 82 62 54 100 54 Z" fill={`url(#${id}-b)`} />
    <ellipse cx="78" cy="88" rx="21" ry="12" fill="#fff" opacity="0.24" transform="rotate(-18 78 88)" />
    {/* tiny warm light beside */}
    <circle cx="150" cy="66" r="20" fill={`url(#${id}-glow)`} />
    <circle cx="150" cy="66" r="5.5" fill="#FFF1CE" /><circle cx="150" cy="66" r="3" fill={C.glow} />
    <Face x={100} y={110} gap={17} />
  </>);
}
/* 5 · Minimal Creature */
function Creature({ id }: { id: string }) {
  return (<><Defs id={id} />
    <ellipse cx="100" cy="176" rx="46" ry="7.5" fill={C.ink} opacity="0.07" />
    {/* small green bookmark accent */}
    <path d="M150 104 H166 V126 L158 120 L150 126 Z" fill={`url(#${id}-g)`} />
    <ellipse cx="84" cy="170" rx="9" ry="6" fill={C.lo} /><ellipse cx="116" cy="170" rx="9" ry="6" fill={C.lo} />
    <g transform="translate(46 130) rotate(16)"><ellipse cx="0" cy="0" rx="9" ry="12" fill={C.lo} /></g>
    <g transform="translate(154 130) rotate(-16)"><ellipse cx="0" cy="0" rx="9" ry="12" fill={C.lo} /></g>
    <path d="M100 56 C135 56 157 84 157 120 C157 152 133 168 100 168 C67 168 43 152 43 120 C43 84 65 56 100 56 Z" fill={`url(#${id}-b)`} />
    <ellipse cx="79" cy="88" rx="21" ry="12" fill="#fff" opacity="0.24" transform="rotate(-18 79 88)" />
    <Face x={100} y={112} gap={17} />
  </>);
}

const OPTIONS = [
  { key: "cloud", n: "01", name: "Cloud-Bud Mimi", node: CloudBud, vb: "34 50 130 130", meaning: "“A soft, safe place to begin.” Calm, rounded, emotionally weightless." },
  { key: "pebble", n: "02", name: "Pebble Mimi", node: Pebble, vb: "36 48 128 128", meaning: "“Steady and grounded.” Iconic and minimal — reads perfectly even tiny." },
  { key: "sprout", n: "03", name: "Sprout Mimi", node: Sprout, vb: "36 60 128 128", meaning: "“Quiet growth, one step at a time.” Hopeful and student-focused." },
  { key: "glow", n: "04", name: "Glow Mimi", node: Glow, vb: "34 48 132 132", meaning: "“A small light beside you.” Warm, reassuring presence." },
  { key: "creature", n: "05", name: "Minimal Creature Mimi", node: Creature, vb: "34 52 132 132", meaning: "“A gentle companion who’s simply here.” Warm character, still abstract." },
];

export default function MimiMascots() {
  return (
    <div className={`${instrument.variable} ${manrope.variable} ${grotesk.variable}`} style={{ fontFamily: "var(--font-manrope)", minHeight: "100vh", background: C.bg, color: C.ink }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "60px 40px 90px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 13px", borderRadius: 999, background: C.cool, border: `1px solid ${C.line}`, fontFamily: "var(--font-grotesk)", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: C.primary }}>
          <span style={{ width: 7, height: 7, borderRadius: 99, background: C.gLo }} /> MIMI · MASCOT DIRECTIONS
        </div>
        <h1 style={{ margin: "18px 0 4px", fontFamily: "var(--font-instrument)", fontWeight: 400, fontSize: 48, letterSpacing: "-0.02em", lineHeight: 1.05 }}>
          Five companion directions.
        </h1>
        <p style={{ margin: 0, color: C.soft, fontSize: 15, maxWidth: 660 }}>
          One emotional space — soft, calm, trustworthy, student-focused. Lavender identity with a small green growth accent. Each shown as a chat avatar and full body, idle.
        </p>

        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 18 }}>
          {OPTIONS.map((o) => {
            const Body = o.node;
            return (
              <div key={o.key} style={{ display: "grid", gridTemplateColumns: "120px 230px 1fr", alignItems: "center", gap: 28, background: "#fff", border: `1px solid ${C.line}`, borderRadius: 24, padding: "22px 30px", boxShadow: "0 1px 2px rgba(37,42,68,.04), 0 28px 64px -54px rgba(37,42,68,.3)" }}>
                {/* avatar */}
                <div style={{ justifySelf: "center", textAlign: "center" }}>
                  <div style={{ width: 88, height: 88, borderRadius: "50%", overflow: "hidden", background: `linear-gradient(135deg, ${C.warm}, ${C.cool})`, border: `1px solid ${C.line}`, display: "grid", placeItems: "center" }}>
                    <svg viewBox={o.vb} width="88" height="88"><Body id={`${o.key}-a`} /></svg>
                  </div>
                  <div style={{ marginTop: 7, fontSize: 11, color: C.soft, fontFamily: "var(--font-grotesk)" }}>avatar</div>
                </div>
                {/* full body */}
                <div style={{ justifySelf: "center", textAlign: "center" }}>
                  <div style={{ width: 200, height: 175, display: "grid", placeItems: "center", background: `linear-gradient(135deg, ${C.warm} 0%, ${C.bg} 50%, ${C.cool} 100%)`, borderRadius: 18, border: `1px solid ${C.line}` }}>
                    <svg viewBox="0 0 200 200" width="170" style={{ overflow: "visible" }}><Body id={`${o.key}-f`} /></svg>
                  </div>
                  <div style={{ marginTop: 7, fontSize: 11, color: C.soft, fontFamily: "var(--font-grotesk)" }}>full body · idle</div>
                </div>
                {/* text */}
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span style={{ fontFamily: "var(--font-grotesk)", fontSize: 13, fontWeight: 700, color: C.gLo, letterSpacing: "0.1em" }}>{o.n}</span>
                    <h2 style={{ margin: 0, fontFamily: "var(--font-instrument)", fontWeight: 400, fontSize: 27 }}>{o.name}</h2>
                  </div>
                  <p style={{ margin: "8px 0 0", fontSize: 14.5, lineHeight: 1.55, color: C.soft, maxWidth: 360 }}>{o.meaning}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 34, paddingTop: 20, borderTop: `1px solid ${C.line}`, color: C.soft, fontSize: 13.5 }}>
          Compare silhouette, emotional feel, and product fit. Tell me which one (or two) to take further — I’ll build full expressions/poses and push to Figma.
        </div>
      </div>
    </div>
  );
}
