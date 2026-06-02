"use client";

/**
 * ──────────────────────────────────────────────────────────────────────────
 *  Mimi — the companion character
 * ──────────────────────────────────────────────────────────────────────────
 *
 *  WHO MIMI IS
 *  A calm, patient co-pilot for students who struggle to *start*. The whole
 *  point is to lower pressure, never raise it. Every choice leans soft:
 *  nothing here cheers, scolds, or performs. Mimi is just *present*.
 *
 *  SHAPE LANGUAGE  (why it looks like this)
 *  - One rounded "squircle" blob. No limbs, no animal cues, no human cues —
 *    deliberately ambiguous so no one reads species, gender, or judgement
 *    into it. Ambiguity = emotional safety.
 *  - Big eyes + a tiny, always-gentle mouth. The eyes carry the warmth; the
 *    mouth NEVER turns down. There is no frown path in this file by design —
 *    "concerned" is care, not disappointment.
 *
 *  READABLE STATES  (each has ONE clear tell, so they never blur together)
 *  - idle        → upright + breathing + occasional blink. The baseline.
 *  - listening   → head TILT + pulsing sound-wave arcs beside the head +
 *                  eyes glance up. ("I'm tuned in to you.")
 *  - thinking    → soft bob + a quiet sparkle near the head.
 *  - celebrating → small smile + one soft hop (never a big reaction).
 *  - resting     → sleepy closed lids, drifted aside, low opacity.
 *  - concerned   → BIGGER soft eyes + gentle caring brows + muted color,
 *                  held very still. ("I'm quietly here for you.")
 *
 *  COLOR  (theme-driven, never hardcoded)
 *  Body fill is a CSS variable from the Tailwind v4 theme and cross-fades on
 *  state change (.mimi-body transition in globals.css):
 *    calm/idle → --color-primary · listening → warmer · thinking → a touch
 *    warmer · celebrating → --color-accent · resting/concerned → --color-muted.
 *  Eyes / mouth / brows use --color-ink.
 *
 *  ANIMATION  (Framer Motion)
 *  Small, slow, looping micro-motions (2–5s). Transitions tween automatically.
 *  `prefers-reduced-motion` collapses every loop to a calm static pose.
 * ──────────────────────────────────────────────────────────────────────────
 */

import { motion, useReducedMotion, type Transition } from "framer-motion";
import type { MimiProps, MimiState } from "./types";

/* ---- static geometry (200×200 viewBox) ---- */
const BODY =
  "M100 44 C138 44 168 72 168 106 C168 140 138 168 100 168 C62 168 32 140 32 106 C32 72 62 44 100 44 Z";

const EYE_L = { cx: 78, cy: 101 };
const EYE_R = { cx: 122, cy: 101 };
const EYE_WHITE_R = 15;
const PUPIL_R = 8.5;

// Closed/sleepy lids (resting only). Soft, peaceful — not sad.
const LID_L = "M68 101 Q78 108 88 101";
const LID_R = "M112 101 Q122 108 132 101";

// Gentle CARING brows (concerned only): soft raised arcs above the eyes.
// Middle slightly higher than the ends → reads tender/empathetic, never angry
// or sad (sad brows angle steeply inward; these are calm rounded curves).
const BROW_L = "M67 83 Q78 77 89 82";
const BROW_R = "M111 82 Q122 77 133 83";

// Sound-wave arcs beside the head (listening only) — the unmistakable
// "I'm listening" signal. Three nested ")" ripples, all positioned to the
// RIGHT of the body (body right edge is x=168) so none get hidden behind it.
const WAVES = ["M171 93 Q179 101 171 109", "M178 89 Q188 101 178 113", "M185 85 Q197 101 185 117"];

/**
 * Mouth variants. EVERY variant smiles or stays neutral-soft: the control
 * point's y is always >= the endpoints', so the curve only bows downward in
 * the middle (a ‿). There is intentionally no frown.
 */
const MOUTH = {
  gentle: "M88 130 Q100 136 112 130",
  smile: "M85 129 Q100 143 115 129",
  relaxed: "M92 131 Q100 134 108 131",
  // concerned: a very small, soft mouth — barely an upturn (still never a
  // frown: control y stays >= the endpoints), so it reads quieter/tender and
  // is clearly distinct from idle's wider gentle smile.
  soft: "M94 132 Q100 134 106 132",
} as const;

