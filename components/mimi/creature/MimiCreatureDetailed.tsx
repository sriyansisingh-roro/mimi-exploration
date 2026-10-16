"use client";

/**
 * ──────────────────────────────────────────────────────────────────────────
 *  Mimi — Creature (Detailed).
 * ──────────────────────────────────────────────────────────────────────────
 *  Same clean "bob" silhouette + warm support light as the chosen Creature,
 *  but de-flattened: dimensional eyes (gradient iris + twin catchlights + lid),
 *  a soft little nose, a shaped mouth with a glossy lower lip (and a tongue
 *  when she's happy), rounded mitten hands with a thumb crease, and proper
 *  feet with toe lines. Body gets gentle top rim-light + bottom occlusion so
 *  it reads as a soft 3D form rather than a flat fill.
 *
 *  Motion reuses the shared companion-breathing keyframes. Reduced-motion safe.
 * ──────────────────────────────────────────────────────────────────────────
 */

import { useId } from "react";
import "../glow/mimi-glow.css";
import type { MimiGlowState } from "../glow/types";

const C = {
  hi: "#ECE6FC", mid: "#C9BDF1", lo: "#A78FDE", deep: "#8E78CC", deeper: "#6E58AE",
  ink: "#2E2850", iris: "#4A4274", irisDk: "#241F40",
  blush: "#E7B8CE", glow: "#FFD79A", core: "#FFF3D6",
  noseHi: "#CDB6EC", nose: "#9E83CF",
  lip: "#8A4E6E", lipHi: "#F2CEDC", tongue: "#E79BB4",
  frameHi: "#FCFBFF", frameLo: "#EEE9FB", ring: "#E4DEF4",
};

const BODY =
  "M100 56 C135 56 157 84 157 120 C157 152 133 168 100 168 C67 168 43 152 43 120 C43 84 65 56 100 56 Z";

const EYE = { lx: 83, rx: 117, cy: 107 };
const LIGHT = { x: 162, y: 66 };

type Look = "open" | "happy" | "sleepy" | "up";
type Mood = "smile" | "big" | "small" | "soft";

const MAP: Record<MimiGlowState, { look: Look; mood: Mood; tilt: number; motion: string; glow: number; acc: "ripple" | "spark" | "think" | "type" | null; gaze: [number, number] }> = {
  idle:        { look: "open",   mood: "smile", tilt: 0,  motion: "mg-breathe", glow: 0.9,  acc: null,     gaze: [0, 0] },
  listening:   { look: "open",   mood: "smile", tilt: -5, motion: "mg-lean",    glow: 0.9,  acc: "ripple", gaze: [0, 0] },
  thinking:    { look: "up",     mood: "small", tilt: 0,  motion: "mg-bob",     glow: 0.85, acc: "think",  gaze: [2, -2.4] },
  concerned:   { look: "open",   mood: "soft",  tilt: 3,  motion: "mg-sway",    glow: 0.5,  acc: null,     gaze: [0, 1.4] },
  celebrating: { look: "happy",  mood: "big",   tilt: 0,  motion: "mg-hop",     glow: 1,    acc: "spark",  gaze: [0, 0] },
  resting:     { look: "sleepy", mood: "soft",  tilt: 4,  motion: "mg-snooze",  glow: 0.65, acc: null,     gaze: [0, 0] },
  encouraging: { look: "open",   mood: "big",   tilt: 0,  motion: "mg-nudge",   glow: 0.92, acc: "spark",  gaze: [0, 0] },
  waiting:     { look: "open",   mood: "smile", tilt: 0,  motion: "mg-wait",    glow: 0.9,  acc: null,     gaze: [3, 0] },
  error:       { look: "open",   mood: "soft",  tilt: -3, motion: "mg-tilt",    glow: 0.92, acc: null,     gaze: [0, 0] },
  typing:      { look: "open",   mood: "smile", tilt: 0,  motion: "mg-breathe", glow: 0.85, acc: "type",   gaze: [0, 0] },
};

