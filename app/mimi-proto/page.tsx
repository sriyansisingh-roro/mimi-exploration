"use client";

/**
 * Mimi — onboarding / app prototype (review build).
 * Recreates the Figma flow (Sign in → OTP → Welcome → Canvas intro →
 * Canvas form → Chat) with the finalized Mimi mascot placed where it adds
 * warmth, plus subtle professional micro-animations. Interactive: the screen
 * switcher (top) lets you jump anywhere; the in-screen CTAs advance the flow
 * and demonstrate focus / filled / error / loading states.
 */

import { useState, useRef, useEffect } from "react";
import { Instrument_Serif, Manrope, Space_Grotesk } from "next/font/google";
import MimiCreature from "@/components/mimi/creature/MimiCreature";
import type { MimiGlowState } from "@/components/mimi/glow/types";
import "./mimi-proto.css";

const instrument = Instrument_Serif({ weight: "400", subsets: ["latin"], variable: "--font-instrument" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });

const C = {
  primary: "#7A2E8E", primaryDk: "#691F7D",
  accentP: "#8E3CA8", accentT: "#2FAEBE", accentO: "#EF9B4C",
  ink: "#2B2735", body: "#6E6B7E", soft: "#9A97A8", line: "#ECE9F5",
  cream: "#FAF7F0", white: "#FFFFFF", fieldLine: "#E3DFEE", place: "#A7A4B5",
};

type Screen = "signin" | "otp" | "welcome" | "canvas-intro" | "canvas-form" | "chat";
const ORDER: Screen[] = ["signin", "otp", "welcome", "canvas-intro", "canvas-form", "chat"];
const LABELS: Record<Screen, string> = {
  signin: "Sign in", otp: "OTP", welcome: "Welcome", "canvas-intro": "Canvas intro", "canvas-form": "Canvas form", chat: "Chat",
};

/* ── brand mark ───────────────────────────────────────────────────────────── */
function Logo({ size = 30 }: { size?: number }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
        <path d="M6 7 C2.5 7 2 11 4.2 14 L11 22 L11 8.5 C11 7.6 9.2 7 6 7 Z" fill="#F2A24C" />
        <path d="M16 7 C12.5 7 12 11 14.2 14 L21 22 L21 8.5 C21 7.6 19.2 7 16 7 Z" fill="#36B6C4" transform="translate(-5 0)" />
        <path d="M19 7 C26 7 27 13 22 18 L16 24 L10 18 C6 14 6.5 7 13 7 C15.5 7 16 9 16 9 C16 9 16.5 7 19 7 Z" fill="#7A2E8E" />
      </svg>
      <span style={{ fontFamily: "var(--font-manrope)", fontWeight: 700, fontSize: 17, color: C.ink, letterSpacing: "-0.01em" }}>
        wewa<span style={{ color: C.primary }}>.life</span>
      </span>
    </div>
  );
}

/* ── soft floating decorations for the auth panel ─────────────────────────── */
function Blob({ s, color, x, y, cls }: { s: number; color: string; x: number; y: number; cls: string }) {
  return (
    <div className={`blob ${cls}`} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: color, filter: "blur(2px)", opacity: 0.92 }} />
  );
}
function Dots({ x, y }: { x: number; y: number }) {
  return (
    <svg style={{ position: "absolute", left: x, top: y }} width="70" height="70" aria-hidden>
      {Array.from({ length: 5 }).map((_, r) => Array.from({ length: 5 }).map((_, c) => (
        <circle key={`${r}-${c}`} cx={4 + c * 15} cy={4 + r * 15} r="2.2" fill="#C9BEE6" opacity="0.55" />
      )))}
    </svg>
  );
}

