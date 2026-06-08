"use client";

/**
 * ──────────────────────────────────────────────────────────────────────────
 *  Glow Mimi — a calm student-wellbeing companion.
 * ──────────────────────────────────────────────────────────────────────────
 *  A soft lavender body with a small warm light beside her — "a little light
 *  beside you." Ten states convey presence and care; motion is deliberately
 *  slow and soft (see ./mimi-glow.css), like a companion breathing next to
 *  the user. Every state has its own subtle loop. Reduced-motion safe.
 *
 *  <MimiGlow state="listening" size={220} />
 * ──────────────────────────────────────────────────────────────────────────
 */

import { useId } from "react";
import "./mimi-glow.css";
import type {
  AccType, BrowMode, EyeMode, MimiGlowProps, MimiGlowState, MouthMode, StateConfig,
} from "./types";

const G = {
  hi: "#ECE6FC", mid: "#C9BDF1", lo: "#A78FDE", deep: "#8676C4",
  ink: "#3A3460", blush: "#E7B8CE", glow: "#FFD79A", core: "#FFF3D6",
  gGreen: "#74BE78",
} as const;

const EYE = { lx: 94, rx: 122, cy: 112 };
const MX = 108;

export const STATES: Record<MimiGlowState, StateConfig> = {
  idle:        { eye: "open",   brow: "none",  mouth: "gentle",  glow: "steady", acc: null,      tilt: 0,  motion: "mg-breathe", label: "Idle",          feel: "I’m here with you." },
  listening:   { eye: "open",   brow: "raise", mouth: "gentle",  glow: "steady", acc: "ripple",  tilt: -5, motion: "mg-lean",    label: "Listening",     feel: "I’m listening. Take your time." },
  thinking:    { eye: "look",   brow: "raise", mouth: "small",   glow: "pulse",  acc: "think",   tilt: 0,  motion: "mg-bob",     label: "Thinking",      feel: "Let me work on this." },
  concerned:   { eye: "soft",   brow: "care",  mouth: "soft",    glow: "dim",    acc: null,      tilt: 3,  motion: "mg-sway",    label: "Concerned",     feel: "That sounds hard. I’m still here." },
  celebrating: { eye: "happy",  brow: "none",  mouth: "smile",   glow: "bright", acc: "spark",   tilt: 0,  motion: "mg-hop",     label: "Celebrating",   feel: "Nice, you did it." },
  resting:     { eye: "sleepy", brow: "none",  mouth: "relaxed", glow: "soft",   acc: null,      tilt: 4,  motion: "mg-snooze",  label: "Resting",       feel: "No rush. Let’s slow down." },
  encouraging: { eye: "open",   brow: "none",  mouth: "smile",   glow: "warm",   acc: "spark",   tilt: 0,  motion: "mg-nudge",   label: "Encouraging",   feel: "You can take the next small step." },
  waiting:     { eye: "aside",  brow: "none",  mouth: "gentle",  glow: "steady", acc: null,      tilt: 0,  motion: "mg-sway",    label: "Waiting",       feel: "I’ll wait here." },
  error:       { eye: "soft",   brow: "raise", mouth: "gentle",  glow: "warm",   acc: null,      tilt: -3, motion: "mg-tilt",    label: "Reassurance",   feel: "No worries, we can try again." },
  typing:      { eye: "open",   brow: "none",  mouth: "gentle",  glow: "pulse",  acc: "typing",  tilt: 0,  motion: "mg-breathe", label: "Typing",        feel: "Mimi is responding." },
};

export const STATE_ORDER: MimiGlowState[] = [
  "idle", "listening", "thinking", "concerned", "celebrating",
  "resting", "encouraging", "waiting", "error", "typing",
];

