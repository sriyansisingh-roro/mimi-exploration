"use client";

/**
 * ──────────────────────────────────────────────────────────────────────────
 *  Mimi — Creature (Refined).
 * ──────────────────────────────────────────────────────────────────────────
 *  Same "bob" silhouette + warm support light, but a more grown-up, designed
 *  face instead of a kawaii one. Mature cues, not childish:
 *   · almond eyes with a defined upper lid + a single calm catchlight
 *     (no twin sparkles)
 *   · a slim, subtle nose
 *   · a small defined mouth with a real lower lip — gently open, muted
 *     interior (no bright tongue-grin)
 *   · no cheek blush
 *   · slimmer, cleaner hands and feet
 *  Body keeps a soft top rim-light + bottom occlusion so she reads as a clean
 *  3D form. Motion reuses the shared companion-breathing keyframes.
 * ──────────────────────────────────────────────────────────────────────────
 */

import { useId } from "react";
import "../glow/mimi-glow.css";
import type { MimiGlowState } from "../glow/types";

const C = {
  hi: "#EDE7FC", mid: "#C7BAF0", lo: "#A78FDE", deep: "#8E78CC", deeper: "#6A54AA",
  ink: "#2A2548",
  iris: "#3C3760", irisDk: "#19152F", lid: "#15112A",
  nose: "#9A86C6", noseHi: "#CBB9EC",
  lip: "#7C4D67", lipDk: "#5A3349", lipHi: "#E7C6D2", mouthIn: "#C98BA0",
  glow: "#FFD79A", core: "#FFF3D6",
  frameHi: "#FCFBFF", frameLo: "#EEE9FB", ring: "#E4DEF4",
};

const BODY =
  "M100 56 C135 56 157 84 157 120 C157 152 133 168 100 168 C67 168 43 152 43 120 C43 84 65 56 100 56 Z";

const EYE = { lx: 83, rx: 117, cy: 106 };
const LIGHT = { x: 162, y: 66 };

type Look = "open" | "happy" | "sleepy" | "up";
type Mood = "smile" | "big" | "small" | "soft";

const MAP: Record<MimiGlowState, { look: Look; mood: Mood; tilt: number; motion: string; glow: number; acc: "ripple" | "spark" | "think" | "type" | null; gaze: [number, number] }> = {
  idle:        { look: "open",   mood: "smile", tilt: 0,  motion: "mg-breathe", glow: 0.9,  acc: null,     gaze: [0, 0] },
  listening:   { look: "open",   mood: "smile", tilt: -5, motion: "mg-lean",    glow: 0.9,  acc: "ripple", gaze: [0, 0] },
  thinking:    { look: "up",     mood: "small", tilt: 0,  motion: "mg-bob",     glow: 0.85, acc: "think",  gaze: [2, -2.2] },
  concerned:   { look: "open",   mood: "soft",  tilt: 3,  motion: "mg-sway",    glow: 0.5,  acc: null,     gaze: [0, 1.2] },
  celebrating: { look: "happy",  mood: "big",   tilt: 0,  motion: "mg-hop",     glow: 1,    acc: "spark",  gaze: [0, 0] },
  resting:     { look: "sleepy", mood: "soft",  tilt: 4,  motion: "mg-snooze",  glow: 0.65, acc: null,     gaze: [0, 0] },
  encouraging: { look: "open",   mood: "big",   tilt: 0,  motion: "mg-nudge",   glow: 0.92, acc: "spark",  gaze: [0, 0] },
  waiting:     { look: "open",   mood: "smile", tilt: 0,  motion: "mg-wait",    glow: 0.9,  acc: null,     gaze: [3, 0] },
  error:       { look: "open",   mood: "soft",  tilt: -3, motion: "mg-tilt",    glow: 0.92, acc: null,     gaze: [0, 0] },
  typing:      { look: "open",   mood: "smile", tilt: 0,  motion: "mg-breathe", glow: 0.85, acc: "type",   gaze: [0, 0] },
};