function Eye({ cx, cy, look, gaze, id }: { cx: number; cy: number; look: Look; gaze: [number, number]; id: string }) {
  if (look === "happy")
    return <path d={`M${cx - 6.5} ${cy + 1.5} Q${cx} ${cy - 6} ${cx + 6.5} ${cy + 1.5}`} stroke={C.ink} strokeWidth="2.8" strokeLinecap="round" fill="none" />;
  if (look === "sleepy")
    return <path d={`M${cx - 6.5} ${cy} Q${cx} ${cy + 4.5} ${cx + 6.5} ${cy}`} stroke={C.ink} strokeWidth="2.8" strokeLinecap="round" fill="none" />;
  const [gx, gy] = look === "up" ? gaze : [0, 0];
  return (
    <g>
      {/* iris with vertical gradient → roundness */}
      <ellipse cx={cx + gx} cy={cy + gy} rx="5.1" ry="6.4" fill={`url(#${id}-eye)`} />
      {/* upper-lid soft shadow */}
      <path d={`M${cx - 5} ${cy - 3.4} Q${cx} ${cy - 7.4} ${cx + 5} ${cy - 3.4}`} stroke="#1C1834" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.35" />
      {/* twin catchlights */}
      <circle cx={cx + gx - 1.8} cy={cy + gy - 2.5} r="2" fill="#fff" />
      <circle cx={cx + gx + 1.7} cy={cy + gy + 2.2} r="1.1" fill="#fff" opacity="0.85" />
    </g>
  );
}

function Nose() {
  return (
    <g>
      <path d="M96.4 114.5 Q100 113.6 103.6 114.5 Q102.4 119.4 100 120 Q97.6 119.4 96.4 114.5 Z" fill={C.nose} />
      <ellipse cx="98.4" cy="115.6" rx="1.5" ry="1" fill={C.noseHi} opacity="0.85" />
    </g>
  );
}

function Mouth({ mood, id }: { mood: Mood; id: string }) {
  if (mood === "small")
    return (
      <g>
        <path d="M95.5 128 Q100 131.5 104.5 128" stroke={C.lip} strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <path d="M96.5 130 Q100 132 103.5 130" stroke={C.lipHi} strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.7" />
      </g>
    );
  if (mood === "soft")
    return <path d="M94 130 Q100 127 106 130" stroke={C.lip} strokeWidth="2.6" strokeLinecap="round" fill="none" />;
  // smile / big — a shaped, slightly-open mouth with lip + tongue
  const big = mood === "big";
  const top = big ? 124.5 : 126;
  const bot = big ? 138 : 135.5;
  return (
    <g>
      <clipPath id={`${id}-mouth`}>
        <path d={`M89 ${top} Q100 ${top - 3} 111 ${top} Q109 ${bot} 100 ${bot + 0.5} Q91 ${bot} 89 ${top} Z`} />
      </clipPath>
      <path d={`M89 ${top} Q100 ${top - 3} 111 ${top} Q109 ${bot} 100 ${bot + 0.5} Q91 ${bot} 89 ${top} Z`} fill={C.lip} />
      <g clipPath={`url(#${id}-mouth)`}>
        <ellipse cx="100" cy={bot - 1} rx={big ? 7 : 6} ry={big ? 4 : 3} fill={C.tongue} />
        {/* upper inner shadow for depth */}
        <path d={`M89 ${top} Q100 ${top + 1.5} 111 ${top}`} stroke="#5E3550" strokeWidth="2.2" fill="none" opacity="0.6" />
      </g>
      {/* glossy lower lip */}
      <path d={`M92 ${bot - 0.5} Q100 ${bot + 3} 108 ${bot - 0.5}`} stroke={C.lipHi} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.85" />
    </g>
  );
}

function Hand({ x, rot, id }: { x: number; rot: number; id: string }) {
  return (
    <g transform={`translate(${x} 132) rotate(${rot})`}>
      <ellipse cx="0" cy="0" rx="9.5" ry="12.5" fill={`url(#${id}-hand)`} />
      {/* thumb */}
      <ellipse cx={rot > 0 ? 6 : -6} cy="-3" rx="3.6" ry="5.2" fill={`url(#${id}-hand)`} transform={`rotate(${rot > 0 ? 24 : -24} ${rot > 0 ? 6 : -6} -3)`} />
      {/* soft highlight */}
      <ellipse cx="-2.5" cy="-5" rx="3" ry="4.4" fill="#fff" opacity="0.18" />
    </g>
  );
}