const BODY =
  "M108 56 C146 56 169 84 169 120 C169 155 143 173 108 173 C73 173 47 155 47 120 C47 84 70 56 108 56 Z";

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <radialGradient id={`${id}-b`} cx="40%" cy="28%" r="86%">
        <stop offset="0%" stopColor={G.hi} /><stop offset="55%" stopColor={G.mid} /><stop offset="100%" stopColor={G.lo} />
      </radialGradient>
      <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={G.glow} stopOpacity="0.85" /><stop offset="65%" stopColor={G.glow} stopOpacity="0.22" /><stop offset="100%" stopColor={G.glow} stopOpacity="0" />
      </radialGradient>
      <clipPath id={`${id}-clip`}><path d={BODY} /></clipPath>
    </defs>
  );
}

function eyeAt(cx: number, cy: number, mode: EyeMode, gaze: [number, number]) {
  if (mode === "happy") return <path d={`M${cx - 6.5} ${cy + 1} Q${cx} ${cy - 6.5} ${cx + 6.5} ${cy + 1}`} stroke={G.ink} strokeWidth="2.8" strokeLinecap="round" fill="none" />;
  if (mode === "sleepy") return <path d={`M${cx - 6.5} ${cy - 0.5} Q${cx} ${cy + 5} ${cx + 6.5} ${cy - 0.5}`} stroke={G.ink} strokeWidth="2.8" strokeLinecap="round" fill="none" />;
  const rx = mode === "soft" || mode === "wide" ? 4.8 : 4.4, ry = mode === "soft" || mode === "wide" ? 5.8 : 5.4;
  const [gx, gy] = mode === "look" ? gaze : mode === "aside" ? [3, 0] : [0, 0];
  return (
    <g>
      <ellipse cx={cx + gx} cy={cy + gy} rx={rx} ry={ry} fill={G.ink} />
      <circle cx={cx + gx - 1.5} cy={cy + gy - 1.9} r="1.4" fill="#fff" />
    </g>
  );
}
function brows(mode: BrowMode) {
  if (mode === "none") return null;
  const L = EYE.lx, R = EYE.rx;
  if (mode === "care") return (
    <g stroke={G.ink} strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.9">
      <path d={`M${L - 7} 99 Q${L} 95 ${L + 6} 98`} /><path d={`M${R - 6} 98 Q${R} 95 ${R + 7} 99`} />
    </g>
  );
  return (
    <g stroke={G.ink} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.78">
      <path d={`M${L - 7} 99 Q${L} 95 ${L + 7} 98`} /><path d={`M${R - 7} 98 Q${R} 95 ${R + 7} 99`} />
    </g>
  );
}
function mouth(mode: MouthMode) {
  const d =
    mode === "smile"   ? `M${MX - 8} 123 Q${MX} 131 ${MX + 8} 123`
    : mode === "gentle"  ? `M${MX - 7} 124 Q${MX} 129 ${MX + 7} 124`
    : mode === "soft"    ? `M${MX - 6} 126 Q${MX} 123 ${MX + 6} 126`
    : mode === "small"   ? `M${MX - 3.5} 125 Q${MX} 127 ${MX + 3.5} 125`
    : `M${MX - 6} 125 Q${MX} 128 ${MX + 6} 125`; // relaxed
  return <path d={d} stroke={G.ink} strokeWidth="2.6" strokeLinecap="round" fill="none" />;
}

