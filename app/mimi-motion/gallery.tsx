"use client";

import Link from "next/link";
import { useState } from "react";

type Theme = "light" | "dark";

// One token set per theme. The dark values match the dark artwork's own surfaces
// (see public/mimi-motion-svg/README.md) so the mascots sit on the same ground.
const T = {
  light: {
    bg: "#FBFAFF",
    card: "#FFFFFF",
    stage: "linear-gradient(135deg, #FFF8F1 0%, #FBFAFF 45%, #F2F4FF 100%)",
    line: "#E6E7F5",
    ink: "#252A44",
    soft: "#7C7F95",
    shadow: "0 1px 2px rgba(37,42,68,.04), 0 26px 60px -48px rgba(37,42,68,.4)",
  },
  dark: {
    bg: "#141220",
    card: "#241F2E",
    stage: "#1A1822",
    line: "#352E42",
    ink: "#F3F0F7",
    soft: "#A09BA8",
    shadow: "0 1px 2px rgba(0,0,0,.3), 0 26px 60px -48px rgba(0,0,0,.75)",
  },
} as const;

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

const SECTIONS = [
  { id: "states", label: "States" },
  { id: "avatars", label: "Avatars" },
  { id: "admin", label: "Admin" },
];

const pad = (i: number) => String(i + 1).padStart(2, "0");

// Each theme has its own folder; nothing else about the path changes.
const motionDir = (t: Theme) => (t === "dark" ? "/mimi-motion-svg/dark" : "/mimi-motion-svg");
const adminDir = (t: Theme) => (t === "dark" ? "/mimi-admin/dark" : "/mimi-admin");

function Tile({
  src, label, caption, size, theme,
}: { src: string; label: string; caption?: string; size: number; theme: Theme }) {
  const c = T[theme];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: c.card,
        border: `1px solid ${c.line}`,
        borderRadius: 24,
        overflow: "hidden",
        boxShadow: c.shadow,
      }}
    >
      <div
        style={{
          height: 200,
          display: "grid",
          placeItems: "center",
          background: c.stage,
          borderBottom: `1px solid ${c.line}`,
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
            color: c.ink,
            textTransform: "capitalize",
          }}
        >
          {label}
        </h3>
        {caption ? (
          <p style={{ margin: "4px 0 0", fontSize: 13, lineHeight: 1.45, color: c.soft }}>{caption}</p>
        ) : null}
      </div>
    </div>
  );
}

function ThemeSwitch({ theme, onChange }: { theme: Theme; onChange: (t: Theme) => void }) {
  const c = T[theme];
  return (
    <div
      role="group"
      aria-label="Theme"
      style={{
        display: "inline-flex",
        gap: 2,
        padding: 3,
        borderRadius: 999,
        background: c.card,
        border: `1px solid ${c.line}`,
      }}
    >
      {(["light", "dark"] as Theme[]).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          aria-pressed={theme === t}
          style={{
            font: "inherit",
            fontSize: 13,
            fontWeight: 600,
            textTransform: "capitalize",
            cursor: "pointer",
            border: 0,
            borderRadius: 999,
            padding: "7px 16px",
            background: theme === t ? c.ink : "transparent",
            color: theme === t ? c.bg : c.soft,
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export default function Gallery({ fontClass }: { fontClass: string }) {
  const [theme, setTheme] = useState<Theme>("light");
  const c = T[theme];
  const md = motionDir(theme);
  const ad = adminDir(theme);

  const h2 = (id: string, text: string, top: number) => (
    <h2
      id={id}
      style={{
        fontFamily: "var(--font-instrument)",
        fontWeight: 400,
        fontSize: 28,
        color: c.ink,
        margin: `${top}px 0 18px`,
      }}
    >
      {text}
    </h2>
  );

  return (
    <div
      className={fontClass}
      style={{
        fontFamily: "var(--font-manrope)",
        minHeight: "100vh",
        background: c.bg,
        transition: "background .2s ease",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "56px 40px 90px" }}>
        <Link
          href="/"
          style={{ display: "inline-block", marginBottom: 26, color: c.soft, textDecoration: "none", fontSize: 14 }}
        >
          ← Back
        </Link>

        <header
          style={{
            marginBottom: 28,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontFamily: "var(--font-instrument)",
                fontWeight: 400,
                fontSize: 52,
                lineHeight: 1.04,
                letterSpacing: "-0.02em",
                color: c.ink,
              }}
            >
              Mimi in motion.
            </h1>
            <p style={{ margin: "10px 0 0", fontSize: 16, color: c.soft, maxWidth: 620 }}>
              Subtle, looping micro-animations for every state. Body motion, a twinkling glow,
              and a signature element per mood. Vector-crisp SVG, ready for the app.
            </p>
          </div>
          <ThemeSwitch theme={theme} onChange={setTheme} />
        </header>

        <nav style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40 }}>
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              style={{
                padding: "8px 16px",
                borderRadius: 999,
                border: `1px solid ${c.line}`,
                background: c.card,
                color: c.ink,
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              {s.label}
            </a>
          ))}
        </nav>

        {h2("states", "States", 0)}
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
              src={`${md}/states/${pad(i)}-${n}.svg`}
              label={n}
              caption={CAPTIONS[n]}
              size={150}
              theme={theme}
            />
          ))}
        </div>

        {h2("avatars", "Avatars", 44)}
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
              src={`${md}/avatars/${pad(i)}-${n}.svg`}
              label={n}
              size={120}
              theme={theme}
            />
          ))}
        </div>

        {h2("admin", "Admin", 56)}
        <p style={{ margin: "-10px 0 22px", fontSize: 14, color: c.soft }}>For the admin portal.</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
            gap: 22,
          }}
        >
          <Tile src={`${ad}/state.svg`} label="Admin" caption="“All checked. Looks good.”" size={150} theme={theme} />
          <Tile src={`${ad}/avatar.svg`} label="Avatar" size={120} theme={theme} />
        </div>
      </div>
    </div>
  );
}
