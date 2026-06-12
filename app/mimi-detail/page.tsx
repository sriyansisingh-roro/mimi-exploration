"use client";

import { Instrument_Serif, Manrope, Space_Grotesk } from "next/font/google";
import MimiCreature, { STATE_ORDER, STATES } from "@/components/mimi/creature/MimiCreature";
import MimiCreatureDetailed from "@/components/mimi/creature/MimiCreatureDetailed";

const instrument = Instrument_Serif({ weight: "400", subsets: ["latin"], variable: "--font-instrument" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });

const C = { ink: "#2E2842", soft: "#7C7F95", line: "#E7E6F2", bg: "#FBFAFF", cool: "#F2F1FC", warm: "#FFF6EC", green: "#74BE78" };
const STATES4 = ["idle", "listening", "thinking", "celebrating", "resting", "encouraging"] as const;

export default function Page() {
  return (
    <div className={`${instrument.variable} ${manrope.variable} ${grotesk.variable}`} style={{ fontFamily: "var(--font-manrope)", minHeight: "100vh", background: C.bg, color: C.ink }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "56px 40px 96px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 13px", borderRadius: 999, background: C.cool, border: `1px solid ${C.line}`, fontFamily: "var(--font-grotesk)", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: "#6C73FF" }}>
          <span style={{ width: 7, height: 7, borderRadius: 99, background: "#FFD79A" }} /> CREATURE · DETAILED vs FLAT
        </div>
        <h1 style={{ margin: "16px 0 4px", fontFamily: "var(--font-instrument)", fontWeight: 400, fontSize: 46, letterSpacing: "-0.02em" }}>A little more depth.</h1>
        <p style={{ margin: 0, color: C.soft, fontSize: 15, maxWidth: 660 }}>
          Same bob silhouette + warm light. Added: dimensional eyes (gradient + twin catchlights + lid), a soft nose, a shaped mouth with a glossy lower lip &amp; tongue, mitten hands with a thumb, proper toed feet, and top rim-light + bottom occlusion so she reads round, not flat.
        </p>

        {/* hero compare */}
        <div style={{ marginTop: 36, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {[["Current — clean / flat", <MimiCreature key="a" state="idle" size={300} />], ["Detailed — more dimension", <MimiCreatureDetailed key="b" state="idle" size={300} />]].map(([label, node], i) => (
            <div key={i} style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 24, padding: "30px 0 18px", textAlign: "center", boxShadow: "0 1px 2px rgba(37,42,68,.04), 0 40px 90px -55px rgba(37,42,68,.28)" }}>
              <div style={{ borderRadius: 18, background: `linear-gradient(135deg, ${C.warm}, ${C.bg} 50%, ${C.cool})`, margin: "0 24px", padding: "26px 0", display: "grid", placeItems: "center" }}>{node as React.ReactNode}</div>
              <div style={{ marginTop: 14, fontWeight: 700, fontSize: 15 }}>{label as string}</div>
            </div>
          ))}
        </div>

        {/* detailed across states */}
        <div style={{ marginTop: 40, display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontFamily: "var(--font-grotesk)", fontSize: 13, fontWeight: 600, color: C.green, letterSpacing: "0.12em" }}>01</span>
          <h2 style={{ margin: 0, fontFamily: "var(--font-instrument)", fontWeight: 400, fontSize: 28 }}>Detailed — across states</h2>
        </div>
        <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14 }}>
          {STATES4.map((s) => (
            <div key={s} style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 18, padding: "14px 8px 14px", textAlign: "center" }}>
              <div style={{ borderRadius: 12, background: `linear-gradient(135deg, ${C.warm}, ${C.cool})`, display: "grid", placeItems: "center", padding: "8px 0", overflow: "hidden" }}>
                <MimiCreatureDetailed state={s} size={120} />
              </div>
              <div style={{ marginTop: 10, fontWeight: 700, fontSize: 13 }}>{STATES[s].label}</div>
            </div>
          ))}
        </div>

        {/* detail close-ups */}
        <div style={{ marginTop: 40, display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontFamily: "var(--font-grotesk)", fontSize: 13, fontWeight: 600, color: C.green, letterSpacing: "0.12em" }}>02</span>
          <h2 style={{ margin: 0, fontFamily: "var(--font-instrument)", fontWeight: 400, fontSize: 28 }}>Face close-up</h2>
        </div>
        <div style={{ marginTop: 18, background: "#fff", border: `1px solid ${C.line}`, borderRadius: 20, padding: 30, display: "grid", placeItems: "center" }}>
          <div style={{ transform: "scale(1)", display: "grid", placeItems: "center", overflow: "visible" }}>
            <MimiCreatureDetailed state="idle" size={420} />
          </div>
        </div>
      </div>
    </div>
  );
}
