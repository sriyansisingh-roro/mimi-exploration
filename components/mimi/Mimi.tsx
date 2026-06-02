"use client";

/**
 * ──────────────────────────────────────────────────────────────────────────
 *  Mimi — the companion character  (soft plush "sprout")
 * ──────────────────────────────────────────────────────────────────────────
 *
 *  WHO MIMI IS
 *  A calm, patient co-pilot for students who struggle to *start*. The whole
 *  point is to lower pressure, never raise it. Mimi is just *present*.
 *
 *  WHY A SPROUT
 *  Starting a task is like planting a seed: small, quiet, full of potential.
 *  Mimi is a plump seed-body with a green sprout on top, tiny arms and little
 *  feet — a living "we begin small and grow," no words, no judgement.
 *
 *  LOOK  (dimensional plush, not flat)
 *  Layered radial gradients + soft ambient-occlusion + a top-light sheen and a
 *  glossy hotspot read it as a soft 3D toy — all inline SVG, no assets. ONE
 *  calm lavender across every state; states read through EXPRESSION + a clear,
 *  always-present micro-motion. Sprout green + rosy cheeks are the only accents.
 *
 *  READABLE STATES  (each: a clear face tell + a clear, visible loop)
 *  - idle        → round eyes + soft smile; breath + sprout sway + arm sway.
 *  - listening   → curious raised brows + gaze up; attentive lean sway, the
 *                  sprout perks, the arms lift out, sound-wave ripples.
 *  - thinking    → small pursed mouth + gaze up; a clear bob, the sprout
 *                  droops aside, a hand lifts, a pair of twinkling sparkles.
 *  - celebrating → happy ^_^ eyes + open smile; a squash-&-stretch hop, both
 *                  arms wave up, the sprout bounces, a heart drifts up.
 *  - resting     → eyes fully closed + peaceful mouth; a slow sleepy sink, the
 *                  sprout nods over, two "z"s drift up. Leaned aside, FULL colour.
 *  - concerned   → caring brows + bigger soft eyes; the quietest slow breath,
 *                  arms drawn gently in (calm itself is the signal).
 *
 *  ANIMATION  (Framer Motion)
 *  Body loops use scaleX/scaleY (never the `scale` shorthand) so squash-&-stretch
 *  composes cleanly. The body pivots from its BASE (bottom-centre) so breath,
 *  lean and hop feel grounded; the sprout and arms pivot from their own joints
 *  for true secondary motion. `prefers-reduced-motion` collapses every loop.
 * ──────────────────────────────────────────────────────────────────────────
 */

import { useId } from "react";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import type { MimiProps, MimiState } from "./types";

/* ── palette ───────────────────────────────────────────────────────────── */
const C = {
  bodyHi: "#E2DDFB",
  bodyMid: "#C4B9F4",
  bodyLo: "#A89AE6",
  formShade: "#5E4E97",
  ao: "#6E5CA8",
  frontLight: "#FFFFFF",
  armLo: "#9A8BDD",
  leafHi: "#A9E6A0",
  leafLo: "#69BD6E",
  leafVein: "#4F9E58",
  stem: "#6FBF73",
  cheek: "#F3A8C4",
  ink: "#3A3357",
} as const;

/* ── geometry (200×200 viewBox) ────────────────────────────────────────── */
const BODY =
  "M100 38 C133 38 159 64 161 100 C163 139 140 178 100 178 C60 178 37 139 39 100 C41 64 67 38 100 38 Z";

// sprout — a group pivoting from its base at 100,41
const STEM = "M100 41 C99 34 100 28 100 23";
const LEAF_L = "M100 27 C91 25 82 18 83 11 C90 9 99 18 100 27 Z";
const LEAF_R = "M100 27 C109 25 118 18 117 11 C110 9 101 18 100 27 Z";
const VEIN_L = "M99 24 Q92 19 85 13";
const VEIN_R = "M101 24 Q108 19 115 13";

