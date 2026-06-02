"use client";

/**
 * Mimi (Sprout) — full character study: playground (mood), expression sheet,
 * the three views (turnaround), full-body poses, scale strip, build notes.
 * Ported from the Mimi Sprout.html prototype.
 */

import { useState } from "react";
import { Instrument_Serif, Manrope, Space_Grotesk } from "next/font/google";
import MimiSprout, { MOODS, MOOD_ORDER } from "@/components/mimi/sprout/MimiSprout";
import type { MimiMood } from "@/components/mimi/sprout/types";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-manrope" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument" });
const grotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-grotesk" });

const SERIF = "var(--font-instrument)";
const SANS = "var(--font-manrope)";
const MONO = "var(--font-grotesk)";

const SP = {
  primary: "#6C73FF",
  accent: "#FF9A8B",
  ink: "#252A44",
  soft: "#7C7F95",
  bg: "#FBFAFF",
  cool: "#F2F4FF",
  warm: "#FFF8F1",
  line: "#E6E7F5",
  leaf: "#69BD6E",
  white: "#fff",
};

function Chip({
  active,
  children,
  onClick,
  small,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  small?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: small ? "7px 13px" : "9px 16px",
        borderRadius: 999,
        cursor: "pointer",
        border: `1.5px solid ${active ? SP.primary : SP.line}`,
        background: active ? SP.primary : "#fff",
        color: active ? "#fff" : SP.soft,
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: small ? 13 : 14,
        boxShadow: active ? "0 8px 20px -10px rgba(108,115,255,.6)" : "none",
        transition: "all .15s",
      }}
    >
      {children}
    </button>
  );
}

function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
      <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: SP.leaf, letterSpacing: "0.12em" }}>{n}</span>
      <h2 style={{ margin: 0, fontFamily: SERIF, fontWeight: 400, fontSize: 34, color: SP.ink, letterSpacing: "-0.01em", lineHeight: 1.1 }}>
        {children}
      </h2>
    </div>
  );
}