/* ---- per-state body fill (all via theme vars, no hex) ---- */
const BODY_FILL: Record<MimiState, string> = {
  idle: "var(--color-primary)",
  listening: "color-mix(in oklab, var(--color-primary) 78%, var(--color-accent))",
  thinking: "color-mix(in oklab, var(--color-primary) 90%, var(--color-accent))",
  celebrating: "var(--color-accent)",
  resting: "var(--color-muted)",
  // gently quieter than idle — still clearly Mimi, just a softer presence
  concerned: "color-mix(in oklab, var(--color-primary) 74%, var(--color-muted))",
};

const DEFAULT_LABEL: Record<MimiState, string> = {
  idle: "Mimi, resting quietly with you",
  listening: "Mimi, listening",
  thinking: "Mimi, thinking",
  celebrating: "Mimi, gently pleased",
  resting: "Mimi, taking a rest",
  concerned: "Mimi, here and calm",
};

type Anim = { animate: Record<string, number | number[]>; transition: Transition };

interface StateConfig {
  root: Anim; // whole-character offset / opacity / lean
  body: Anim; // breathing / bob / hop / tilt
  eyes: Anim; // open-eye group opacity + scale (bigger = softer/caring)
  pupils: Anim; // gaze direction + size
  blink: Anim; // eyelid scaleY
  brows: Anim; // caring brows opacity
  cheeks: Anim; // coral warmth opacity
  mouth: string;
  lidsOpen: boolean; // false = show sleepy closed lids
  sparkle: boolean; // thinking
  waves: boolean; // listening
}

const loop = (t: Transition): Transition => ({ repeat: Infinity, ...t });

// Quick, even settle for position/lean props so leaving a tilted state (e.g.
// listening) snaps back upright promptly instead of inheriting a slow loop.
const SETTLE = { duration: 0.6, ease: "easeInOut" as const, repeat: 0 };
const settleLean = { rotate: SETTLE, y: SETTLE };