/* ── reusable: the auth left panel (gradient + blobs + mascot + headline) ─── */
function AuthLeft({ mascot, kicker, head, accent, accentColor, sub }: {
  mascot: MimiGlowState; kicker?: React.ReactNode; head: React.ReactNode; accent: string; accentColor: string; sub: string;
}) {
  return (
    <div style={{ position: "relative", width: "48%", overflow: "hidden", background: "linear-gradient(155deg, #EFE7FB 0%, #F4EEFB 42%, #FBF6EF 100%)", display: "flex", flexDirection: "column" }}>
      <Blob s={120} color="linear-gradient(135deg,#F8B26A,#F0934E)" x={-30} y={420} cls="blob-a" />
      <Blob s={86} color="linear-gradient(135deg,#8AD5DC,#67C6CF)" x={40} y={470} cls="blob-b" />
      <Blob s={70} color="linear-gradient(135deg,#F8B98A,#F2A24C)" x={300} y={-18} cls="blob-c" />
      <Blob s={150} color="linear-gradient(135deg,#C9A2EC,#A472DC)" x={250} y={470} cls="blob-a" />
      <Dots x={300} y={150} />
      <Dots x={20} y={300} />
      <div style={{ position: "absolute", top: 26, left: 30 }}><Logo /></div>

      <div style={{ margin: "auto", padding: "0 56px", textAlign: "center", position: "relative", zIndex: 2 }}>
        <div className="rev-scale mascot-float" style={{ display: "inline-block", animationDelay: "0.05s" }}>
          <MimiCreature state={mascot} size={118} avatar />
        </div>
        {kicker}
        <h1 className="rev" style={{ margin: "20px 0 0", fontFamily: "var(--font-instrument)", fontWeight: 400, fontSize: 38, lineHeight: 1.12, color: C.ink, letterSpacing: "-0.01em", animationDelay: "0.12s" }}>
          {head} <span style={{ fontStyle: "italic", color: accentColor }}>{accent}</span>
        </h1>
        <p className="rev" style={{ margin: "16px auto 0", maxWidth: 340, fontFamily: "var(--font-manrope)", fontSize: 14.5, lineHeight: 1.5, color: C.body, animationDelay: "0.2s" }}>{sub}</p>
        <div className="rev" style={{ marginTop: 22, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", animationDelay: "0.28s" }}>
          {[["ACADEMIC", C.accentO], ["EMOTIONAL", C.accentP], ["SOCIAL", C.accentT]].map(([t, col]) => (
            <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 13px", borderRadius: 999, background: "#fff", border: `1px solid ${C.line}`, fontFamily: "var(--font-grotesk)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: C.body }}>
              <span className="chip-dot" style={{ width: 6, height: 6, borderRadius: 99, background: col as string }} />{t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() { return <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.6 9.2c0-.6-.1-1.2-.2-1.8H9v3.4h4.8a4.1 4.1 0 0 1-1.8 2.7v2.2h2.9c1.7-1.6 2.7-3.9 2.7-6.5z"/><path fill="#34A853" d="M9 18c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.5-1.8.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H.9v2.3A9 9 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.9 10.7a5.4 5.4 0 0 1 0-3.4V5H.9a9 9 0 0 0 0 8l3-2.3z"/><path fill="#EA4335" d="M9 3.6c1.3 0 2.5.5 3.4 1.3l2.6-2.6A9 9 0 0 0 .9 5l3 2.3C4.6 5.2 6.6 3.6 9 3.6z"/></svg>; }
function OutlookIcon() { return <svg width="18" height="18" viewBox="0 0 18 18"><rect x="7" y="3" width="10" height="12" rx="1.2" fill="#0F6CBD"/><rect x="8" y="5" width="8" height="2" fill="#fff" opacity="0.85"/><rect x="8" y="8" width="8" height="2" fill="#fff" opacity="0.6"/><ellipse cx="5" cy="9" rx="5" ry="5.5" fill="#0A5BA8"/><ellipse cx="5" cy="9" rx="2.4" ry="2.9" fill="#fff"/></svg>; }

/* ════════════════════════════════════════════════════════════════════════ */
/*  SCREEN 1 — Sign in (default / focused / filled / error / loading)         */
/* ════════════════════════════════════════════════════════════════════════ */
function SignIn({ go }: { go: (s: Screen) => void }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = () => {
    if (loading) return;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setError("Please enter a valid institute email"); return; }
    setError(""); setLoading(true);
    setTimeout(() => { setLoading(false); go("otp"); }, 1400);
  };
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <AuthLeft mascot="idle" head={<>Hi, I’m <span style={{ fontStyle: "italic", color: C.accentP }}>Mimi.</span><br />Your campus</>} accent="companion." accentColor={C.accentT}
        sub="Three ways I can help — across academic life, emotional wellbeing, and social connection." />
      <div style={{ width: "52%", background: C.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 380 }}>
          <h2 className="rev" style={{ margin: 0, fontFamily: "var(--font-instrument)", fontWeight: 400, fontSize: 34, color: C.ink, animationDelay: "0.05s" }}>Start your Mimi journey</h2>
          <p className="rev" style={{ margin: "8px 0 26px", fontSize: 14, color: C.body, animationDelay: "0.12s" }}>Sign in with your university account, or use your institute email.</p>
          <button className="btn rev" style={{ ...oauthBtn, animationDelay: "0.18s" }}><GoogleIcon /> Continue with Google</button>
          <button className="btn rev" style={{ ...oauthBtn, marginTop: 12, animationDelay: "0.24s" }}><OutlookIcon /> Continue with Outlook</button>
          <div className="rev" style={{ display: "flex", alignItems: "center", gap: 14, margin: "22px 0", animationDelay: "0.3s" }}>
            <div style={{ flex: 1, height: 1, background: C.line }} /><span style={{ fontSize: 13, color: C.soft }}>or</span><div style={{ flex: 1, height: 1, background: C.line }} />
          </div>
          <label className="rev" style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 8, animationDelay: "0.34s" }}>University email</label>
          <div className={`field rev ${error ? "field-error" : ""}`} style={{ display: "flex", alignItems: "center", padding: "0 14px", height: 52, borderRadius: 12, border: `1.5px solid ${C.fieldLine}`, background: "#fff", animationDelay: "0.34s" }}>
            <input value={email} onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="name@university.edu" disabled={loading}
              style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 15, color: C.ink, fontFamily: "var(--font-manrope)" }} />
          </div>
          {error && <div style={{ marginTop: 8, fontSize: 13, color: "#D24A6E", fontWeight: 500 }}>{error}</div>}
          <button onClick={submit} disabled={loading} className="btn btn-primary rev" style={{ ...primaryBtn, marginTop: 18, animationDelay: "0.4s", opacity: loading ? 0.92 : 1 }}>
            {loading ? <><span className="spin" style={spinner} /> Sending OTP</> : "Send OTP"}
          </button>
          <p className="rev" style={{ marginTop: 18, fontSize: 12.5, color: C.soft, animationDelay: "0.46s" }}>
            By continuing, you agree to Mimi’s <span style={{ color: C.primary, fontWeight: 600 }}>Terms</span> and <span style={{ color: C.primary, fontWeight: 600 }}>Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */
/*  SCREEN 2 — OTP                                                             */
/* ════════════════════════════════════════════════════════════════════════ */
function Otp({ go }: { go: (s: Screen) => void }) {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const set = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...digits]; next[i] = v; setDigits(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };
  const filled = digits.every((d) => d);
  const verify = () => { if (!filled || loading) return; setLoading(true); setTimeout(() => { setLoading(false); go("welcome"); }, 1300); };
  useEffect(() => { refs.current[0]?.focus(); }, []);
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <AuthLeft mascot="waiting" head={<>Almost in.<br />Just checking it’s</>} accent="you." accentColor={C.accentT}
        sub="We use your institute email to keep your support space private and verified." />
      <div style={{ width: "52%", background: C.cream, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 400, textAlign: "left" }}>
          <h2 className="rev" style={{ margin: 0, fontFamily: "var(--font-instrument)", fontWeight: 400, fontSize: 34, color: C.ink }}>Check your email</h2>
          <p className="rev" style={{ margin: "8px 0 28px", fontSize: 14, color: C.body, animationDelay: "0.1s" }}>We sent a 6-digit code to <b style={{ color: C.ink }}>name@university.edu</b>.</p>
          <div style={{ display: "flex", gap: 12 }}>
            {digits.map((d, i) => (
              <input key={i} ref={(el) => { refs.current[i] = el; }} value={d} inputMode="numeric" maxLength={1}
                onChange={(e) => set(i, e.target.value)}
                onKeyDown={(e) => { if (e.key === "Backspace" && !d && i > 0) refs.current[i - 1]?.focus(); if (e.key === "Enter") verify(); }}
                className={`field rev ${d ? "otp-pop" : ""}`}
                style={{ width: 54, height: 64, textAlign: "center", fontSize: 26, fontWeight: 600, color: C.ink, borderRadius: 12, border: `1.5px solid ${C.fieldLine}`, background: "#fff", outline: "none", fontFamily: "var(--font-manrope)", animationDelay: `${0.12 + i * 0.05}s` }} />
            ))}
          </div>
          <button onClick={verify} disabled={!filled || loading} className="btn btn-primary rev" style={{ ...primaryBtn, marginTop: 26, opacity: filled ? 1 : 0.5, animationDelay: "0.5s" }}>
            {loading ? <><span className="spin" style={spinner} /> Verifying</> : "Verify & Continue"}
          </button>
          <div className="rev" style={{ marginTop: 16, textAlign: "center", animationDelay: "0.56s" }}>
            <span style={{ fontSize: 13.5, color: C.primary, fontWeight: 600, cursor: "pointer", borderBottom: `1px solid ${C.primary}` }}>Resend OTP</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */
/*  reusable petal card (Welcome / Canvas intro)                              */
/* ════════════════════════════════════════════════════════════════════════ */
function PetalCard({ i, kicker, kickerColor, petal, title, body, tags, delay }: {
  i: number; kicker: string; kickerColor: string; petal: string; title: string; body: string; tags: string; delay: number;
}) {
  return (
    <div className="lift rev" style={{ position: "relative", flex: 1, background: "#fff", borderRadius: 18, padding: "26px 24px 22px", border: `1px solid ${C.line}`, boxShadow: "0 1px 2px rgba(40,40,60,.04), 0 30px 60px -48px rgba(40,40,60,.4)", overflow: "hidden", animationDelay: `${delay}s` }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 56, height: 56, background: petal, borderRadius: "0 0 0 56px" }} />
      <div style={{ fontFamily: "var(--font-grotesk)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: kickerColor }}>{kicker}</div>
      <h3 style={{ margin: "12px 0 10px", fontFamily: "var(--font-instrument)", fontWeight: 400, fontSize: 26, color: C.ink }}>{title}</h3>
      <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, color: C.body, minHeight: 60 }}>{body}</p>
      <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.line}`, fontSize: 12.5, color: C.soft }}>{tags}</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */
/*  SCREEN 3 — Welcome                                                         */
/* ════════════════════════════════════════════════════════════════════════ */
function Welcome({ go }: { go: (s: Screen) => void }) {
  return (
    <div style={{ height: "100%", background: C.cream, position: "relative", padding: "30px 60px" }}>
      <Logo />
      <div style={{ maxWidth: 980, margin: "26px auto 0", textAlign: "center" }}>
        <div className="rev-scale mascot-float" style={{ display: "inline-block" }}><MimiCreature state="celebrating" size={120} /></div>
        <div className="rev" style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "7px 15px", borderRadius: 999, background: "#fff", border: `1px solid ${C.line}`, boxShadow: "0 10px 30px -20px rgba(40,40,60,.5)", fontFamily: "var(--font-grotesk)", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.08em", color: C.ink, margin: "10px 0 0", animationDelay: "0.1s" }}>
          <span style={{ display: "inline-flex", gap: 3 }}>
            <span className="typing-dot" style={dot(C.accentO)} /><span className="typing-dot d1" style={dot(C.accentP)} /><span className="typing-dot d2" style={dot(C.accentT)} />
          </span>MIMI IS READY TO SUPPORT YOU
        </div>
        <h1 className="rev" style={{ margin: "18px 0 0", fontFamily: "var(--font-instrument)", fontWeight: 400, fontSize: 56, color: C.ink, letterSpacing: "-0.02em", animationDelay: "0.16s" }}>
          Welcome to <span style={{ fontStyle: "italic", color: C.accentP }}>Mimi.</span>
        </h1>
        <p className="rev" style={{ margin: "12px auto 0", maxWidth: 560, fontSize: 16, lineHeight: 1.5, color: C.body, animationDelay: "0.24s" }}>
          Mimi supports you across three pathways — academic, emotional, and social — so you always know where to begin.
        </p>
        <div style={{ display: "flex", gap: 22, marginTop: 34 }}>
          <PetalCard i={0} kicker="PATHWAY 01" kickerColor={C.accentO} petal="linear-gradient(135deg,#F9C089,#F3A45C)" title="Academic" body="Plan your workload, track deadlines, and find study support when you need it." tags="Workload · Deadlines · Study help" delay={0.3} />
          <PetalCard i={1} kicker="PATHWAY 02" kickerColor={C.accentP} petal="linear-gradient(135deg,#C9A2EC,#A877D9)" title="Emotional" body="Talk it out, reflect on your mood, and build small habits that help you feel steady." tags="Mood · Coping · Self-care" delay={0.38} />
          <PetalCard i={2} kicker="PATHWAY 03" kickerColor={C.accentT} petal="linear-gradient(135deg,#9BDBE2,#6FC8D1)" title="Social" body="Find campus events, people, and spaces that help you feel more connected." tags="Events · Clubs · Belonging" delay={0.46} />
        </div>
        <button onClick={() => go("canvas-intro")} className="btn btn-primary rev" style={{ ...primaryBtn, width: "auto", padding: "0 28px", display: "inline-flex", marginTop: 34, animationDelay: "0.54s" }}>Let’s begin →</button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */
/*  SCREEN 4 — Canvas intro                                                    */
/* ════════════════════════════════════════════════════════════════════════ */
function CanvasIntro({ go }: { go: (s: Screen) => void }) {
  return (
    <div style={{ height: "100%", background: C.cream, position: "relative", padding: "30px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Logo /><span onClick={() => go("chat")} className="btn" style={{ fontSize: 15, color: C.body, cursor: "pointer", padding: "6px 10px" }}>Skip</span>
      </div>
      <div style={{ maxWidth: 940, margin: "18px auto 0" }}>
        <div className="rev" style={{ width: "100%", height: 4, background: "#E7E3D8", borderRadius: 9 }}>
          <div className="bar-fill" style={{ width: "50%", height: "100%", borderRadius: 9, background: C.primary }} />
        </div>
        <div className="rev" style={{ marginTop: 8, fontSize: 13, color: C.body, animationDelay: "0.08s" }}>Step 1 of 2</div>
        <div style={{ textAlign: "center", marginTop: 30 }}>
          <div className="rev-scale mascot-float" style={{ display: "inline-block" }}><MimiCreature state="encouraging" size={92} avatar /></div>
          <h1 className="rev" style={{ margin: "16px 0 0", fontFamily: "var(--font-instrument)", fontWeight: 400, fontSize: 50, color: C.ink, letterSpacing: "-0.02em", animationDelay: "0.14s" }}>
            Connect your <span style={{ fontStyle: "italic", color: C.accentP }}>Canvas</span> account.
          </h1>
          <p className="rev" style={{ margin: "12px auto 0", maxWidth: 560, fontSize: 15.5, lineHeight: 1.5, color: C.body, animationDelay: "0.22s" }}>
            Sync your courses, deadlines, and announcements — so I can give you personalized, timely support across the rest of the term.
          </p>
        </div>
        <div style={{ display: "flex", gap: 22, marginTop: 34 }}>
          <PetalCard i={0} kicker="BENEFIT 01" kickerColor={C.accentO} petal="linear-gradient(135deg,#F9C089,#F3A45C)" title="See your courses" body="An overview of your current classes and upcoming deadlines, in one place." tags="Courses · Deadlines · Sync" delay={0.3} />
          <PetalCard i={1} kicker="BENEFIT 02" kickerColor={C.accentP} petal="linear-gradient(135deg,#C9A2EC,#A877D9)" title="Stay on top" body="Never miss an announcement or assignment again — gentle, timely nudges." tags="Reminders · Alerts · Calendar" delay={0.38} />
          <PetalCard i={2} kicker="BENEFIT 03" kickerColor={C.accentT} petal="linear-gradient(135deg,#9BDBE2,#6FC8D1)" title="Personalized support" body="Mimi uses your course info to give you smarter, more relevant help." tags="Context · Care · Clarity" delay={0.46} />
        </div>
        <div style={{ textAlign: "center" }}>
          <button onClick={() => go("canvas-form")} className="btn btn-primary rev" style={{ ...primaryBtn, width: "auto", padding: "0 28px", display: "inline-flex", marginTop: 32, animationDelay: "0.54s" }}>Connect Canvas →</button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */
/*  SCREEN 5 — Canvas form                                                     */
/* ════════════════════════════════════════════════════════════════════════ */
function CanvasForm({ go }: { go: (s: Screen) => void }) {
  const [loading, setLoading] = useState(false);
  const connect = () => { if (loading) return; setLoading(true); setTimeout(() => { setLoading(false); go("chat"); }, 1500); };
  return (
    <div style={{ height: "100%", background: C.cream, position: "relative", padding: "30px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Logo /><span onClick={() => go("chat")} className="btn" style={{ fontSize: 15, color: C.body, cursor: "pointer", padding: "6px 10px" }}>Skip</span>
      </div>
      <div style={{ maxWidth: 640, margin: "18px auto 0" }}>
        <div className="rev" style={{ width: "100%", height: 4, background: "#E7E3D8", borderRadius: 9 }}>
          <div className="bar-fill" style={{ width: "50%", height: "100%", borderRadius: 9, background: C.primary }} />
        </div>
        <div className="rev" style={{ marginTop: 8, fontSize: 13, color: C.body, animationDelay: "0.08s" }}>Step 1 of 2</div>
        <div style={{ textAlign: "center", marginTop: 22 }}>
          <div className="rev-scale mascot-float" style={{ display: "inline-block" }}><MimiCreature state="thinking" size={80} avatar /></div>
          <h1 className="rev" style={{ margin: "12px 0 0", fontFamily: "var(--font-instrument)", fontWeight: 400, fontSize: 38, color: C.ink, animationDelay: "0.12s" }}>
            Connect <span style={{ fontStyle: "italic", color: C.accentP }}>Canvas</span> LMS
          </h1>
          <p className="rev" style={{ margin: "10px auto 0", maxWidth: 420, fontSize: 14.5, lineHeight: 1.5, color: C.body, animationDelay: "0.2s" }}>
            Enter your Canvas details to sync your assignments and deadlines with Mimi.
          </p>
        </div>
        <div className="rev" style={{ marginTop: 24, background: "#fff", borderRadius: 18, border: `1px solid ${C.line}`, padding: 26, boxShadow: "0 1px 2px rgba(40,40,60,.04), 0 40px 80px -55px rgba(40,40,60,.35)", animationDelay: "0.28s" }}>
          <label style={fieldLabel}>Enter your Canvas URL</label>
          <div className="field" style={fieldBox}><input placeholder="mit.instructure.com" style={fieldInput} /></div>
          <div style={{ margin: "8px 0 18px", fontSize: 12.5, color: C.soft }}>ⓘ Use your university Canvas link (e.g. mit.instructure.com)</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label style={fieldLabel}>Paste Access Token</label>
            <span style={{ fontSize: 13, color: C.primary, fontWeight: 600, borderBottom: `1px solid ${C.primary}`, cursor: "pointer", height: 18 }}>How to find this?</span>
          </div>
          <div className="field" style={fieldBox}><input placeholder="Paste your Canvas access token" style={fieldInput} /><span style={{ color: C.soft }}>⊘</span></div>
          <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "flex-start", background: "#EAF7F9", border: "1px solid #C3E7EC", borderRadius: 12, padding: "13px 14px" }}>
            <span style={{ width: 26, height: 26, borderRadius: 8, background: "#34B6C4", color: "#fff", display: "grid", placeItems: "center", fontSize: 13, flexShrink: 0 }}>🔒</span>
            <div><div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink }}>Encrypted & read-only</div><div style={{ fontSize: 12.5, color: C.body, marginTop: 2 }}>Mimi only reads your data. Nothing is posted, edited, or shared with your school.</div></div>
          </div>
          <button onClick={connect} disabled={loading} className="btn btn-primary" style={{ ...primaryBtn, marginTop: 18 }}>
            {loading ? <><span className="spin" style={spinner} /> Connecting</> : "Connect Canvas"}
          </button>
        </div>
        <div className="rev" style={{ textAlign: "center", marginTop: 18, animationDelay: "0.4s" }}>
          <span style={{ fontSize: 13.5, color: C.primary, fontWeight: 600, borderBottom: `1px solid ${C.primary}`, cursor: "pointer" }}>Need help?</span>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */
/*  SCREEN 6 — Chat                                                            */
/* ════════════════════════════════════════════════════════════════════════ */
type Msg = { who: "user" | "mimi"; text: string };
const SEED: Msg[] = [
  { who: "user", text: "I feel really overwhelmed and I don’t know where to start" },
  { who: "mimi", text: "Hey Sriyansi, I’m really sorry you’re feeling this way. It sounds like you have a lot on your plate right now. You’re not alone in this, and it’s okay to feel a bit lost sometimes." },
  { who: "mimi", text: "Let’s take it one step at a time. You’ve got an assignment due tomorrow, right? Maybe we can break it down into smaller, more manageable tasks. How does that sound to start with?" },
  { who: "user", text: "I feel like I’m failing and it’s making me anxious." },
  { who: "mimi", text: "It’s tough when anxiety starts to creep in. But please know that you’re not failing — you’re doing your best in a challenging situation. Sometimes taking a moment to breathe deeply can help calm that feeling." },
];
function Chat() {
  const [msgs, setMsgs] = useState<Msg[]>(SEED);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const scroller = useRef<HTMLDivElement | null>(null);
  useEffect(() => { scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" }); }, [msgs, typing]);
  const send = () => {
    if (!draft.trim() || typing) return;
    setMsgs((m) => [...m, { who: "user", text: draft.trim() }]); setDraft(""); setTyping(true);
    setTimeout(() => { setTyping(false); setMsgs((m) => [...m, { who: "mimi", text: "That makes sense. Let’s make it smaller — for the next 10 minutes, just choose one task that feels easiest to start. I can help you sort it out." }]); }, 2200);
  };
  const rail = [["＋ New chat", true], ["▦ Today", false], ["☰ Tasks", false], ["▤ Journal", false], ["♡ Resources", false]];
  return (
    <div style={{ display: "flex", height: "100%", background: "#fff", fontFamily: "var(--font-manrope)" }}>
      {/* sidebar */}
      <div className="rev-fade" style={{ width: 232, background: C.cream, borderRight: `1px solid ${C.line}`, padding: "22px 16px", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "0 6px 18px" }}><Logo size={26} /></div>
        {rail.map(([t, active], i) => (
          <div key={i} className="rail-item" style={{ display: "flex", alignItems: "center", padding: "9px 12px", borderRadius: 10, marginBottom: 2, fontSize: 14, fontWeight: active ? 700 : 500, color: active ? C.primary : C.body, background: active ? "#fff" : "transparent", border: active ? `1px solid ${C.line}` : "1px solid transparent", cursor: "pointer" }}
            onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "#fff"; }} onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}>{t as string}</div>
        ))}
        <div style={{ margin: "18px 6px 8px", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: C.soft }}>CHATS</div>
        {["Feeling Overwhelmed", "Physics Assignments"].map((t) => (
          <div key={t} className="rail-item" style={{ padding: "8px 12px", borderRadius: 10, fontSize: 13.5, color: C.body, cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fff")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>{t}</div>
        ))}
        <div style={{ marginTop: "auto", padding: "8px 12px", fontSize: 13.5, color: C.body, cursor: "pointer" }}>⚙ Settings</div>
      </div>
      {/* main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 26px", borderBottom: `1px solid ${C.line}` }}>
          <MimiCreature state="idle" size={34} avatar />
          <div style={{ fontSize: 15, fontWeight: 600, color: C.ink }}>Feeling overwhelmed and stuck</div>
        </div>
        <div ref={scroller} style={{ flex: 1, overflowY: "auto", padding: "24px 30px" }}>
          {msgs.map((m, i) => m.who === "user" ? (
            <div key={i} className="bubble-in-r" style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
              <div style={{ maxWidth: 480, background: "#F3EFEA", color: C.ink, padding: "13px 16px", borderRadius: "16px 16px 4px 16px", fontSize: 14.5, lineHeight: 1.5 }}>{m.text}</div>
            </div>
          ) : (
            <div key={i} className="bubble-in" style={{ display: "flex", gap: 12, marginBottom: 18, maxWidth: 620 }}>
              <div style={{ flexShrink: 0, marginTop: 2 }}><MimiCreature state="idle" size={32} avatar /></div>
              <div style={{ color: C.ink, fontSize: 14.5, lineHeight: 1.6, paddingTop: 4 }}>{m.text}</div>
            </div>
          ))}
          {typing && (
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <MimiCreature state="typing" size={32} avatar />
              <div style={{ display: "inline-flex", gap: 5, background: "#F6F3EE", padding: "12px 16px", borderRadius: 14 }}>
                <span className="typing-dot" style={dot(C.primary)} /><span className="typing-dot d1" style={dot(C.primary)} /><span className="typing-dot d2" style={dot(C.primary)} />
              </div>
            </div>
          )}
        </div>
        <div style={{ padding: "16px 30px 22px" }}>
          <div className="field" style={{ border: `1.5px solid ${C.fieldLine}`, borderRadius: 18, padding: "14px 16px", background: "#fff" }}>
            <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Tell Mimi what’s on your mind…"
              style={{ width: "100%", border: "none", outline: "none", fontSize: 14.5, color: C.ink, fontFamily: "var(--font-manrope)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
              <span style={{ width: 28, height: 28, borderRadius: 99, border: `1px solid ${C.line}`, display: "grid", placeItems: "center", color: C.soft, cursor: "pointer" }}>＋</span>
              <button onClick={send} className="btn" style={{ width: 32, height: 32, borderRadius: 99, border: "none", background: draft.trim() ? C.primary : "#E7E3EE", color: "#fff", cursor: "pointer", fontSize: 15 }}>↑</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── shared inline styles ─────────────────────────────────────────────────── */
const oauthBtn: React.CSSProperties = { width: "100%", height: 50, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, borderRadius: 12, border: `1.5px solid ${C.fieldLine}`, background: "#fff", color: C.ink, fontSize: 14.5, fontWeight: 600, fontFamily: "var(--font-manrope)", cursor: "pointer" };
const primaryBtn: React.CSSProperties = { width: "100%", height: 52, display: "flex", alignItems: "center", justifyContent: "center", gap: 9, borderRadius: 12, border: "none", background: C.primary, color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: "var(--font-manrope)", cursor: "pointer", boxShadow: "0 14px 30px -14px rgba(122,46,142,.6)" };
const spinner: React.CSSProperties = { width: 16, height: 16, borderRadius: 99, border: "2px solid rgba(255,255,255,.45)", borderTopColor: "#fff", display: "inline-block" };
const fieldLabel: React.CSSProperties = { display: "block", fontSize: 13.5, fontWeight: 600, color: C.ink, marginBottom: 8 };
const fieldBox: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8, padding: "0 14px", height: 50, borderRadius: 12, border: `1.5px solid ${C.fieldLine}`, background: "#fff" };
const fieldInput: React.CSSProperties = { flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14.5, color: C.ink, fontFamily: "var(--font-manrope)" };
function dot(c: string): React.CSSProperties { return { width: 6, height: 6, borderRadius: 99, background: c, display: "inline-block" }; }

/* ════════════════════════════════════════════════════════════════════════ */
export default function MimiProto() {
  const [screen, setScreen] = useState<Screen>("signin");
  const go = (s: Screen) => setScreen(s);
  return (
    <div className={`${instrument.variable} ${manrope.variable} ${grotesk.variable}`} style={{ fontFamily: "var(--font-manrope)", minHeight: "100vh", background: "#1C1A26", padding: "18px 18px 40px" }}>
      {/* prototype chrome (not part of the design) */}
      <div style={{ maxWidth: 1280, margin: "0 auto 14px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginRight: 6 }}>Mimi prototype</span>
        {ORDER.map((s, i) => (
          <button key={s} onClick={() => setScreen(s)} className="btn" style={{ padding: "7px 13px", borderRadius: 999, border: "none", cursor: "pointer", fontSize: 12.5, fontWeight: 600, fontFamily: "var(--font-manrope)", background: screen === s ? "#fff" : "rgba(255,255,255,.12)", color: screen === s ? C.ink : "#CFCCDA" }}>
            {i + 1}. {LABELS[s]}
          </button>
        ))}
        <span style={{ marginLeft: "auto", color: "#7E7B8C", fontSize: 12 }}>tap CTAs to advance · interactive states</span>
      </div>
      {/* device frame */}
      <div style={{ maxWidth: 1280, margin: "0 auto", height: 800, borderRadius: 18, overflow: "hidden", background: "#fff", boxShadow: "0 40px 120px -40px rgba(0,0,0,.6)" }}>
        <div key={screen} className="screen-enter" style={{ height: "100%" }}>
          {screen === "signin" && <SignIn go={go} />}
          {screen === "otp" && <Otp go={go} />}
          {screen === "welcome" && <Welcome go={go} />}
          {screen === "canvas-intro" && <CanvasIntro go={go} />}
          {screen === "canvas-form" && <CanvasForm go={go} />}
          {screen === "chat" && <Chat />}
        </div>
      </div>
    </div>
  );
}
