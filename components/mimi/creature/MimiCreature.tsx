"use client";

/**
 * ──────────────────────────────────────────────────────────────────────────
 *  Minimal Creature Mimi — exact mascot character, with the warm yellow
 *  support-light in place of the green accent. Nothing else changed: same
 *  body, little arms + feet, same simple face. Ten states drive the face,
 *  the glow intensity and a small accessory; motion is soft and slow
 *  (../glow/mimi-glow.css). Reduced-motion safe.
 * ──────────────────────────────────────────────────────────────────────────
 */

import { useId } from "react";
import "../glow/mimi-glow.css";
import { STATES, STATE_ORDER } from "../glow/MimiGlow";
import type { AccType, BrowMode, EyeMode, MimiGlowProps, MouthMode } from "../glow/types";

export { STATES, STATE_ORDER };

const C = {
  hi: "#ECE6FC", mid: "#C9BDF1", lo: "#A78FDE", deep: "#8676C4",
  ink: "#3A3460", blush: "#E7B8CE", glow: "#FFD79A", core: "#FFF3D6",
} as const;

/* exact Minimal Creature body (200 viewBox) */
const BODY = "M100 56 C135 56 157 84 157 120 C157 152 133 168 100 168 C67 168 43 152 43 120 C43 84 65 56 100 56 Z";
const EYE = { lx: 83, rx: 117, cy: 112 };
const MX = 100;
const LIGHT = { x: 162, y: 66 };
const GLOW_OP: Record<string, number> = { steady: 0.9, soft: 0.65, bright: 1, warm: 0.92, dim: 0.5, pulse: 0.85 };

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <radialGradient id={`${id}-b`} cx="40%" cy="28%" r="86%">
        <stop offset="0%" stopColor={C.hi} /><stop offset="55%" stopColor={C.mid} /><stop offset="100%" stopColor={C.lo} />
      </radialGradient>
      <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={C.glow} stopOpacity="0.85" /><stop offset="64%" stopColor={C.glow} stopOpacity="0.22" /><stop offset="100%" stopColor={C.glow} stopOpacity="0" />
      </radialGradient>
      <clipPath id={`${id}-clip`}><path d={BODY} /></clipPath>
    </defs>
  );
}

/* simple mascot face — small eyes, single highlight (unchanged) */
function eyeAt(cx: number, cy: number, mode: EyeMode, gaze: [number, number]) {
  if (mode === "happy") return <path d={`M${cx - 6} ${cy + 1} Q${cx} ${cy - 6} ${cx + 6} ${cy + 1}`} stroke={C.ink} strokeWidth="2.6" strokeLinecap="round" fill="none" />;
  if (mode === "sleepy") return <path d={`M${cx - 6} ${cy - 0.5} Q${cx} ${cy + 5} ${cx + 6} ${cy - 0.5}`} stroke={C.ink} strokeWidth="2.6" strokeLinecap="round" fill="none" />;
  const rx = mode === "soft" || mode === "wide" ? 4.6 : 4.2, ry = mode === "soft" || mode === "wide" ? 5.6 : 5.2;
  const [gx, gy] = mode === "look" ? gaze : mode === "aside" ? [2.6, 0] : [0, 0];
  return (
    <g>
      <ellipse cx={cx + gx} cy={cy + gy} rx={rx} ry={ry} fill={C.ink} />
      <circle cx={cx + gx - 1.4} cy={cy + gy - 1.8} r="1.3" fill="#fff" />
    </g>
  );
}
function brows(mode: BrowMode) {
  if (mode === "none") return null;
  const L = EYE.lx, R = EYE.rx, y = 100;
  if (mode === "care") return (
    <g stroke={C.ink} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.85">
      <path d={`M${L - 6} ${y} Q${L} ${y - 3.5} ${L + 5} ${y - 1}`} /><path d={`M${R - 5} ${y - 1} Q${R} ${y - 3.5} ${R + 6} ${y}`} />
    </g>);
  return (
    <g stroke={C.ink} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.72">
      <path d={`M${L - 6} ${y} Q${L} ${y - 3.5} ${L + 6} ${y - 1}`} /><path d={`M${R - 6} ${y - 1} Q${R} ${y - 3.5} ${R + 6} ${y}`} />
    </g>);
}
function mouth(mode: MouthMode) {
  const d =
    mode === "smile"   ? `M${MX - 8} 125 Q${MX} 133 ${MX + 8} 125`
    : mode === "gentle"  ? `M${MX - 7} 126 Q${MX} 131 ${MX + 7} 126`
    : mode === "soft"    ? `M${MX - 6} 128 Q${MX} 125 ${MX + 6} 128`
    : mode === "small"   ? `M${MX - 3.5} 127 Q${MX} 129 ${MX + 3.5} 127`
    : `M${MX - 6} 127 Q${MX} 130 ${MX + 6} 127`; // relaxed
  return <path d={d} stroke={C.ink} strokeWidth="2.4" strokeLinecap="round" fill="none" />;
}