function getConfig(state: MimiState): StateConfig {
  const base: StateConfig = {
    root: { animate: { opacity: 1, x: 0, rotate: 0 }, transition: { duration: 0.6, ease: "easeInOut" } },
    body: { animate: { scale: 1, y: 0, rotate: 0 }, transition: { duration: 0.6, ease: "easeInOut" } },
    eyes: { animate: { opacity: 1, scale: 1 }, transition: { duration: 0.45, ease: "easeInOut" } },
    pupils: { animate: { x: 0, y: 0, scale: 1 }, transition: { duration: 0.5, ease: "easeInOut" } },
    blink: { animate: { scaleY: 1 }, transition: { duration: 0.3 } },
    brows: { animate: { opacity: 0, y: 0 }, transition: { duration: 0.45, ease: "easeInOut" } },
    cheeks: { animate: { opacity: 0.22 }, transition: { duration: 0.6 } },
    mouth: MOUTH.gentle,
    lidsOpen: true,
    sparkle: false,
    waves: false,
  };

  // NOTE: every state declares the FULL set of animated body props
  // (rotate, y, scale). Framer Motion only animates keys you list, so a state
  // that omits `rotate` would inherit the previous state's rotation — which is
  // exactly what made non-listening states appear tilted. Always reset all three.
  switch (state) {
    case "idle":
      return {
        ...base,
        // one slow, barely-perceptible breath and nothing else. No blink: a
        // calm steady gaze reads as more present and professional than a
        // repeating eye motion, and keeps idle truly quiet. (`base.blink`
        // holds the eyes open.)
        body: {
          animate: { scale: [1, 1.012, 1], y: 0, rotate: 0 },
          transition: loop({ duration: 5, ease: "easeInOut", ...settleLean }),
        },
      };

    case "listening":
      return {
        ...base,
        // a gentle, attentive lean with a very slow sway — subtle, not a
        // cartoon head-cock. (Needs a keyframe array so Framer reliably writes
        // the transform; a single constant value gets skipped on SVG groups.)
        body: {
          animate: { rotate: [-6, -4.5, -6], y: 0, scale: 1.015 },
          transition: loop({ duration: 5, ease: "easeInOut" }),
        },
        // eyes settle slightly upward toward the speaker
        pupils: {
          animate: { x: 1, y: -2, scale: 1 },
          transition: { duration: 0.6, ease: "easeInOut" },
        },
        waves: true,
      };

    case "thinking":
      return {
        ...base,
        // slow, even bob — contemplative, not jittery
        body: {
          animate: { y: [0, -3, 0], scale: 1, rotate: 0 },
          transition: loop({ duration: 2.6, ease: "easeInOut", rotate: SETTLE }),
        },
        sparkle: true,
      };

    case "celebrating":
      return {
        ...base,
        // one soft, well-damped hop — quiet pleasure, never a jump
        body: {
          animate: { y: [0, -5, 0, 0, 0], scale: [1, 1.02, 1, 1, 1], rotate: 0 },
          transition: loop({ duration: 3, times: [0, 0.16, 0.34, 0.7, 1], ease: "easeOut", rotate: SETTLE }),
        },
        cheeks: { animate: { opacity: 0.42 }, transition: { duration: 0.6 } },
        mouth: MOUTH.smile,
      };

    case "resting":
      return {
        ...base,
        // drifts a touch aside and softens — restful, not collapsed
        root: { animate: { opacity: 0.68, x: 10, rotate: 3 }, transition: { duration: 0.8, ease: "easeInOut" } },
        body: {
          animate: { scale: [1, 1.01, 1], y: 0, rotate: 0 },
          transition: loop({ duration: 6, ease: "easeInOut", ...settleLean }),
        },
        eyes: { animate: { opacity: 0, scale: 1 }, transition: { duration: 0.5, ease: "easeInOut" } },
        cheeks: { animate: { opacity: 0.12 }, transition: { duration: 0.6 } },
        mouth: MOUTH.relaxed,
        lidsOpen: false,
      };

    case "concerned":
      return {
        ...base,
        // perfectly still and upright — the calm itself is the signal
        body: {
          animate: { scale: [1, 1.006, 1], y: 0, rotate: 0 },
          transition: loop({ duration: 6.5, ease: "easeInOut", ...settleLean }),
        },
        // noticeably bigger, softer eyes — the clearest tell vs. idle, while
        // still calm (idle eyes are scale 1, these are 1.14)
        eyes: { animate: { opacity: 1, scale: 1.14 }, transition: { duration: 0.6, ease: "easeInOut" } },
        pupils: { animate: { x: 0, y: 0, scale: 1 }, transition: { duration: 0.6, ease: "easeInOut" } },
        // gentle caring brows — present but soft, never a worried frown
        brows: { animate: { opacity: 0.85, y: 0 }, transition: { duration: 0.6, ease: "easeInOut" } },
        cheeks: { animate: { opacity: 0.24 }, transition: { duration: 0.6 } },
        // a small, soft mouth instead of idle's wider smile
        mouth: MOUTH.soft,
      };
  }
}

/** Collapse looping keyframes to a calm static pose for reduced-motion users. */
function staticize(anim: Anim): Anim {
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(anim.animate)) {
    out[k] = Array.isArray(v) ? v[v.length - 1] : v;
  }
  if ("scaleY" in out) out.scaleY = 1; // keep eyes open, not mid-blink
  return { animate: out, transition: { duration: 0.4, ease: "easeInOut" } };
}