function Foot({ x, id }: { x: number; id: string }) {
  return (
    <g transform={`translate(${x} 169)`}>
      <ellipse cx="0" cy="0" rx="11.5" ry="7.2" fill={`url(#${id}-foot)`} />
      <path d="M-4 2.5 Q-4 -2 -4 2.5" stroke={C.deeper} strokeWidth="1.4" strokeLinecap="round" opacity="0.45" fill="none" />
      <path d="M0 3.2 L0 -1.5" stroke={C.deeper} strokeWidth="1.4" strokeLinecap="round" opacity="0.45" />
      <path d="M4 2.5 L4 -1.5" stroke={C.deeper} strokeWidth="1.4" strokeLinecap="round" opacity="0.45" />
      <ellipse cx="-3" cy="-3" rx="4" ry="2.4" fill="#fff" opacity="0.22" />
    </g>
  );
}

function Accessory({ acc, id }: { acc: "ripple" | "spark" | "think" | "type" | null; id: string }) {
  if (acc === "ripple")
    return (
      <g stroke={C.lo} strokeWidth="2.2" strokeLinecap="round" fill="none">
        <path className="mg-ripple" d="M34 104 Q26 114 34 124" />
        <path className="mg-ripple d1" d="M26 98 Q14 114 26 130" />
      </g>
    );
  if (acc === "think")
    return (
      <g fill={C.lo}>
        <circle className="mg-think" cx="150" cy="58" r="3" />
        <circle className="mg-think d1" cx="161" cy="48" r="2.4" />
        <circle className="mg-think d2" cx="170" cy="40" r="1.9" />
      </g>
    );
  if (acc === "spark")
    return (
      <g fill={C.glow}>
        <g className="mg-spark" transform="translate(52 58)"><path d="M0 -5 L1.3 -1.3 L5 0 L1.3 1.3 L0 5 L-1.3 1.3 L-5 0 L-1.3 -1.3 Z" /></g>
        <g className="mg-spark d1" transform="translate(176 72) scale(0.8)"><path d="M0 -5 L1.3 -1.3 L5 0 L1.3 1.3 L0 5 L-1.3 1.3 L-5 0 L-1.3 -1.3 Z" /></g>
      </g>
    );
  if (acc === "type")
    return (
      <g fill={C.lo}>
        <circle className="mg-type" cx="86" cy="190" r="3.2" />
        <circle className="mg-type d1" cx="100" cy="190" r="3.2" />
        <circle className="mg-type d2" cx="114" cy="190" r="3.2" />
      </g>
    );
  return null;
}

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <radialGradient id={`${id}-b`} cx="42%" cy="26%" r="88%">
        <stop offset="0%" stopColor={C.hi} /><stop offset="52%" stopColor={C.mid} /><stop offset="100%" stopColor={C.lo} />
      </radialGradient>
      <radialGradient id={`${id}-occ`} cx="50%" cy="100%" r="62%">
        <stop offset="0%" stopColor={C.deeper} stopOpacity="0.55" /><stop offset="60%" stopColor={C.deeper} stopOpacity="0.12" /><stop offset="100%" stopColor={C.deeper} stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={C.glow} stopOpacity="0.85" /><stop offset="64%" stopColor={C.glow} stopOpacity="0.22" /><stop offset="100%" stopColor={C.glow} stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${id}-eye`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={C.iris} /><stop offset="100%" stopColor={C.irisDk} />
      </linearGradient>
      <linearGradient id={`${id}-hand`} x1="0" y1="-1" x2="0" y2="1">
        <stop offset="0%" stopColor={C.mid} /><stop offset="100%" stopColor={C.deep} />
      </linearGradient>
      <linearGradient id={`${id}-foot`} x1="0" y1="-1" x2="0" y2="1">
        <stop offset="0%" stopColor={C.lo} /><stop offset="100%" stopColor={C.deeper} />
      </linearGradient>
      <radialGradient id={`${id}-frame`} cx="50%" cy="40%" r="72%">
        <stop offset="0%" stopColor={C.frameHi} /><stop offset="100%" stopColor={C.frameLo} />
      </radialGradient>
      <clipPath id={`${id}-clip`}><path d={BODY} /></clipPath>
    </defs>
  );
}

function BodyFace({ id, m, withLimbs }: { id: string; m: typeof MAP[MimiGlowState]; withLimbs: boolean }) {
  return (
    <>
      {withLimbs && (
        <>
          <Foot x={84} id={id} />
          <Foot x={116} id={id} />
          <Hand x={47} rot={14} id={id} />
          <Hand x={153} rot={-14} id={id} />
        </>
      )}
      {/* body */}
      <path d={BODY} fill={`url(#${id}-b)`} />
      <g clipPath={`url(#${id}-clip)`}>
        <ellipse cx="79" cy="86" rx="22" ry="13" fill="#ffffff" opacity="0.26" transform="rotate(-18 79 86)" />
        <ellipse cx="142" cy="82" rx="30" ry="26" fill={`url(#${id}-glow)`} opacity={0.5} />
        <ellipse cx="100" cy="168" rx="62" ry="44" fill={`url(#${id}-occ)`} />
        <path d="M70 64 Q100 53 130 64" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.4" />
      </g>
      {/* face */}
      <g>
        <ellipse cx="72" cy="116" rx="6.4" ry="3.8" fill={C.blush} opacity="0.5" />
        <ellipse cx="128" cy="116" rx="6.4" ry="3.8" fill={C.blush} opacity="0.5" />
        <Eye cx={EYE.lx} cy={EYE.cy} look={m.look} gaze={m.gaze} id={id} />
        <Eye cx={EYE.rx} cy={EYE.cy} look={m.look} gaze={m.gaze} id={id} />
        <Nose />
        <Mouth mood={m.mood} id={id} />
      </g>
    </>
  );
}