function accessory(acc: AccType) {
  if (acc === "ripple") return (
    <g stroke={C.lo} strokeWidth="2.2" strokeLinecap="round" fill="none">
      <path className="mg-ripple" d="M34 104 Q26 114 34 124" /><path className="mg-ripple d1" d="M26 98 Q14 114 26 130" />
    </g>);
  if (acc === "think") return (
    <g className="mg-spark" transform={`translate(${LIGHT.x + 4} ${LIGHT.y - 16})`} fill={C.glow}>
      <path d="M0 -5 L1.3 -1.3 L5 0 L1.3 1.3 L0 5 L-1.3 1.3 L-5 0 L-1.3 -1.3 Z" />
    </g>);
  if (acc === "spark") return (
    <g fill={C.glow}>
      <g className="mg-spark" transform="translate(52 58)"><path d="M0 -5 L1.3 -1.3 L5 0 L1.3 1.3 L0 5 L-1.3 1.3 L-5 0 L-1.3 -1.3 Z" /></g>
      <g className="mg-spark d1" transform={`translate(${LIGHT.x + 14} ${LIGHT.y + 6}) scale(0.8)`}><path d="M0 -5 L1.3 -1.3 L5 0 L1.3 1.3 L0 5 L-1.3 1.3 L-5 0 L-1.3 -1.3 Z" /></g>
    </g>);
  if (acc === "typing") return (
    <g fill={C.glow}>
      <circle className="mg-type" cx={LIGHT.x - 12} cy={LIGHT.y + 22} r="2.8" /><circle className="mg-type d1" cx={LIGHT.x} cy={LIGHT.y + 22} r="2.8" /><circle className="mg-type d2" cx={LIGHT.x + 12} cy={LIGHT.y + 22} r="2.8" />
    </g>);
  return null;
}

export default function MimiCreature({
  state = "idle", size = 220, idle = true, style = {}, "aria-label": ariaLabel,
}: MimiGlowProps) {
  const id = `mc${useId().replace(/[:]/g, "")}`;
  const cfg = STATES[state];
  const motion = idle ? cfg.motion : "";
  const glowOp = GLOW_OP[cfg.glow];
  const glowCls = idle ? `glow-${cfg.glow}` : "";
  const gaze: [number, number] = [2.2, -1.3];

  return (
    <svg
      viewBox="0 0 200 200" width={size} height={size} role="img"
      aria-label={ariaLabel ?? `Mimi, ${cfg.label.toLowerCase()} — ${cfg.feel}`}
      style={{ overflow: "visible", display: "block", ...style }}
    >
      <Defs id={id} />
      <ellipse cx="100" cy="176" rx="46" ry="7" fill={C.ink} opacity="0.07" />

      {/* warm glow behind, toward the light */}
      <g className={`mg-glow ${glowCls}`} opacity={glowOp}>
        <ellipse cx="118" cy="120" rx="68" ry="56" fill={`url(#${id}-glow)`} />
      </g>

      <g style={cfg.tilt ? { transform: `rotate(${cfg.tilt}deg)`, transformBox: "view-box", transformOrigin: "100px 150px" } : undefined}>
        <g className={`mg-body ${motion}`}>
          {/* feet + arms (exact mascot) */}
          <ellipse cx="84" cy="170" rx="9" ry="6" fill={C.lo} />
          <ellipse cx="116" cy="170" rx="9" ry="6" fill={C.lo} />
          <g transform="translate(46 130) rotate(16)"><ellipse cx="0" cy="0" rx="9" ry="12" fill={C.lo} /></g>
          <g transform="translate(154 130) rotate(-16)"><ellipse cx="0" cy="0" rx="9" ry="12" fill={C.lo} /></g>

          <path d={BODY} fill={`url(#${id}-b)`} />
          <g clipPath={`url(#${id}-clip)`}>
            <ellipse cx="79" cy="88" rx="21" ry="12" fill="#ffffff" opacity="0.24" transform="rotate(-18 79 88)" />
            {/* the light gently warms Mimi's upper-right edge */}
            <ellipse cx="142" cy="82" rx="30" ry="26" fill={`url(#${id}-glow)`} opacity={glowOp * 0.55} />
          </g>

          {/* face */}
          <g>
            <ellipse cx="75" cy="118" rx="6" ry="3.6" fill={C.blush} opacity="0.55" />
            <ellipse cx="125" cy="118" rx="6" ry="3.6" fill={C.blush} opacity="0.55" />
            {brows(cfg.brow)}
            {eyeAt(EYE.lx, EYE.cy, cfg.eye, gaze)}
            {eyeAt(EYE.rx, EYE.cy, cfg.eye, gaze)}
            {mouth(cfg.mouth)}
          </g>
        </g>
      </g>

      {/* the warm support light — replaces the green shape */}
      <g className={`mg-glow ${glowCls}`} opacity={glowOp}>
        <circle cx={LIGHT.x} cy={LIGHT.y} r={cfg.glow === "bright" ? 22 : 19} fill={`url(#${id}-glow)`} />
        <circle cx={LIGHT.x} cy={LIGHT.y} r="5.5" fill={C.core} />
        <circle cx={LIGHT.x} cy={LIGHT.y} r="3.2" fill={C.glow} />
      </g>

      {idle && accessory(cfg.acc)}
    </svg>
  );
}
