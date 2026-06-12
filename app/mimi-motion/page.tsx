import Link from "next/link";
import { Instrument_Serif, Manrope } from "next/font/google";

const instrument = Instrument_Serif({ weight: "400", subsets: ["latin"], variable: "--font-instrument" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

const C = {
  primary: "#6C73FF",
  ink: "#252A44",
  soft: "#7C7F95",
  bg: "#FBFAFF",
  cool: "#F2F4FF",
  warm: "#FFF8F1",
  line: "#E6E7F5",
};

// Ordered to match public/mimi-motion-svg (01..10)
const STATES = [
  "idle", "listening", "thinking", "concerned", "celebrating",
  "resting", "encouraging", "waiting", "reassurance", "typing",
] as const;

const CAPTIONS: Record<string, string> = {
  idle: "Gentle breathing float + soft sparkles",
  listening: "Leans in; its own sound-lines pulse",
  thinking: "Slow rise + a bobbing “?” thought",
  concerned: "Quiet sway + a tear rolls down",
  celebrating: "A soft hop + falling confetti",
  resting: "Slow deep float + drifting “z z z”",
  encouraging: "Upbeat bob + a “Wow!” pop",
  waiting: "Patient sway + ticking clock & dots",
  reassurance: "Warm float + a heartbeat",
  typing: "Focused nod + bouncing dots",
};

const pad = (i: number) => String(i + 1).padStart(2, "0");

function Tile({
  src, label, caption, size,
}: { src: string; label: string; caption?: string; size: number }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        border: `1px solid ${C.line}`,
        borderRadius: 24,
        overflow: "hidden",
        boxShadow: "0 1px 2px rgba(37,42,68,.04), 0 26px 60px -48px rgba(37,42,68,.4)",
      }}
    >
      <div
        style={{
          height: 200,
          display: "grid",
          placeItems: "center",
          background: `linear-gradient(135deg, ${C.warm} 0%, ${C.bg} 45%, ${C.cool} 100%)`,
          borderBottom: `1px solid ${C.line}`,
        }}
      >
        {/* animated SVG plays natively in <img> */}
        <img src={src} alt={`Mimi — ${label}`} width={size} height={size} loading="eager" decoding="async" />
      </div>
      <div style={{ padding: "16px 18px 18px" }}>
        <h3
          style={{
            margin: 0,
            fontFamily: "var(--font-instrument)",
            fontWeight: 400,
            fontSize: 24,
            letterSpacing: "-0.01em",
            color: C.ink,
            textTransform: "capitalize",
          }}
        >
          {label}
        </h3>
        {caption ? (
          <p style={{ margin: "4px 0 0", fontSize: 13, lineHeight: 1.45, color: C.soft }}>{caption}</p>
        ) : null}
      </div>
    </div>
  );
}

export default function MimiMotion() {
  return (
    <div
      className={`${instrument.variable} ${manrope.variable}`}
      style={{ fontFamily: "var(--font-manrope)", minHeight: "100vh", background: C.bg }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "56px 40px 90px" }}>
        <Link
          href="/"
          style={{ display: "inline-block", marginBottom: 26, color: C.soft, textDecoration: "none", fontSize: 14 }}
        >
          ← Back
        </Link>

        <header style={{ marginBottom: 40 }}>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--font-instrument)",
              fontWeight: 400,
              fontSize: 52,
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
              color: C.ink,
            }}
          >
            Mimi in motion.
          </h1>
          <p style={{ margin: "10px 0 0", fontSize: 16, color: C.soft, maxWidth: 620 }}>
            Subtle, looping micro-animations for every state — body motion, a twinkling glow,
            and a signature element per mood. Vector-crisp SVG, ready for the app.
          </p>
        </header>

        <h2 style={{ fontFamily: "var(--font-instrument)", fontWeight: 400, fontSize: 28, color: C.ink, margin: "0 0 18px" }}>
          States
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
            gap: 22,
          }}
        >
          {STATES.map((n, i) => (
            <Tile
              key={`s-${n}`}
              src={`/mimi-motion-svg/states/${pad(i)}-${n}.svg`}
              label={n}
              caption={CAPTIONS[n]}
              size={150}
            />
          ))}
        </div>

        <h2 style={{ fontFamily: "var(--font-instrument)", fontWeight: 400, fontSize: 28, color: C.ink, margin: "44px 0 18px" }}>
          Avatars
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 170px), 1fr))",
            gap: 22,
          }}
        >
          {STATES.map((n, i) => (
            <Tile
              key={`a-${n}`}
              src={`/mimi-motion-svg/avatars/${pad(i)}-${n}.svg`}
              label={n}
              size={120}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