// little arms (rounded paddles) — pivot from the shoulder
const ARM_L = "M50 113 C41 115 35 126 38 138 C40 145 48 145 50 137 C52 127 52 119 50 113 Z";
const ARM_R = "M150 113 C159 115 165 126 162 138 C160 145 152 145 150 137 C148 127 148 119 150 113 Z";
const ARM_PIVOT = { l: "50px 115px", r: "150px 115px" } as const;
// per-state arm pose (degrees from straight-down). +ve raises the L arm outward; R is mirrored.
const ARM_POSE: Record<string, { l: number; r: number }> = {
  idle: { l: 10, r: -10 },
  listening: { l: 50, r: -50 },
  thinking: { l: 8, r: -44 },
  celebrating: { l: 108, r: -108 },
  resting: { l: 16, r: -16 },
  concerned: { l: 26, r: -26 },
};
// per-state sprout lean (degrees), pivot at the base of the stem
const SPROUT_POSE: Record<string, number> = {
  idle: 0,
  listening: 12,
  thinking: -14,
  celebrating: 8,
  resting: 18,
  concerned: -5,
};

// little feet (peek out the bottom)
const FOOT_L = { cx: 85, cy: 179, rx: 12, ry: 6.5 };
const FOOT_R = { cx: 115, cy: 179, rx: 12, ry: 6.5 };

const EYE_L = { cx: 80, cy: 105, rx: 9, ry: 10.4 };
const EYE_R = { cx: 120, cy: 105, rx: 9, ry: 10.4 };

const HAPPY_L = "M71 107 Q80 98 89 107";
const HAPPY_R = "M111 107 Q120 98 129 107";
// fully-closed sleepy lids — clearly shut (deeper downward curve + lashes)
const SLEEPY_L = "M70 104 Q80 112 90 104";
const SLEEPY_R = "M110 104 Q120 112 130 104";
// caring brows (concerned): inner ends gently raised → tender, never angry
const CARE_BROW_L = "M71 90 Q80 84 89 88";
const CARE_BROW_R = "M111 88 Q120 84 129 90";
// curious brows (listening): both lifted high & even → alert, interested
const CURIOUS_BROW_L = "M71 86 Q80 81 89 85";
const CURIOUS_BROW_R = "M111 85 Q120 81 129 86";

// Mouths — every variant only ever bows UP or stays neutral; no frown by design.
const MOUTH = {
  gentle: "M91 124 Q100 130 109 124",
  smile: "M87 123 Q100 138 113 123",
  relaxed: "M93 125 Q100 128 107 125",
  soft: "M94 126 Q100 129 106 126",
  think: "M95 126 Q100 128 105 126", // small, pursed
} as const;

const WAVES = ["M166 92 Q174 100 166 108", "M172 87 Q183 100 172 113", "M178 82 Q191 100 178 118"];

type Anim = { animate: Record<string, number | number[]>; transition: Transition };
type EyeMode = "open" | "happy" | "sleepy";
type BrowMode = "none" | "caring" | "curious";

interface StateConfig {
  root: Anim;
  body: Anim;
  sprout: Anim;
  armL: Anim;
  armR: Anim;
  blink: Anim;
  eyesScale: number;
  gaze: Anim;
  brows: Anim;
  browMode: BrowMode;
  cheeks: Anim;
  eyeMode: EyeMode;
  mouth: string;
  sparkle: boolean;
  waves: boolean;
  heart: boolean;
  zzz: boolean;
}

const loop = (t: Transition): Transition => ({ repeat: Infinity, ...t });
const SETTLE = { duration: 0.55, ease: "easeInOut" as const, repeat: 0 };
const settleLean = { rotate: SETTLE, y: SETTLE };

const blinkAnim = (period: number): Anim => ({
  animate: { scaleY: [1, 1, 0.1, 1, 1] },
  transition: loop({ duration: period, times: [0, 0.9, 0.945, 0.99, 1], ease: "easeInOut" }),
});