function Playground() {
  const [mood, setMood] = useState<MimiMood>("happy");
  const cfg = MOODS[mood];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 372px",
        gap: 48,
        alignItems: "center",
        background: "#fff",
        border: `1px solid ${SP.line}`,
        borderRadius: 32,
        padding: "48px 52px",
        boxShadow: "0 1px 2px rgba(37,42,68,.04), 0 40px 90px -50px rgba(37,42,68,.30)",
      }}
    >
      <div
        style={{
          position: "relative",
          borderRadius: 24,
          minHeight: 460,
          background: `linear-gradient(135deg, ${SP.warm} 0%, ${SP.bg} 45%, ${SP.cool} 100%)`,
          border: `1px solid ${SP.line}`,
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", textAlign: "center" }}>
          <MimiSprout mood={mood} view="front" size={290} />
          <div style={{ marginTop: 2, fontFamily: SERIF, fontStyle: "italic", fontSize: 22, color: SP.primary }}>{cfg.label}</div>
        </div>
      </div>
      <div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 13px",
            borderRadius: 999,
            background: SP.cool,
            border: `1px solid ${SP.line}`,
            fontSize: 12,
            fontWeight: 700,
            color: SP.primary,
            letterSpacing: "0.06em",
          }}
        >
          <span style={{ width: 7, height: 7, background: SP.leaf, borderRadius: 99 }} /> MIMI · SPROUT
        </div>
        <h1 style={{ margin: "18px 0 0", fontFamily: SERIF, fontWeight: 400, fontSize: 49, lineHeight: 1.02, letterSpacing: "-0.02em", color: SP.ink }}>
          We begin
          <br />
          small, and grow.
        </h1>
        <p style={{ margin: "16px 0 24px", fontSize: 15, lineHeight: 1.6, color: SP.soft }}>
          A calm companion with ten expressions. Tap a mood to see her respond.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
          {MOOD_ORDER.map((m) => (
            <Chip key={m} active={mood === m} onClick={() => setMood(m)}>
              {MOODS[m].label}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExpressionCard({ mood }: { mood: MimiMood }) {
  const cfg = MOODS[mood];
  return (
    <div style={{ background: "#fff", border: `1px solid ${SP.line}`, borderRadius: 22, padding: "14px 16px 18px", textAlign: "center", boxShadow: "0 1px 2px rgba(37,42,68,.04)" }}>
      <div style={{ borderRadius: 16, background: `linear-gradient(135deg, ${SP.warm}, ${SP.cool})`, border: `1px solid ${SP.line}`, display: "grid", placeItems: "center", padding: "8px 0", overflow: "hidden" }}>
        <MimiSprout mood={mood} view="front" size={148} />
      </div>
      <div style={{ marginTop: 12, fontFamily: SANS, fontWeight: 700, fontSize: 15, color: SP.ink }}>{cfg.label}</div>
    </div>
  );
}

function ExpressionSheet() {
  return (
    <div>
      <SectionLabel n="01">Ten expressions</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginTop: 22 }}>
        {MOOD_ORDER.map((m) => (
          <ExpressionCard key={m} mood={m} />
        ))}
      </div>
    </div>
  );
}

function Poses() {
  const poses: [MimiMood, string][] = [
    ["listening", "Reaching out"],
    ["encouraging", "Cheering"],
    ["thinking", "Hand to chin"],
    ["celebrating", "Big hooray"],
    ["loving", "Open arms"],
    ["sleepy", "Leaning to rest"],
  ];
  return (
    <div>
      <SectionLabel n="02">Full-body poses</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 14, background: "#fff", border: `1px solid ${SP.line}`, borderRadius: 22, padding: "26px 22px", marginTop: 22 }}>
        {poses.map(([m, t]) => (
          <div key={m} style={{ textAlign: "center" }}>
            <div style={{ display: "grid", placeItems: "center", height: 120 }}>
              <MimiSprout mood={m} view="front" size={120} />
            </div>
            <div style={{ marginTop: 8, fontFamily: SANS, fontWeight: 700, fontSize: 13, color: SP.ink }}>{t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScaleStrip() {
  return (
    <div>
      <SectionLabel n="03">From avatar to hero</SectionLabel>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 40, flexWrap: "wrap", background: "#fff", border: `1px solid ${SP.line}`, borderRadius: 22, padding: "34px 40px", marginTop: 14 }}>
        {[44, 64, 96, 144, 200].map((s) => (
          <div key={s} style={{ textAlign: "center" }}>
            <MimiSprout mood="happy" view="front" size={s} showAcc={false} />
            <div style={{ marginTop: 8, fontFamily: MONO, fontSize: 12, color: SP.soft }}>{s}px</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Anatomy() {
  const swatches: [string, string][] = [
    ["Body", "radial-gradient(circle at 35% 28%,#E2DDFB,#A89AE6)"],
    ["Form shade", "#5E4E97"],
    ["Sprout", "linear-gradient(180deg,#A9E6A0,#69BD6E)"],
    ["Eyes / ink", "#3A3357"],
    ["Cheeks", "#F3A8C4"],
    ["Brand", "#6C73FF"],
  ];
  const notes: [string, string][] = [
    ["Ported, not redrawn", "Same body path, sprout, arm and eye geometry as the sprout branch — rebuilt in plain SVG + CSS so it runs anywhere with no framework."],
    ["Six → ten moods", "Added happy, empathetic, worried and caring to the original idle / listening / thinking / celebrating / resting / concerned set."],
    ["Poses, not just faces", "Arms pivot from the shoulders and the sprout from its base, so every mood is a grounded full-body gesture with secondary motion."],
    ["Calm by default", "Idle breathing and blinking, with one small gesture per mood — gentle, never a distracting loop, and reduced-motion safe."],
  ];
  return (
    <div>
      <SectionLabel n="04">How she’s built</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 40, alignItems: "start", marginTop: 14 }}>
        <div style={{ background: "#fff", border: `1px solid ${SP.line}`, borderRadius: 22, padding: 24 }}>
          <div style={{ display: "grid", placeItems: "center", marginBottom: 18 }}>
            <MimiSprout mood="calm" view="front" size={180} showAcc={false} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {swatches.map(([name, c]) => (
              <div key={name} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <span style={{ width: 22, height: 22, borderRadius: 7, background: c, border: "1px solid rgba(0,0,0,.08)", flexShrink: 0 }} />
                <span style={{ fontSize: 12.5, color: SP.soft, fontWeight: 500 }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {notes.map(([t, b]) => (
            <div key={t} style={{ background: "#fff", border: `1px solid ${SP.line}`, borderRadius: 18, padding: "20px 22px" }}>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 15, color: SP.ink, marginBottom: 6 }}>{t}</div>
              <div style={{ fontSize: 13, lineHeight: 1.55, color: SP.soft }}>{b}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MimiSproutPage() {
  return (
    <div
      className={`${manrope.variable} ${instrument.variable} ${grotesk.variable}`}
      style={{ background: SP.bg, color: SP.ink, fontFamily: SANS, minHeight: "100dvh" }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "56px 40px 90px" }}>
        <Playground />
        <div style={{ height: 80 }} />
        <ExpressionSheet />
        <div style={{ height: 72 }} />
        <Poses />
        <div style={{ height: 72 }} />
        <ScaleStrip />
        <div style={{ height: 72 }} />
        <Anatomy />
        <div style={{ marginTop: 64, paddingTop: 24, borderTop: `1px solid ${SP.line}`, display: "flex", alignItems: "center", gap: 10, color: SP.soft, fontSize: 13 }}>
          <MimiSprout mood="loving" view="front" size={34} idle={false} showAcc={false} />
          <span>
            Mimi (Sprout) — companion character for{" "}
            <b style={{ color: SP.primary }}>
              wewa<span style={{ color: SP.leaf }}>.</span>life
            </b>
          </span>
        </div>
      </div>
    </div>
  );
}
