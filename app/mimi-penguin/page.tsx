"use client";

// Mimi character study (penguin) — hero, live playground, full expression
// sheet, scale strip, anatomy. Ported from the Wewa.life design handoff
// "Mimi Character.html".

import { useState } from "react";
import { Instrument_Serif, Manrope, Space_Grotesk } from "next/font/google";
import MimiPenguin, {
  MOOD_CFG,
  MOOD_ORDER,
} from "@/components/mimi/penguin/MimiPenguin";
import type { MimiMood } from "@/components/mimi/penguin/types";

const serif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const FF_SERIF = "var(--font-serif)";
const FF_MANROPE = "var(--font-manrope)";
const FF_GROTESK = "var(--font-grotesk)";

const PURPLE = "#7E6BC9",
  INK = "#2E2838",
  INK_SOFT = "#7C7690";
const CREAM = "#F3F1FA",
  LINE = "#E9E5F4",
  TEAL = "#00B7CA";

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "9px 16px",
        borderRadius: 999,
        cursor: "pointer",
        border: `1.5px solid ${active ? PURPLE : LINE}`,
        background: active ? PURPLE : "#fff",
        color: active ? "#fff" : INK_SOFT,
        fontFamily: FF_MANROPE,
        fontWeight: 600,
        fontSize: 14,
        boxShadow: active ? "0 8px 20px -10px rgba(110,44,144,.6)" : "none",
        transition: "all .15s",
      }}
    >
      {children}
    </button>
  );
}

function SectionLabel({
  n,
  children,
}: {
  n: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
      <span style={{ fontFamily: FF_GROTESK, fontSize: 13, fontWeight: 600, color: TEAL, letterSpacing: "0.12em" }}>
        {n}
      </span>
      <h2 style={{ margin: 0, fontFamily: FF_SERIF, fontWeight: 400, fontSize: 34, color: INK, letterSpacing: "-0.01em" }}>
        {children}
      </h2>
    </div>
  );
}

// ---- Hero + live playground ----
function Playground() {
  const [mood, setMood] = useState<MimiMood>("happy");
  const cfg = MOOD_CFG[mood];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 360px",
        gap: 48,
        alignItems: "center",
        background: "#fff",
        border: `1px solid ${LINE}`,
        borderRadius: 32,
        padding: "52px 56px",
        boxShadow: "0 1px 2px rgba(38,32,58,.04), 0 40px 90px -50px rgba(38,32,58,.28)",
      }}
    >
      {/* stage */}
      <div
        style={{
          position: "relative",
          borderRadius: 24,
          minHeight: 420,
          background: `radial-gradient(120% 100% at 50% 18%, #FFFFFF 0%, ${CREAM} 80%)`,
          border: `1px solid ${LINE}`,
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", textAlign: "center" }}>
          <MimiPenguin mood={mood} size={300} />
          <div style={{ marginTop: 18, fontFamily: FF_SERIF, fontStyle: "italic", fontSize: 22, color: PURPLE }}>
            {cfg.label}
          </div>
          <div style={{ marginTop: 4, fontSize: 13.5, color: INK_SOFT, maxWidth: 280, marginLeft: "auto", marginRight: "auto", lineHeight: 1.5 }}>
            {cfg.blurb}
          </div>
        </div>
      </div>
      {/* controls */}
      <div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 13px",
            borderRadius: 999,
            background: CREAM,
            border: `1px solid ${LINE}`,
            fontSize: 12,
            fontWeight: 700,
            color: PURPLE,
            letterSpacing: "0.06em",
          }}
        >
          <span style={{ width: 7, height: 7, background: TEAL, borderRadius: 99 }} /> MEET MIMI
        </div>
        <h1 style={{ margin: "18px 0 0", fontFamily: FF_SERIF, fontWeight: 400, fontSize: 50, lineHeight: 1.02, letterSpacing: "-0.02em", color: INK }}>
          Your campus
          <br />
          companion.
        </h1>
        <p style={{ margin: "16px 0 24px", fontSize: 15, lineHeight: 1.6, color: INK_SOFT }}>
          Mimi is a calm, non-judgmental friend who helps students through academic stress, big feelings, and everyday campus life. Tap a mood to see her respond.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
          {MOOD_ORDER.map((m) => (
            <Chip key={m} active={mood === m} onClick={() => setMood(m)}>
              {MOOD_CFG[m].label}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Expression sheet ----
function ExpressionCard({ mood }: { mood: MimiMood }) {
  const cfg = MOOD_CFG[mood];
  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${LINE}`,
        borderRadius: 22,
        padding: "20px 18px 22px",
        textAlign: "center",
        boxShadow: "0 1px 2px rgba(38,32,58,.04)",
      }}
    >
      <div
        style={{
          borderRadius: 16,
          background: `radial-gradient(110% 100% at 50% 14%, #FFFFFF, ${CREAM})`,
          border: `1px solid ${LINE}`,
          display: "grid",
          placeItems: "center",
          padding: "14px 0 8px",
        }}
      >
        <MimiPenguin mood={mood} size={150} />
      </div>
      <div style={{ marginTop: 14, fontFamily: FF_MANROPE, fontWeight: 700, fontSize: 15, color: INK }}>
        {cfg.label}
      </div>
      <div style={{ marginTop: 3, fontSize: 12.5, lineHeight: 1.45, color: INK_SOFT }}>{cfg.blurb}</div>
    </div>
  );
}

function ExpressionSheet() {
  return (
    <div>
      <SectionLabel n="01">Ten moods, one Mimi</SectionLabel>
      <p style={{ margin: "0 0 26px", fontSize: 14.5, color: INK_SOFT, maxWidth: 560, lineHeight: 1.55 }}>
        Her identity stays constant — same body, same lavender hood and cowlick — while eyes, brows, cheeks and a touch of motion carry the feeling. Each one is gently animated.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
        {MOOD_ORDER.map((m) => (
          <ExpressionCard key={m} mood={m} />
        ))}
      </div>
    </div>
  );
}

// ---- Scale strip ----
function ScaleStrip() {
  return (
    <div>
      <SectionLabel n="03">From avatar to hero</SectionLabel>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 40,
          flexWrap: "wrap",
          background: "#fff",
          border: `1px solid ${LINE}`,
          borderRadius: 22,
          padding: "34px 40px",
          marginTop: 14,
        }}
      >
        {[36, 56, 88, 140, 200].map((s) => (
          <div key={s} style={{ textAlign: "center" }}>
            <MimiPenguin mood="happy" size={s} />
            <div style={{ marginTop: 8, fontFamily: FF_GROTESK, fontSize: 12, color: INK_SOFT }}>{s}px</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MimiPenguinPage() {
  return (
    <div
      className={`${serif.variable} ${manrope.variable} ${grotesk.variable}`}
      style={{ background: CREAM, color: INK, fontFamily: FF_MANROPE, minHeight: "100vh" }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "56px 40px 90px" }}>
        <Playground />
        <div style={{ height: 80 }} />
        <ExpressionSheet />
        <div style={{ height: 72 }} />
        <ScaleStrip />
      </div>
    </div>
  );
}