function getConfig(state: MimiState): StateConfig {
  const base: StateConfig = {
    root: { animate: { opacity: 1, x: 0, rotate: 0 }, transition: { duration: 0.6, ease: "easeInOut" } },
    body: { animate: { y: 0, scaleX: 1, scaleY: 1, rotate: 0 }, transition: { duration: 0.6, ease: "easeInOut" } },
    sprout: { animate: { rotate: 0 }, transition: { duration: 0.6, ease: "easeInOut" } },
    armL: { animate: { rotate: 0 }, transition: { duration: 0.6, ease: "easeInOut" } },
    armR: { animate: { rotate: 0 }, transition: { duration: 0.6, ease: "easeInOut" } },
    blink: { animate: { scaleY: 1 }, transition: { duration: 0.3 } },
    eyesScale: 1,
    gaze: { animate: { x: 0, y: 0 }, transition: { duration: 0.5, ease: "easeInOut" } },
    brows: { animate: { opacity: 0, y: 0 }, transition: { duration: 0.45, ease: "easeInOut" } },
    browMode: "none",
    cheeks: { animate: { opacity: 0.55 }, transition: { duration: 0.6 } },
    eyeMode: "open",
    mouth: MOUTH.gentle,
    sparkle: false,
    waves: false,
    heart: false,
    zzz: false,
  };

  switch (state) {
    case "idle":
      return {
        ...base,
        body: {
          animate: { y: [0, -3.5, 0], scaleX: [1, 0.99, 1], scaleY: [1, 1.045, 1], rotate: 0 },
          transition: loop({ duration: 3.4, ease: "easeInOut", ...settleLean }),
        },
        sprout: { animate: { rotate: [-8, 8, -8] }, transition: loop({ duration: 4.4, ease: "easeInOut" }) },
        armL: { animate: { rotate: [-4, 6, -4] }, transition: loop({ duration: 3.8, ease: "easeInOut" }) },
        armR: { animate: { rotate: [4, -6, 4] }, transition: loop({ duration: 3.8, ease: "easeInOut" }) },
        blink: blinkAnim(4.6),
      };

    case "listening":
      return {
        ...base,
        body: {
          animate: { rotate: [-9, -3, -9], y: 0, scaleX: 1, scaleY: 1.02 },
          transition: loop({ duration: 3.2, ease: "easeInOut" }),
        },
        sprout: { animate: { rotate: [7, 15, 7] }, transition: loop({ duration: 2, ease: "easeInOut" }) },
        // arms lift out to the sides and wiggle — attentive, perky
        armL: { animate: { rotate: [22, 30, 22] }, transition: loop({ duration: 2.2, ease: "easeInOut" }) },
        armR: { animate: { rotate: [-22, -30, -22] }, transition: loop({ duration: 2.2, ease: "easeInOut" }) },
        gaze: { animate: { x: 1, y: -2 }, transition: { duration: 0.6, ease: "easeInOut" } },
        brows: { animate: { opacity: 0.9, y: 0 }, transition: { duration: 0.45, ease: "easeInOut" } },
        browMode: "curious",
        blink: blinkAnim(5),
        waves: true,
      };

    case "thinking":
      return {
        ...base,
        body: {
          animate: { y: [0, -7, 0], scaleX: 1, scaleY: 1, rotate: [0, 2, 0, -2, 0] },
          transition: loop({ duration: 2.8, ease: "easeInOut" }),
        },
        sprout: { animate: { rotate: [-10, -18, -10] }, transition: loop({ duration: 2.4, ease: "easeInOut" }) },
        // right hand lifts up, left arm idles
        armL: { animate: { rotate: [-4, 4, -4] }, transition: loop({ duration: 3.4, ease: "easeInOut" }) },
        armR: { animate: { rotate: [-14, -22, -14] }, transition: loop({ duration: 2.4, ease: "easeInOut" }) },
        gaze: { animate: { x: 3, y: -3 }, transition: { duration: 0.6, ease: "easeInOut" } },
        mouth: MOUTH.think,
        blink: blinkAnim(5.4),
        sparkle: true,
      };

    case "celebrating":
      return {
        ...base,
        body: {
          animate: {
            y: [0, 3, -16, 0, -5, 0],
            scaleX: [1, 1.07, 0.94, 1.09, 1, 1],
            scaleY: [1, 0.94, 1.08, 0.91, 1.02, 1],
            rotate: 0,
          },
          transition: loop({ duration: 2.1, times: [0, 0.1, 0.34, 0.56, 0.74, 1], ease: "easeOut", rotate: SETTLE }),
        },
        sprout: { animate: { rotate: [-13, 13, -13] }, transition: loop({ duration: 0.55, ease: "easeInOut" }) },
        // both arms thrown up and waving
        armL: { animate: { rotate: [118, 132, 118] }, transition: loop({ duration: 0.55, ease: "easeInOut" }) },
        armR: { animate: { rotate: [-118, -132, -118] }, transition: loop({ duration: 0.55, ease: "easeInOut" }) },
        cheeks: { animate: { opacity: 0.95 }, transition: { duration: 0.6 } },
        eyeMode: "happy",
        mouth: MOUTH.smile,
        heart: true,
      };

    case "resting":
      return {
        ...base,
        // leaned aside at FULL colour — a clear slow sleepy sink + nod-over
        root: { animate: { opacity: 0.96, x: 8, rotate: 3 }, transition: { duration: 0.8, ease: "easeInOut" } },
        body: {
          animate: { y: [0, 5, 0], scaleX: [1, 1.025, 1], scaleY: [1, 0.98, 1], rotate: [0, 2.5, 0] },
          transition: loop({ duration: 4.4, ease: "easeInOut", rotate: { duration: 4.4, ease: "easeInOut", repeat: Infinity }, y: { duration: 4.4, ease: "easeInOut", repeat: Infinity } }),
        },
        // sprout nods right over, sleepy
        sprout: { animate: { rotate: [14, 22, 14] }, transition: loop({ duration: 4, ease: "easeInOut" }) },
        armL: { animate: { rotate: [10, 14, 10] }, transition: loop({ duration: 4.4, ease: "easeInOut" }) },
        armR: { animate: { rotate: [-10, -14, -10] }, transition: loop({ duration: 4.4, ease: "easeInOut" }) },
        cheeks: { animate: { opacity: 0.45 }, transition: { duration: 0.6 } },
        eyeMode: "sleepy",
        mouth: MOUTH.relaxed,
        zzz: true,
      };

    case "concerned":
      return {
        ...base,
        body: {
          animate: { y: [0, -1.5, 0], scaleX: 1, scaleY: [1, 1.018, 1], rotate: 0 },
          transition: loop({ duration: 5.2, ease: "easeInOut", ...settleLean }),
        },
        sprout: { animate: { rotate: [-3, 3, -3] }, transition: loop({ duration: 5, ease: "easeInOut" }) },
        // arms drawn gently inward — a small, caring "holding" posture
        armL: { animate: { rotate: [8, 11, 8] }, transition: loop({ duration: 5, ease: "easeInOut" }) },
        armR: { animate: { rotate: [-8, -11, -8] }, transition: loop({ duration: 5, ease: "easeInOut" }) },
        eyesScale: 1.1,
        brows: { animate: { opacity: 0.9, y: 0 }, transition: { duration: 0.6, ease: "easeInOut" } },
        browMode: "caring",
        cheeks: { animate: { opacity: 0.5 }, transition: { duration: 0.6 } },
        mouth: MOUTH.soft,
        blink: blinkAnim(6),
      };
  }
}

