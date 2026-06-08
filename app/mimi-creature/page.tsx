"use client";

import { useState } from "react";
import { Instrument_Serif, Manrope, Space_Grotesk } from "next/font/google";
import MimiCreature, { STATES, STATE_ORDER } from "@/components/mimi/creature/MimiCreature";
import type { MimiGlowState } from "@/components/mimi/glow/types";

const instrument = Instrument_Serif({ weight: "400", subsets: ["latin"], variable: "--font-instrument" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });

const C = {
  ink: "#2E2842", soft: "#7C7F95", line: "#E7E6F2", primary: "#6C73FF",
  bg: "#FBFAFF", cool: "#F2F1FC", warm: "#FFF6EC", green: "#74BE78",
};

export default function MimiCreaturePage() {
  const [state, setState] = useState<MimiGlowState>("idle");
  const cfg = STATES[state];
  return (
    <div className={`${instrument.variable} ${manrope.variable} ${grotesk.variable}`} style={{ fontFamily: "var(--font-manrope)", minHeight: "100vh", background: C.bg, color: C.ink }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "60px 40px 96px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 13px", borderRadius: 999, background: C.cool, border: `1px solid ${C.line}`, fontFamily: "var(--font-grotesk)", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: C.primary }}>
          <span style={{ width: 7, height: 7, borderRadius: 99, background: "#FFD79A" }} /> MIMI · CREATURE + GLOW · REVIEW
        </div>
        <h1 style={{ margin: "18px 0 4px", fontFamily: "var(--font-instrument)", fontWeight: 400, fontSize: 48, letterSpacing: "-0.02em", lineHeight: 1.05 }}>
          Mimi, with a little more character.
        </h1>
        <p style={{ margin: 0, color: C.soft, fontSize: 15, maxWidth: 640 }}>
          Minimal-creature body + warm support light · defined eyes &amp; a small nose · a soft peach accent. Same 10 states, soft slow motion.
        </p>

        <div style={{ marginTop: 36, display: "grid", gridTemplateColumns: "1fr 360px", gap: 44, alignItems: "center", background: "#fff", border: `1px solid ${C.line}`, borderRadius: 28, padding: "44px 48px", boxShadow: "0 1px 2px rgba(37,42,68,.04), 0 40px 90px -55px rgba(37,42,68,.28)" }}>
          <div style={{ position: "relative", minHeight: 360, borderRadius: 22, border: `1px solid ${C.line}`, background: `linear-gradient(135deg, ${C.warm}, ${C.bg} 50%, ${C.cool})`, display: "grid", placeItems: "center", overflow: "hidden" }}>
            <div style={{ textAlign: "center" }}>
              <MimiCreature state={state} size={290} />
              <div style={{ marginTop: 8, fontFamily: "var(--font-instrument)", fontStyle: "italic", fontSize: 21, color: C.primary }}>“{cfg.feel}”</div>
            </div>
          </div>
          <div>
            <h2 style={{ margin: "0 0 4px", fontFamily: "var(--font-instrument)", fontWeight: 400, fontSize: 30 }}>{cfg.label}</h2>
            <p style={{ margin: "0 0 18px", fontSize: 14, lineHeight: 1.55, color: C.soft }}>Tap a state. Motion is soft and slow — reduced-motion safe.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {STATE_ORDER.map((s) => {
                const active = s === state;
                return (
                  <button key={s} onClick={() => setState(s)} style={{ padding: "8px 14px", borderRadius: 999, cursor: "pointer", border: `1.5px solid ${active ? C.primary : C.line}`, background: active ? C.primary : "#fff", color: active ? "#fff" : C.soft, fontFamily: "var(--font-manrope)", fontWeight: 600, fontSize: 13, transition: "all .15s" }}>
                    {STATES[s].label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 28, display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontFamily: "var(--font-grotesk)", fontSize: 13, fontWeight: 600, color: C.green, letterSpacing: "0.12em" }}>01</span>
          <h2 style={{ margin: 0, fontFamily: "var(--font-instrument)", fontWeight: 400, fontSize: 30 }}>All ten states</h2>
        </div>
        <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
          {STATE_ORDER.map((s) => (
            <div key={s} style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 20, padding: "16px 14px 18px", textAlign: "center" }}>
              <div style={{ borderRadius: 14, background: `linear-gradient(135deg, ${C.warm}, ${C.cool})`, display: "grid", placeItems: "center", padding: "10px 0", overflow: "hidden" }}>
                <MimiCreature state={s} size={120} />
              </div>
              <div style={{ marginTop: 12, fontFamily: "var(--font-manrope)", fontWeight: 700, fontSize: 14 }}>{STATES[s].label}</div>
              <div style={{ marginTop: 4, fontSize: 11.5, lineHeight: 1.4, color: C.soft }}>“{STATES[s].feel}”</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 36, paddingTop: 20, borderTop: `1px solid ${C.line}`, color: C.soft, fontSize: 13.5 }}>
          Review variant — not added anywhere yet. Tell me if this is the direction and I’ll wire it in / push to Figma.
        </div>
      </div>
    </div>
  );
}