function Eye({ cx, cy, look, gaze, id }: { cx: number; cy: number; look: Look; gaze: [number, number]; id: string }) {
  if (look === "happy")
    return <path d={`M${cx - 5.4} ${cy + 1} Q${cx} ${cy - 5} ${cx + 5.4} ${cy + 1}`} stroke={C.ink} strokeWidth="2.6" strokeLinecap="round" fill="none" />;
  if (look === "sleepy")
    return <path d={`M${cx - 5.4} ${cy - 0.3} Q${cx} ${cy + 3.6} ${cx + 5.4} ${cy - 0.3}`} stroke={C.ink} strokeWidth="2.6" strokeLinecap="round" fill="none" />;
  const [gx, gy] = look === "up" ? gaze : [0, 0];
  return (
    <g>
      {/* almond iris (taller than wide, soft-pointed corners) */}
      <path
        d={`M${cx - 4.6} ${cy} Q${cx - 4.2} ${cy - 6.2} ${cx} ${cy - 6.2} Q${cx + 4.2} ${cy - 6.2} ${cx + 4.6} ${cy} Q${cx + 4.2} ${cy + 5.8} ${cx} ${cy + 5.8} Q${cx - 4.2} ${cy + 5.8} ${cx - 4.6} ${cy} Z`}
        fill={`url(#${id}-eye)`}
        transform={gx || gy ? `translate(${gx} ${gy})` : undefined}
      />
      {/* defined upper lid line — the mature cue */}
      <path d={`M${cx - 4.8} ${cy - 3.2} Q${cx} ${cy - 8} ${cx + 4.8} ${cy - 3.2}`} stroke={C.lid} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      {/* single calm catchlight */}
      <circle cx={cx - 1.5 + gx} cy={cy - 2.4 + gy} r="1.5" fill="#fff" opacity="0.92" />
    </g>
  );
}

function Nose() {
  // slim, subtle
  return (
    <g>
      <path d="M97.7 116 Q100 115.4 102.3 116 Q101.4 119.2 100 119.6 Q98.6 119.2 97.7 116 Z" fill={C.nose} opacity="0.92" />
      <ellipse cx="98.7" cy="116.8" rx="1" ry="0.7" fill={C.noseHi} opacity="0.8" />
    </g>
  );
}

function Mouth({ mood, id }: { mood: Mood; id: string }) {
  if (mood === "small")
    return <path d="M96 127 Q100 130 104 127" stroke={C.lip} strokeWidth="2.4" strokeLinecap="round" fill="none" />;
  if (mood === "soft")
    return (
      <g>
        <path d="M95 128.5 Q100 126.5 105 128.5" stroke={C.lip} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      </g>
    );
  // smile / big — a small, defined, gently-open mouth with a real lower lip
  const big = mood === "big";
  const top = big ? 125 : 126;
  const bot = big ? 133.5 : 132;
  return (
    <g>
      <clipPath id={`${id}-mouth`}>
        <path d={`M92.5 ${top} Q100 ${top - 2} 107.5 ${top} Q106 ${bot} 100 ${bot + 0.4} Q94 ${bot} 92.5 ${top} Z`} />
      </clipPath>
      <path d={`M92.5 ${top} Q100 ${top - 2} 107.5 ${top} Q106 ${bot} 100 ${bot + 0.4} Q94 ${bot} 92.5 ${top} Z`} fill={C.lip} />
      <g clipPath={`url(#${id}-mouth)`}>
        <ellipse cx="100" cy={bot} rx={big ? 5 : 4.2} ry={big ? 2.6 : 2} fill={C.mouthIn} opacity="0.9" />
        <path d={`M92.5 ${top} Q100 ${top + 1.2} 107.5 ${top}`} stroke={C.lipDk} strokeWidth="1.8" fill="none" opacity="0.55" />
      </g>
      {/* soft lower lip */}
      <path d={`M94.5 ${bot - 0.3} Q100 ${bot + 2.4} 105.5 ${bot - 0.3}`} stroke={C.lipHi} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
    </g>
  );
}

function Hand({ x, rot, id }: { x: number; rot: number; id: string }) {
  return (
    <g transform={`translate(${x} 133) rotate(${rot})`}>
      <ellipse cx="0" cy="0" rx="7.6" ry="11" fill={`url(#${id}-hand)`} />
      <ellipse cx="-2" cy="-4.5" rx="2.4" ry="3.6" fill="#fff" opacity="0.16" />
    </g>
  );
}