/** Collapse looping keyframes to a calm static pose for reduced-motion users. */
function staticize(anim: Anim): Anim {
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(anim.animate)) {
    out[k] = Array.isArray(v) ? v[v.length - 1] : v;
  }
  if ("scaleY" in out) out.scaleY = 1;
  return { animate: out, transition: { duration: 0.4, ease: "easeInOut" } };
}

const DEFAULT_LABEL: Record<MimiState, string> = {
  idle: "Mimi, resting quietly with you",
  listening: "Mimi, listening",
  thinking: "Mimi, thinking",
  celebrating: "Mimi, gently pleased",
  resting: "Mimi, taking a rest",
  concerned: "Mimi, here and calm",
};

export default function Mimi({
  state = "idle",
  size = 200,
  className,
  "aria-label": ariaLabel,
}: MimiProps) {
  const reduce = useReducedMotion();
  const uid = useId().replace(/[:]/g, "");
  const raw = getConfig(state);

  const cfg: StateConfig = reduce
    ? {
        ...raw,
        root: staticize(raw.root),
        body: staticize(raw.body),
        sprout: staticize(raw.sprout),
        armL: staticize(raw.armL),
        armR: staticize(raw.armR),
        blink: staticize(raw.blink),
        gaze: staticize(raw.gaze),
        brows: staticize(raw.brows),
        cheeks: staticize(raw.cheeks),
      }
    : raw;

  const id = (n: string) => `${n}-${uid}`;
  const openEyes = cfg.eyeMode === "open";
  const happyEyes = cfg.eyeMode === "happy";
  const sleepy = cfg.eyeMode === "sleepy";
  const caring = cfg.browMode === "caring";
  const curious = cfg.browMode === "curious";
  // CSS-driven cross-fade for expression layers (framer's opacity channel is
  // unreliable under many concurrent animations; transforms stay on framer).
  const fade = (s: number) => (reduce ? "none" : `opacity ${s}s ease`);
  // opacity config may be a number or keyframe array; take a single value for CSS.
  const op = (v: number | number[] | undefined, fallback: number) =>
    v === undefined ? fallback : Array.isArray(v) ? v[v.length - 1] : v;

  return (
    <motion.svg
      role="img"
      aria-label={ariaLabel ?? DEFAULT_LABEL[state]}
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      style={{ overflow: "visible", transformOrigin: "center" }}
      animate={cfg.root.animate}
      transition={cfg.root.transition}
    >
      <defs>
        <radialGradient id={id("body")} cx="38%" cy="28%" r="82%">
          <stop offset="0%" stopColor={C.bodyHi} />
          <stop offset="48%" stopColor={C.bodyMid} />
          <stop offset="100%" stopColor={C.bodyLo} />
        </radialGradient>
        <radialGradient id={id("form")} cx="50%" cy="44%" r="64%">
          <stop offset="58%" stopColor={C.formShade} stopOpacity="0" />
          <stop offset="100%" stopColor={C.formShade} stopOpacity="0.3" />
        </radialGradient>
        <radialGradient id={id("arm")} cx="40%" cy="25%" r="85%">
          <stop offset="0%" stopColor={C.bodyMid} />
          <stop offset="100%" stopColor={C.armLo} />
        </radialGradient>
        <linearGradient id={id("leaf")} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor={C.leafHi} />
          <stop offset="100%" stopColor={C.leafLo} />
        </linearGradient>
        <filter id={id("blur")} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <filter id={id("blurS")} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1.7" />
        </filter>
        <clipPath id={id("bodyclip")}>
          <path d={BODY} />
        </clipPath>
      </defs>

      {/* Floating-particle keyframes — CSS-driven so they animate reliably
          (framer's opacity channel stalls under many concurrent loops). */}
      <style>{`
        /* thinking sparkle — a soft star that blinks in, twinkles, fades out */
        @keyframes mimiSparkle {
          0%   { opacity: 0;   transform: scale(0.2) rotate(-25deg); }
          35%  { opacity: 1;   transform: scale(1) rotate(0deg); }
          65%  { opacity: 0.9; transform: scale(0.85) rotate(8deg); }
          100% { opacity: 0;   transform: scale(0.2) rotate(25deg); }
        }
        @keyframes mimiZ1 {
          0%   { opacity: 0;    transform: translateY(0) scale(0.7); }
          35%  { opacity: 0.85; transform: translateY(-12px) scale(1); }
          100% { opacity: 0;    transform: translateY(-22px) scale(0.9); }
        }
        @keyframes mimiZ2 {
          0%   { opacity: 0;   transform: translateY(0) scale(0.7); }
          35%  { opacity: 0.9; transform: translateY(-16px) scale(1); }
          100% { opacity: 0;   transform: translateY(-30px) scale(0.95); }
        }
        @keyframes mimiHeart {
          0%   { opacity: 0;    transform: translateY(6px) scale(0.7); }
          35%  { opacity: 0.95; transform: translateY(-18px) scale(1); }
          100% { opacity: 0;    transform: translateY(-44px) scale(0.9); }
        }
        @keyframes mimiWave {
          0%, 100% { opacity: 0.18; transform: translateX(0); }
          50%      { opacity: 0.62; transform: translateX(2.5px); }
        }
        @keyframes mimiWiggle {
          0%, 100% { transform: rotate(-2.5deg); }
          50%      { transform: rotate(2.5deg); }
        }
        @keyframes mimiWiggleSprout {
          0%, 100% { transform: rotate(-2deg); }
          50%      { transform: rotate(2deg); }
        }
      `}</style>

      {/* soft ground shadow — stays planted (doesn't lift with the hop) */}
      <ellipse cx={100} cy={189} rx={46} ry={8} fill={C.ao} opacity={0.16} filter={`url(#${id("blur")})`} />

      {/* thinking — a soft pair of twinkling sparkles near the head */}
      <g>
        {/* main sparkle (4-point star) */}
        <path
          d="M152 39 L155.3 46.7 L163 50 L155.3 53.3 L152 61 L148.7 53.3 L141 50 L148.7 46.7 Z"
          fill={C.bodyLo}
          style={{
            transformBox: "fill-box",
            transformOrigin: "center",
            opacity: reduce ? (cfg.sparkle ? 0.9 : 0) : 0,
            animation: cfg.sparkle && !reduce ? "mimiSparkle 2.2s ease-in-out infinite" : "none",
          }}
        />
        {/* smaller companion sparkle, offset + delayed so the two blink in turn */}
        <path
          d="M170 58 L171.8 62.2 L176 64 L171.8 65.8 L170 70 L168.2 65.8 L164 64 L168.2 62.2 Z"
          fill={C.bodyMid}
          style={{
            transformBox: "fill-box",
            transformOrigin: "center",
            opacity: reduce ? (cfg.sparkle ? 0.7 : 0) : 0,
            animation: cfg.sparkle && !reduce ? "mimiSparkle 2.2s ease-in-out 1.1s infinite" : "none",
          }}
        />
      </g>

      {/* resting "z" (small, leads) */}
      <text
        x={138}
        y={70}
        textAnchor="middle"
        fontSize={15}
        fontWeight={700}
        fontStyle="italic"
        fontFamily="ui-rounded, system-ui, sans-serif"
        fill={C.bodyLo}
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          opacity: 0,
          animation: cfg.zzz && !reduce ? "mimiZ1 2.8s ease-out infinite" : "none",
        }}
      >
        z
      </text>
      {/* resting "z" (big, trails) */}
      <text
        x={150}
        y={58}
        textAnchor="middle"
        fontSize={22}
        fontWeight={700}
        fontStyle="italic"
        fontFamily="ui-rounded, system-ui, sans-serif"
        fill={C.bodyLo}
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          opacity: 0,
          animation: cfg.zzz && !reduce ? "mimiZ2 2.8s ease-out 1.1s infinite" : "none",
        }}
      >
        z
      </text>

      {/* listening sound-waves */}
      <g>
        {WAVES.map((d, i) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke={C.bodyLo}
            strokeWidth={2.4}
            strokeLinecap="round"
            style={{
              transformBox: "fill-box",
              transformOrigin: "center",
              opacity: reduce ? (cfg.waves ? 0.5 : 0) : 0,
              animation: cfg.waves && !reduce ? `mimiWave 2.4s ease-in-out ${i * 0.5}s infinite` : "none",
            }}
          />
        ))}
      </g>

      {/* celebrating heart */}
      <path
        d="M100 96 C97.5 91 90 91 90 86 C90 82.5 94 81.5 97 84 C98.5 85 99.5 87 100 88 C100.5 87 101.5 85 103 84 C106 81.5 110 82.5 110 86 C110 91 102.5 91 100 96 Z"
        fill={C.cheek}
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          opacity: 0,
          animation: cfg.heart && !reduce ? "mimiHeart 2.6s ease-out infinite" : "none",
        }}
      />

      {/* body group — pivots from its BASE so breath / lean / hop feel grounded */}
      <motion.g
        animate={cfg.body.animate}
        transition={cfg.body.transition}
        style={{ transformBox: "view-box", transformOrigin: "100px 178px" }}
      >
        {/* feet (behind body, peeking out the bottom) */}
        <ellipse cx={FOOT_L.cx} cy={FOOT_L.cy + 4} rx={FOOT_L.rx - 2} ry={3} fill={C.ao} opacity={0.14} filter={`url(#${id("blurS")})`} />
        <ellipse cx={FOOT_R.cx} cy={FOOT_R.cy + 4} rx={FOOT_R.rx - 2} ry={3} fill={C.ao} opacity={0.14} filter={`url(#${id("blurS")})`} />
        <ellipse cx={FOOT_L.cx} cy={FOOT_L.cy} rx={FOOT_L.rx} ry={FOOT_L.ry} fill={`url(#${id("arm")})`} />
        <ellipse cx={FOOT_R.cx} cy={FOOT_R.cy} rx={FOOT_R.rx} ry={FOOT_R.ry} fill={`url(#${id("arm")})`} />

        {/* arms (behind body) — each rotates from its shoulder.
            Outer <g> = per-state pose (CSS transition); inner <g> = continuous wiggle.
            CSS-driven so the gesture reads reliably across renderers. */}
        <g
          style={{
            transform: `rotate(${(ARM_POSE[state] ?? ARM_POSE.idle).l}deg)`,
            transformBox: "view-box",
            transformOrigin: ARM_PIVOT.l,
            transition: reduce ? "none" : "transform 0.55s cubic-bezier(0.2,0.8,0.2,1)",
          }}
        >
          <g
            style={{
              transformBox: "view-box",
              transformOrigin: ARM_PIVOT.l,
              animation: reduce ? "none" : "mimiWiggle 2.8s ease-in-out infinite",
            }}
          >
            <path d={ARM_L} fill={`url(#${id("arm")})`} />
          </g>
        </g>
        <g
          style={{
            transform: `rotate(${(ARM_POSE[state] ?? ARM_POSE.idle).r}deg)`,
            transformBox: "view-box",
            transformOrigin: ARM_PIVOT.r,
            transition: reduce ? "none" : "transform 0.55s cubic-bezier(0.2,0.8,0.2,1)",
          }}
        >
          <g
            style={{
              transformBox: "view-box",
              transformOrigin: ARM_PIVOT.r,
              animation: reduce ? "none" : "mimiWiggle 2.8s ease-in-out infinite reverse",
            }}
          >
            <path d={ARM_R} fill={`url(#${id("arm")})`} />
          </g>
        </g>

        {/* sprout (drawn before body so its base tucks under the crown) —
            outer <g> = per-state lean (CSS transition); inner <g> = gentle continuous sway. */}
        <g
          style={{
            transform: `rotate(${SPROUT_POSE[state] ?? 0}deg)`,
            transformBox: "view-box",
            transformOrigin: "100px 41px",
            transition: reduce ? "none" : "transform 0.6s cubic-bezier(0.2,0.8,0.2,1)",
          }}
        >
          <g
            style={{
              transformBox: "view-box",
              transformOrigin: "100px 41px",
              animation: reduce ? "none" : "mimiWiggleSprout 3.4s ease-in-out infinite",
            }}
          >
            <path d={STEM} stroke={C.stem} strokeWidth={4} strokeLinecap="round" fill="none" />
            <path d={LEAF_L} fill={`url(#${id("leaf")})`} />
            <path d={LEAF_R} fill={`url(#${id("leaf")})`} />
            <path d={VEIN_L} stroke={C.leafVein} strokeWidth={1.1} strokeLinecap="round" fill="none" opacity={0.7} />
            <path d={VEIN_R} stroke={C.leafVein} strokeWidth={1.1} strokeLinecap="round" fill="none" opacity={0.7} />
            {/* little center bud */}
            <ellipse cx={100} cy={19} rx={2.6} ry={3.2} fill={C.leafHi} />
            {/* leaf sheen */}
            <ellipse cx={90} cy={16} rx={3} ry={1.6} fill="#ffffff" opacity={0.45} transform="rotate(-30 90 16)" />
            <ellipse cx={110} cy={16} rx={3} ry={1.6} fill="#ffffff" opacity={0.4} transform="rotate(30 110 16)" />
          </g>
        </g>

        {/* body + form shading + sheens */}
        <path d={BODY} fill={`url(#${id("body")})`} />
        <path d={BODY} fill={`url(#${id("form")})`} />
        <g clipPath={`url(#${id("bodyclip")})`}>
          <ellipse cx={100} cy={184} rx={60} ry={26} fill={C.formShade} opacity={0.26} filter={`url(#${id("blur")})`} />
          <ellipse cx={100} cy={140} rx={42} ry={34} fill={C.frontLight} opacity={0.32} filter={`url(#${id("blur")})`} />
          <ellipse cx={74} cy={66} rx={30} ry={18} fill="#ffffff" opacity={0.5} filter={`url(#${id("blur")})`} transform="rotate(-20 74 66)" />
          <ellipse cx={70} cy={62} rx={11} ry={7} fill="#ffffff" opacity={0.55} filter={`url(#${id("blurS")})`} transform="rotate(-20 70 62)" />
          <ellipse cx={100} cy={44} rx={16} ry={7} fill={C.formShade} opacity={0.22} filter={`url(#${id("blur")})`} />
        </g>

        {/* rosy cheeks — opacity is React-driven (CSS fade) for reliable cross-state switching */}
        <g style={{ opacity: op(cfg.cheeks.animate.opacity, 0.55), transition: fade(0.5) }}>
          <ellipse cx={63} cy={119} rx={9.5} ry={6} fill={C.cheek} filter={`url(#${id("blurS")})`} />
          <ellipse cx={137} cy={119} rx={9.5} ry={6} fill={C.cheek} filter={`url(#${id("blurS")})`} />
        </g>

        {/* caring brows (concerned) */}
        <g style={{ opacity: caring ? op(cfg.brows.animate.opacity, 0.9) : 0, transition: fade(0.45) }}>
          <path d={CARE_BROW_L} stroke={C.ink} strokeWidth={3} strokeLinecap="round" fill="none" />
          <path d={CARE_BROW_R} stroke={C.ink} strokeWidth={3} strokeLinecap="round" fill="none" />
        </g>
        {/* curious brows (listening) */}
        <g style={{ opacity: curious ? op(cfg.brows.animate.opacity, 0.9) : 0, transition: fade(0.45) }}>
          <path d={CURIOUS_BROW_L} stroke={C.ink} strokeWidth={2.8} strokeLinecap="round" fill="none" />
          <path d={CURIOUS_BROW_R} stroke={C.ink} strokeWidth={2.8} strokeLinecap="round" fill="none" />
        </g>

        {/* open eyes — CSS-driven opacity gate; framer drives only the scale/gaze/blink transforms */}
        <g style={{ opacity: openEyes ? 1 : 0, transition: fade(0.4) }}>
          <motion.g
            className="mimi-pivot"
            animate={{ scale: openEyes ? cfg.eyesScale : 1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <motion.g animate={cfg.gaze.animate} transition={cfg.gaze.transition}>
              <motion.g className="mimi-pivot" animate={cfg.blink.animate} transition={cfg.blink.transition}>
                <ellipse cx={EYE_L.cx} cy={EYE_L.cy} rx={EYE_L.rx} ry={EYE_L.ry} fill={C.ink} />
                <ellipse cx={EYE_R.cx} cy={EYE_R.cy} rx={EYE_R.rx} ry={EYE_R.ry} fill={C.ink} />
                <circle cx={EYE_L.cx - 3} cy={EYE_L.cy - 3.6} r={3.4} fill="#ffffff" />
                <circle cx={EYE_R.cx - 3} cy={EYE_R.cy - 3.6} r={3.4} fill="#ffffff" />
                <circle cx={EYE_L.cx + 2.8} cy={EYE_L.cy + 3.6} r={1.6} fill="#ffffff" opacity={0.75} />
                <circle cx={EYE_R.cx + 2.8} cy={EYE_R.cy + 3.6} r={1.6} fill="#ffffff" opacity={0.75} />
              </motion.g>
            </motion.g>
          </motion.g>
        </g>

        {/* happy closed eyes (celebrating) */}
        <g style={{ opacity: happyEyes ? 1 : 0, transition: fade(0.35) }}>
          <path d={HAPPY_L} stroke={C.ink} strokeWidth={3.4} strokeLinecap="round" fill="none" />
          <path d={HAPPY_R} stroke={C.ink} strokeWidth={3.4} strokeLinecap="round" fill="none" />
        </g>

        {/* sleepy closed lids (resting) + tiny lashes */}
        <g style={{ opacity: sleepy ? 1 : 0, transition: fade(0.35) }}>
          <path d={SLEEPY_L} stroke={C.ink} strokeWidth={3.2} strokeLinecap="round" fill="none" />
          <path d={SLEEPY_R} stroke={C.ink} strokeWidth={3.2} strokeLinecap="round" fill="none" />
          <path d="M90 106 l4 2" stroke={C.ink} strokeWidth={2} strokeLinecap="round" fill="none" />
          <path d="M110 106 l-4 2" stroke={C.ink} strokeWidth={2} strokeLinecap="round" fill="none" />
        </g>

        {/* mouth */}
        <motion.path
          d={MOUTH.gentle}
          animate={{ d: cfg.mouth }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          stroke={C.ink}
          strokeWidth={3.2}
          strokeLinecap="round"
          fill="none"
        />
      </motion.g>
    </motion.svg>
  );
}
