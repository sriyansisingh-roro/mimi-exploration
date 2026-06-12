"use client";

import { Instrument_Serif, Manrope, Space_Grotesk } from "next/font/google";
import MimiCreature, { STATES } from "@/components/mimi/creature/MimiCreature";
import MimiCreatureDetailed from "@/components/mimi/creature/MimiCreatureDetailed";
import MimiCreatureRefined from "@/components/mimi/creature/MimiCreatureRefined";

const instrument = Instrument_Serif({ weight: "400", subsets: ["latin"], variable: "--font-instrument" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });

const C = { ink: "#2E2842", soft: "#7C7F95", line: "#E7E6F2", bg: "#FBFAFF", cool: "#F2F1FC", warm: "#FFF6EC", green: "#74BE78" };
const STATES6 = ["idle", "listening", "thinking", "concerned", "celebrating", "resting"] as const;

export default function Page() {
  return (
    <div className={`${instrument.variable} ${manrope.variable} ${grotesk.variable}`} style={{ fontFamily: "var(--font-manrope)", minHeight: "100vh", background: C.bg, color: C.ink }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "56px 40px 96px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 13px", borderRadius: 999, background: C.cool, border: `1px solid ${C.line}`, fontFamily: "var(--font-grotesk)", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: "#6C73FF" }}>
          <span style={{ width: 7, height: 7, borderRadius: 99, background: "#FFD79A" }} /> CREATURE · THREE VERSIONS
        </div>
        <h1 style={{ margin: "16px 0 4px", fontFamily: "var(--font-instrument)", fontWeight: 400, fontSize: 46, letterSpacing: "-0.02em" }}>Clean &amp; grown-up.</h1>
        <p style={{ margin: 0, color: C.soft, fontSize: 15, maxWidth: 680 }}>
          Same bob shape + warm light. <b>Refined</b> drops the kid cues (cheek blush, twin eye-sparkles, wide tongue-grin, chubby mittens) for a designed, mature face: almond eyes with a defined lid + one calm catchlight, a slim nose, and a small defined mouth with a real lower lip.
        </p>

        {/* hero triptych */}
        <div style={{ marginTop: 36, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}>
          {[["1 · Flat", <MimiCreature key="a" state="idle" size={250} />], ["2 · Detailed (kiddie)", <MimiCreatureDetailed key="b" state="idle" size={250} />], ["3 · Refined (mature)", <MimiCreatureRefined key="c" state="idle" size={250} />]].map(([label, node], i) => (
            <div key={i} style={{ background: "#fff", border: `1px solid ${i === 2 ? "#C9BDF1" : C.line}`, borderRadius: 22, padding: "26px 0 16px", textAlign: "center", boxShadow: i === 2 ? "0 1px 2px rgba(37,42,68,.04), 0 40px 90px -55px rgba(108,115,255,.4)" : "0 1px 2px rgba(37,42,68,.04)" }}>
              <div style={{ borderRadius: 16, background: `linear-gradient(135deg, ${C.warm}, ${C.bg} 50%, ${C.cool})`, margin: "0 18px", padding: "20px 0", display: "grid", placeItems: "center" }}>{node as React.ReactNode}</div>
              <div style={{ marginTop: 12, fontWeight: 700, fontSize: 14 }}>{label as string}</div>
            </div>
          ))}
        </div>

        {/* refined close-up */}
        <div style={{ marginTop: 40, display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontFamily: "var(--font-grotesk)", fontSize: 13, fontWeight: 600, color: C.green, letterSpacing: "0.12em" }}>01</span>
          <h2 style={{ margin: 0, fontFamily: "var(--font-instrument)", fontWeight: 400, fontSize: 28 }}>Refined — face close-up</h2>
        </div>
        <div style={{ marginTop: 18, background: "#fff", border: `1px solid ${C.line}`, borderRadius: 20, padding: 30, display: "grid", placeItems: "center" }}>
          <MimiCreatureRefined state="idle" size={420} />
        </div>

        {/* refined across states */}
        <div style={{ marginTop: 40, display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontFamily: "var(--font-grotesk)", fontSize: 13, fontWeight: 600, color: C.green, letterSpacing: "0.12em" }}>02</span>
          <h2 style={{ margin: 0, fontFamily: "var(--font-instrument)", fontWeight: 400, fontSize: 28 }}>Refined — across states &amp; avatar</h2>
        </div>
        <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14 }}>
          {STATES6.map((s) => (
            <div key={s} style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 18, padding: "14px 8px", textAlign: "center" }}>
              <div style={{ borderRadius: 12, background: `linear-gradient(135deg, ${C.warm}, ${C.cool})`, display: "grid", placeItems: "center", padding: "8px 0", overflow: "hidden" }}>
                <MimiCreatureRefined state={s} size={110} />
              </div>
              <div style={{ marginTop: 10, fontWeight: 700, fontSize: 13 }}>{STATES[s].label}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14 }}>
          {STATES6.map((s) => (
            <div key={s} style={{ display: "grid", placeItems: "center", padding: "6px 0" }}>
              <MimiCreatureRefined state={s} size={96} avatar />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