export default function MimiCreatureDetailed({ state = "idle", size = 240, idle = true, avatar = false }: { state?: MimiGlowState; size?: number; idle?: boolean; avatar?: boolean }) {
  const id = `md${useId().replace(/[:]/g, "")}`;
  const m = MAP[state];
  const motion = idle ? m.motion : "";
  const glowCls = idle ? "glow-steady" : "";

  if (avatar) {
    return (
      <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label={`Mimi (detailed avatar), ${state}`} style={{ display: "block" }}>
        <Defs id={id} />
        <clipPath id={`${id}-ac`}><circle cx="60" cy="60" r="57" /></clipPath>
        <circle cx="60" cy="60" r="59" fill={`url(#${id}-frame)`} />
        <g clipPath={`url(#${id}-ac)`}>
          <g className={`mg-glow ${glowCls}`} opacity={m.glow}>
            <ellipse cx="90" cy="38" rx="34" ry="32" fill={`url(#${id}-glow)`} />
          </g>
          {/* static scale/translate OUTSIDE the animated group (CSS transform would override an attr on the same node) */}
          <g transform="translate(-24 -34.1) scale(0.84)">
            <g className={`mg-body ${motion}`} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <BodyFace id={id} m={m} withLimbs={false} />
            </g>
          </g>
        </g>
        <circle cx="60" cy="60" r="58" fill="none" stroke={C.ring} strokeWidth="1.4" opacity="0.7" />
        <g className={`mg-glow ${glowCls}`} opacity={m.glow}>
          <circle cx="98" cy="26" r="13" fill={`url(#${id}-glow)`} />
          <circle cx="98" cy="26" r="4.4" fill={C.core} />
          <circle cx="98" cy="26" r="2.6" fill={C.glow} />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label={`Mimi (detailed), ${state}`} style={{ overflow: "visible", display: "block" }}>
      <Defs id={id} />
      <ellipse cx="100" cy="178" rx="46" ry="7" fill={C.ink} opacity="0.08" />

      {/* warm halo */}
      <g className={`mg-glow ${glowCls}`} opacity={m.glow}>
        <ellipse cx="118" cy="120" rx="68" ry="56" fill={`url(#${id}-glow)`} />
      </g>

      <g style={m.tilt ? { transform: `rotate(${m.tilt}deg)`, transformBox: "view-box", transformOrigin: "100px 150px" } : undefined}>
        <g className={`mg-body ${motion}`} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <BodyFace id={id} m={m} withLimbs />
        </g>
      </g>

      {/* warm support light */}
      <g className={`mg-glow ${glowCls}`} opacity={m.glow}>
        <circle cx={LIGHT.x} cy={LIGHT.y} r="19" fill={`url(#${id}-glow)`} />
        <circle cx={LIGHT.x} cy={LIGHT.y} r="5.5" fill={C.core} />
        <circle cx={LIGHT.x} cy={LIGHT.y} r="3.2" fill={C.glow} />
      </g>

      {idle && <Accessory acc={m.acc} id={id} />}
    </svg>
  );
}