function Foot({ x, id }: { x: number; id: string }) {
  return (
    <g transform={`translate(${x} 169)`}>
      <ellipse cx="0" cy="0" rx="9.6" ry="6.2" fill={`url(#${id}-foot)`} />
      <ellipse cx="-2.6" cy="-2.4" rx="3.2" ry="1.9" fill="#fff" opacity="0.18" />
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
        <stop offset="0%" stopColor={C.deeper} stopOpacity="0.5" /><stop offset="60%" stopColor={C.deeper} stopOpacity="0.1" /><stop offset="100%" stopColor={C.deeper} stopOpacity="0" />
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
          <Foot x={85} id={id} />
          <Foot x={115} id={id} />
          <Hand x={49} rot={12} id={id} />
          <Hand x={151} rot={-12} id={id} />
        </>
      )}
      <path d={BODY} fill={`url(#${id}-b)`} />
      <g clipPath={`url(#${id}-clip)`}>
        <ellipse cx="79" cy="86" rx="22" ry="13" fill="#ffffff" opacity="0.24" transform="rotate(-18 79 86)" />
        <ellipse cx="142" cy="82" rx="30" ry="26" fill={`url(#${id}-glow)`} opacity={0.46} />
        <ellipse cx="100" cy="168" rx="62" ry="44" fill={`url(#${id}-occ)`} />
        <path d="M72 64 Q100 54 128 64" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" fill="none" opacity="0.32" />
      </g>
      <g>
        <Eye cx={EYE.lx} cy={EYE.cy} look={m.look} gaze={m.gaze} id={id} />
        <Eye cx={EYE.rx} cy={EYE.cy} look={m.look} gaze={m.gaze} id={id} />
        <Nose />
        <Mouth mood={m.mood} id={id} />
      </g>
    </>
  );
}

export default function MimiCreatureRefined({ state = "idle", size = 240, idle = true, avatar = false }: { state?: MimiGlowState; size?: number; idle?: boolean; avatar?: boolean }) {
  const id = `mr${useId().replace(/[:]/g, "")}`;
  const m = MAP[state];
  const motion = idle ? m.motion : "";
  const glowCls = idle ? "glow-steady" : "";

  if (avatar) {
    return (
      <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label={`Mimi (refined avatar), ${state}`} style={{ display: "block" }}>
        <Defs id={id} />
        <clipPath id={`${id}-ac`}><circle cx="60" cy="60" r="57" /></clipPath>
        <circle cx="60" cy="60" r="59" fill={`url(#${id}-frame)`} />
        <g clipPath={`url(#${id}-ac)`}>
          <g className={`mg-glow ${glowCls}`} opacity={m.glow}>
            <ellipse cx="90" cy="38" rx="34" ry="32" fill={`url(#${id}-glow)`} />
          </g>
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
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label={`Mimi (refined), ${state}`} style={{ overflow: "visible", display: "block" }}>
      <Defs id={id} />
      <ellipse cx="100" cy="178" rx="46" ry="7" fill={C.ink} opacity="0.08" />
      <g className={`mg-glow ${glowCls}`} opacity={m.glow}>
        <ellipse cx="118" cy="120" rx="68" ry="56" fill={`url(#${id}-glow)`} />
      </g>
      <g style={m.tilt ? { transform: `rotate(${m.tilt}deg)`, transformBox: "view-box", transformOrigin: "100px 150px" } : undefined}>
        <g className={`mg-body ${motion}`} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <BodyFace id={id} m={m} withLimbs />
        </g>
      </g>
      <g className={`mg-glow ${glowCls}`} opacity={m.glow}>
        <circle cx={LIGHT.x} cy={LIGHT.y} r="19" fill={`url(#${id}-glow)`} />
        <circle cx={LIGHT.x} cy={LIGHT.y} r="5.5" fill={C.core} />
        <circle cx={LIGHT.x} cy={LIGHT.y} r="3.2" fill={C.glow} />
      </g>
      {idle && <Accessory acc={m.acc} id={id} />}
    </svg>
  );
}