export default function Mimi({
  state = "idle",
  size = 200,
  className,
  "aria-label": ariaLabel,
}: MimiProps) {
  const reduce = useReducedMotion();
  const raw = getConfig(state);
  const cfg: StateConfig = reduce
    ? {
        ...raw,
        root: staticize(raw.root),
        body: staticize(raw.body),
        eyes: staticize(raw.eyes),
        pupils: staticize(raw.pupils),
        blink: staticize(raw.blink),
        brows: staticize(raw.brows),
        cheeks: staticize(raw.cheeks),
      }
    : raw;

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
      {/* thinking sparkle — floats steadily near the head (outside body group) */}
      <motion.g
        className="mimi-pivot"
        style={{ transformOrigin: "150px 46px" }}
        animate={
          cfg.sparkle && !reduce
            ? { opacity: [0, 1, 0.4, 1, 0], scale: [0.6, 1, 0.8, 1, 0.6] }
            : { opacity: cfg.sparkle ? 0.9 : 0, scale: 1 }
        }
        transition={cfg.sparkle && !reduce ? { repeat: Infinity, duration: 1.8, ease: "easeInOut" } : { duration: 0.3 }}
      >
        <path
          d="M150 38 C151 44 154 47 160 48 C154 49 151 52 150 58 C149 52 146 49 140 48 C146 47 149 44 150 38 Z"
          fill="var(--color-accent)"
        />
        <circle cx={163} cy={40} r={1.6} fill="var(--color-accent)" />
      </motion.g>

      {/* listening sound-waves — ripple outward beside the head (stay upright) */}
      <g>
        {WAVES.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth={2.2}
            strokeLinecap="round"
            // subtle, attentive ripple: each arc gently brightens and drifts
            // outward in turn, so it reads as "receiving sound" — calm, not a
            // bold flashing icon. All three stay faintly present (min 0.18).
            animate={
              cfg.waves && !reduce
                ? { opacity: [0.18, 0.55, 0.18], x: [0, 2.5, 0] }
                : { opacity: cfg.waves ? 0.45 : 0, x: 0 }
            }
            transition={
              cfg.waves && !reduce
                ? { repeat: Infinity, duration: 2.4, delay: i * 0.5, ease: "easeInOut" }
                : { duration: 0.3 }
            }
          />
        ))}
      </g>

      {/* body group — carries breathing / bob / hop / tilt */}
      <motion.g className="mimi-pivot" animate={cfg.body.animate} transition={cfg.body.transition}>
        <path className="mimi-body" d={BODY} style={{ fill: BODY_FILL[state] }} />

        {/* faint top highlight */}
        <ellipse cx={82} cy={80} rx={20} ry={11} fill="#ffffff" opacity={0.16} transform="rotate(-18 82 80)" />

        {/* coral cheeks — the only warm accent, kept faint */}
        <motion.g animate={cfg.cheeks.animate} transition={cfg.cheeks.transition}>
          <ellipse cx={62} cy={120} rx={9} ry={6} fill="var(--color-accent)" />
          <ellipse cx={138} cy={120} rx={9} ry={6} fill="var(--color-accent)" />
        </motion.g>

        {/* caring brows (concerned) */}
        <motion.g animate={cfg.brows.animate} transition={cfg.brows.transition}>
          <path d={BROW_L} stroke="var(--color-ink)" strokeWidth={3} strokeLinecap="round" fill="none" />
          <path d={BROW_R} stroke="var(--color-ink)" strokeWidth={3} strokeLinecap="round" fill="none" />
        </motion.g>

        {/* open eyes (scale = softness; crossfades with closed lids) */}
        <motion.g className="mimi-pivot" animate={cfg.eyes.animate} transition={cfg.eyes.transition}>
          <motion.g className="mimi-pivot" animate={cfg.blink.animate} transition={cfg.blink.transition}>
            <circle cx={EYE_L.cx} cy={EYE_L.cy} r={EYE_WHITE_R} fill="#ffffff" />
            <circle cx={EYE_R.cx} cy={EYE_R.cy} r={EYE_WHITE_R} fill="#ffffff" />
            <motion.g className="mimi-pivot" animate={cfg.pupils.animate} transition={cfg.pupils.transition}>
              <circle cx={EYE_L.cx} cy={EYE_L.cy} r={PUPIL_R} fill="var(--color-ink)" />
              <circle cx={EYE_R.cx} cy={EYE_R.cy} r={PUPIL_R} fill="var(--color-ink)" />
              <circle cx={EYE_L.cx - 3} cy={EYE_L.cy - 3.5} r={2.6} fill="#ffffff" />
              <circle cx={EYE_R.cx - 3} cy={EYE_R.cy - 3.5} r={2.6} fill="#ffffff" />
            </motion.g>
          </motion.g>
        </motion.g>

        {/* sleepy closed lids (resting) */}
        <motion.g
          animate={{ opacity: cfg.lidsOpen ? 0 : 1 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <path d={LID_L} stroke="var(--color-ink)" strokeWidth={3} strokeLinecap="round" fill="none" />
          <path d={LID_R} stroke="var(--color-ink)" strokeWidth={3} strokeLinecap="round" fill="none" />
        </motion.g>

        {/* mouth — morphs between gentle smiles only */}
        <motion.path
          d={MOUTH.gentle}
          animate={{ d: cfg.mouth }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          stroke="var(--color-ink)"
          strokeWidth={3.2}
          strokeLinecap="round"
          fill="none"
        />
      </motion.g>
    </motion.svg>
  );
}