function accessory(acc: AccType) {
  if (acc === "ripple") return (
    <g stroke={G.lo} strokeWidth="2.4" strokeLinecap="round" fill="none">
      <path className="mg-ripple" d="M38 104 Q30 114 38 124" />
      <path className="mg-ripple d1" d="M30 98 Q18 114 30 130" />
    </g>
  );
  if (acc === "think") return (
    <g fill={G.lo}>
      <circle className="mg-think" cx="150" cy="62" r="3" />
      <circle className="mg-think d1" cx="161" cy="52" r="2.4" />
      <circle className="mg-think d2" cx="170" cy="44" r="1.9" />
    </g>
  );
  if (acc === "spark") return (
    <g fill={G.glow}>
      <g className="mg-spark" transform="translate(58 60)"><path d="M0 -5 L1.3 -1.3 L5 0 L1.3 1.3 L0 5 L-1.3 1.3 L-5 0 L-1.3 -1.3 Z" /></g>
      <g className="mg-spark d1" transform="translate(160 58) scale(0.8)"><path d="M0 -5 L1.3 -1.3 L5 0 L1.3 1.3 L0 5 L-1.3 1.3 L-5 0 L-1.3 -1.3 Z" fill={G.gGreen} /></g>
    </g>
  );
  if (acc === "typing") return (
    <g fill={G.lo}>
      <circle className="mg-type" cx="96" cy="190" r="3.4" />
      <circle className="mg-type d1" cx="108" cy="190" r="3.4" />
      <circle className="mg-type d2" cx="120" cy="190" r="3.4" />
    </g>
  );
  return null;
}

export default function MimiGlow({
  state = "idle", size = 220, idle = true, style = {}, "aria-label": ariaLabel,
}: MimiGlowProps) {
  const id = `mg${useId().replace(/[:]/g, "")}`;
  const cfg = STATES[state];
  const motion = idle ? cfg.motion : "";
  const glowCls = idle ? `glow-${cfg.glow}` : "";
  const gaze: [number, number] = [2.4, -1.4];
  const GLOW_OP: Record<string, number> = { steady: 0.9, soft: 0.65, bright: 1, warm: 0.92, dim: 0.5, pulse: 0.85 };
  const glowOp = GLOW_OP[cfg.glow];

  return (
    <svg
      viewBox="0 0 220 210" width={size} height={(size * 210) / 220} role="img"
      aria-label={ariaLabel ?? `Mimi, ${cfg.label.toLowerCase()} — ${cfg.feel}`}
      style={{ overflow: "visible", display: "block", ...style }}
    >
      <Defs id={id} />
      <ellipse cx="108" cy="186" rx="46" ry="7.5" fill={G.ink} opacity="0.08" />

      {/* warm halo behind the body */}
      <g className={`mg-glow ${glowCls}`} opacity={glowOp}>
        <ellipse cx="108" cy="132" rx="70" ry="60" fill={`url(#${id}-glow)`} />
      </g>

      <g style={cfg.tilt ? { transform: `rotate(${cfg.tilt}deg)`, transformBox: "view-box", transformOrigin: "108px 150px" } : undefined}>
        <g className={`mg-body ${motion}`}>
          <ellipse cx="93" cy="171" rx="9" ry="6" fill={G.lo} />
          <ellipse cx="123" cy="171" rx="9" ry="6" fill={G.lo} />
          <path d={BODY} fill={`url(#${id}-b)`} />
          <g clipPath={`url(#${id}-clip)`}>
            <ellipse cx="84" cy="88" rx="22" ry="13" fill="#ffffff" opacity="0.24" transform="rotate(-18 84 88)" />
          </g>
          <g>
            <ellipse cx="78" cy="118" rx="6" ry="3.6" fill={G.blush} opacity="0.5" />
            <ellipse cx="138" cy="118" rx="6" ry="3.6" fill={G.blush} opacity="0.5" />
            {brows(cfg.brow)}
            {eyeAt(EYE.lx, EYE.cy, cfg.eye, gaze)}
            {eyeAt(EYE.rx, EYE.cy, cfg.eye, gaze)}
            {mouth(cfg.mouth)}
          </g>
        </g>
      </g>

      {/* the small warm light beside Mimi */}
      <g className={`mg-glow ${glowCls}`} opacity={glowOp}>
        <circle cx="176" cy="64" r="22" fill={`url(#${id}-glow)`} />
        <circle cx="176" cy="64" r="6" fill={G.core} />
        <circle cx="176" cy="64" r="3.4" fill={G.glow} />
      </g>

      {idle && accessory(cfg.acc)}
    </svg>
  );
}
