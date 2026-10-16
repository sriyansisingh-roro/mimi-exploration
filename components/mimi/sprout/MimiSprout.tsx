"use client";

/**
 * ──────────────────────────────────────────────────────────────────────────
 *  Mimi (Sprout) — the full character study
 * ──────────────────────────────────────────────────────────────────────────
 *
 *  Same plush "sprout" Mimi as the 6-state <Mimi /> — a plump lavender
 *  seed-body with a green sprout, tiny arms and little feet — brought up to the
 *  same finished bar as the penguin direction:
 *
 *    • TEN expressions (added happy, encouraging, empathetic, worried, caring
 *      to the original idle/listening/thinking/celebrating/resting/concerned).
 *    • FULL-BODY POSES — arms pivot from the shoulders, the sprout from its
 *      base, so each mood is a grounded gesture with secondary motion.
 *    • FRONT / SIDE / BACK views — a clean turnaround. Side is a true profile
 *      (one eye, a smile on the snout, the sprout leaning into the direction of
 *      travel); back shows the sprout splayed and the body falling into shade.
 *
 *  Ported from the Mimi Sprout.html prototype: the exact body / sprout / arm /
 *  eye geometry from the repo, rebuilt in plain SVG + CSS motion (see
 *  ./mimi-sprout.css). Reduced-motion collapses every loop.
 *
 *  <MimiSprout mood="thinking" view="front" size={220} />
 * ──────────────────────────────────────────────────────────────────────────
 */

import { useId } from "react";
import "./mimi-sprout.css";
import type { MimiMood, MoodConfig, MimiSproutProps } from "./types";

/* ── palette ───────────────────────────────────────────────────────────── */
export const SC = {
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
  tear: "#7FC9E0",
} as const;

/* ── geometry (200×200 viewBox) — from the repo ────────────────────────── */
const BODY =
  "M100 38 C133 38 159 64 161 100 C163 139 140 178 100 178 C60 178 37 139 39 100 C41 64 67 38 100 38 Z";
const STEM = "M100 41 C99 34 100 28 100 23";
const LEAF_L = "M100 27 C91 25 82 18 83 11 C90 9 99 18 100 27 Z";
const LEAF_R = "M100 27 C109 25 118 18 117 11 C110 9 101 18 100 27 Z";
const VEIN_L = "M99 24 Q92 19 85 13";
const VEIN_R = "M101 24 Q108 19 115 13";
const ARM_L = "M50 113 C41 115 35 126 38 138 C40 145 48 145 50 137 C52 127 52 119 50 113 Z";
const ARM_R = "M150 113 C159 115 165 126 162 138 C160 145 152 145 150 137 C148 127 148 119 150 113 Z";

const EYE_L = { cx: 80, cy: 105, rx: 9, ry: 10.4 };
const EYE_R = { cx: 120, cy: 105, rx: 9, ry: 10.4 };
const HAPPY_L = "M71 107 Q80 98 89 107";
const HAPPY_R = "M111 107 Q120 98 129 107";
const SLEEPY_L = "M70 104 Q80 112 90 104";
const SLEEPY_R = "M110 104 Q120 112 130 104";
const CARE_BROW_L = "M71 90 Q80 84 89 88";
const CARE_BROW_R = "M111 88 Q120 84 129 90";
const CURIOUS_BROW_L = "M71 86 Q80 81 89 85";
const CURIOUS_BROW_R = "M111 85 Q120 81 129 86";
const WORRY_BROW_L = "M71 88 Q80 82 89 87";
const WORRY_BROW_R = "M111 87 Q120 82 129 88";

const MOUTH = {
  gentle: "M91 124 Q100 130 109 124",
  smile: "M87 123 Q100 138 113 123",
  relaxed: "M93 125 Q100 128 107 125",
  soft: "M94 126 Q100 129 106 126",
  think: "M95 126 Q100 128 105 126",
  grin: "M85 122 Q100 141 115 122",
  wavy: "M92 126 Q96 123 100 126 Q104 129 108 126",
} as const;

const WAVES = ["M166 92 Q174 100 166 108", "M172 87 Q183 100 172 113", "M178 82 Q191 100 178 118"];

/* ── per-mood configuration ────────────────────────────────────────────── */
export const MOODS: Record<MimiMood, MoodConfig> = {
  happy:       { eye: "open",   brow: "none",    mouth: "grin",    cheek: 0.9,  armL: 16,  armR: -16,  sprout: 0,   motion: "s-bounce",  acc: null,       eyeScale: 1,    label: "Happy",       blurb: "Bright and warm — the everyday Mimi." },
  calm:        { eye: "open",   brow: "none",    mouth: "gentle",  cheek: 0.55, armL: 10,  armR: -10,  sprout: 0,   motion: "s-breathe", acc: null,       eyeScale: 1,    label: "Calm",        blurb: "Settled and at ease, breathing slow." },
  listening:   { eye: "open",   brow: "curious", mouth: "gentle",  cheek: 0.6,  armL: 50,  armR: -50,  sprout: 12,  motion: "s-lean",    acc: "waves",    eyeScale: 1,    gaze: [1, -2], label: "Listening",   blurb: "Ears up, leaning in, fully attentive." },
  encouraging: { eye: "happy",  brow: "none",    mouth: "smile",   cheek: 0.85, armL: 104, armR: -44,  sprout: 6,   motion: "s-noddy",   acc: "star",     eyeScale: 1,    label: "Encouraging", blurb: "“You’ve got this.” A proud little cheer." },
  thinking:    { eye: "open",   brow: "curious", mouth: "think",   cheek: 0.5,  armL: 8,   armR: -46,  sprout: -14, motion: "s-bob",     acc: "sparkle",  eyeScale: 1,    gaze: [3, -3], label: "Thinking",    blurb: "A quiet bob, hand up, mulling it over." },
  empathetic:  { eye: "open",   brow: "caring",  mouth: "soft",    cheek: 0.5,  armL: 26,  armR: -26,  sprout: -5,  motion: "s-sway",    acc: "tear",     eyeScale: 1.1,  label: "Empathetic",  blurb: "Sitting with you through the hard bit." },
  worried:     { eye: "open",   brow: "worry",   mouth: "wavy",    cheek: 0.45, armL: 30,  armR: -30,  sprout: -4,  motion: "s-shiver",  acc: null,       eyeScale: 1.12, label: "Worried",     blurb: "Gently concerned, here just in case." },
  sleepy:      { eye: "sleepy", brow: "none",    mouth: "relaxed", cheek: 0.45, armL: 16,  armR: -16,  sprout: 18,  motion: "s-snooze",  acc: "zzz",      eyeScale: 1,    label: "Sleepy",      blurb: "Leaned aside, soft and drowsy." },
  celebrating: { eye: "happy",  brow: "none",    mouth: "smile",   cheek: 0.95, armL: 108, armR: -108, sprout: 8,   motion: "s-hop",     acc: "confetti", eyeScale: 1,    label: "Celebrating", blurb: "A small win is a real win. Hooray!" },
  loving:      { eye: "heart",  brow: "none",    mouth: "smile",   cheek: 1,    armL: 70,  armR: -70,  sprout: 4,   motion: "s-floaty",  acc: "hearts",   eyeScale: 1,    label: "Caring",      blurb: "Soft, fond, looking out for you." },
};

export const MOOD_ORDER: MimiMood[] = [
  "happy", "calm", "listening", "encouraging", "thinking",
  "empathetic", "worried", "sleepy", "celebrating", "loving",
];

/* ── shared SVG fragments ──────────────────────────────────────────────── */
function Defs({ id }: { id: string }) {
  return (
    <defs>
      <radialGradient id={`${id}-body`} cx="38%" cy="28%" r="82%">
        <stop offset="0%" stopColor={SC.bodyHi} />
        <stop offset="48%" stopColor={SC.bodyMid} />
        <stop offset="100%" stopColor={SC.bodyLo} />
      </radialGradient>
      <radialGradient id={`${id}-form`} cx="50%" cy="44%" r="64%">
        <stop offset="58%" stopColor={SC.formShade} stopOpacity="0" />
        <stop offset="100%" stopColor={SC.formShade} stopOpacity="0.3" />
      </radialGradient>
      <radialGradient id={`${id}-arm`} cx="40%" cy="25%" r="85%">
        <stop offset="0%" stopColor={SC.bodyMid} />
        <stop offset="100%" stopColor={SC.armLo} />
      </radialGradient>
      <linearGradient id={`${id}-leaf`} x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0%" stopColor={SC.leafHi} />
        <stop offset="100%" stopColor={SC.leafLo} />
      </linearGradient>
      <filter id={`${id}-blur`} x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
      <filter id={`${id}-blurS`} x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="1.7" />
      </filter>
      <clipPath id={`${id}-clip`}>
        <path d={BODY} />
      </clipPath>
    </defs>
  );
}

function Sprout({ id, lean }: { id: string; lean: number }) {
  return (
    <g
      style={{
        transform: `rotate(${lean}deg)`,
        transformBox: "view-box",
        transformOrigin: "100px 41px",
        transition: "transform .6s cubic-bezier(.2,.8,.2,1)",
      }}
    >
      <g className="sp-sway" style={{ transformBox: "view-box", transformOrigin: "100px 41px" }}>
        <path d={STEM} stroke={SC.stem} strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d={LEAF_L} fill={`url(#${id}-leaf)`} />
        <path d={LEAF_R} fill={`url(#${id}-leaf)`} />
        <path d={VEIN_L} stroke={SC.leafVein} strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.7" />
        <path d={VEIN_R} stroke={SC.leafVein} strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.7" />
        <ellipse cx="100" cy="19" rx="2.6" ry="3.2" fill={SC.leafHi} />
        <ellipse cx="90" cy="16" rx="3" ry="1.6" fill="#fff" opacity="0.45" transform="rotate(-30 90 16)" />
        <ellipse cx="110" cy="16" rx="3" ry="1.6" fill="#fff" opacity="0.4" transform="rotate(30 110 16)" />
      </g>
    </g>
  );
}

function BodyShading({ id }: { id: string }) {
  return (
    <g clipPath={`url(#${id}-clip)`}>
      <ellipse cx="100" cy="184" rx="60" ry="26" fill={SC.formShade} opacity="0.26" filter={`url(#${id}-blur)`} />
      <ellipse cx="100" cy="140" rx="42" ry="34" fill={SC.frontLight} opacity="0.32" filter={`url(#${id}-blur)`} />
      <ellipse cx="74" cy="66" rx="30" ry="18" fill="#fff" opacity="0.5" filter={`url(#${id}-blur)`} transform="rotate(-20 74 66)" />
      <ellipse cx="70" cy="62" rx="11" ry="7" fill="#fff" opacity="0.55" filter={`url(#${id}-blurS)`} transform="rotate(-20 70 62)" />
      <ellipse cx="100" cy="44" rx="16" ry="7" fill={SC.formShade} opacity="0.22" filter={`url(#${id}-blur)`} />
    </g>
  );
}

/* ── FRONT view ────────────────────────────────────────────────────────── */
function FrontView({ id, cfg, showAcc }: { id: string; cfg: MoodConfig; showAcc: boolean }) {
  const gaze = cfg.gaze || [0, 0];
  return (
    <g>
      {/* accessories (behind / around the head) */}
      {showAcc && cfg.acc === "sparkle" && (
        <g>
          <path className="acc-spark" d="M152 39 L155.3 46.7 L163 50 L155.3 53.3 L152 61 L148.7 53.3 L141 50 L148.7 46.7 Z" fill={SC.bodyLo} />
          <path className="acc-spark d2" d="M170 58 L171.8 62.2 L176 64 L171.8 65.8 L170 70 L168.2 65.8 L164 64 L168.2 62.2 Z" fill={SC.bodyMid} />
        </g>
      )}
      {showAcc && cfg.acc === "star" && (
        <path className="acc-spark" d="M156 40 L159 49 L168 52 L159 55 L156 64 L153 55 L144 52 L153 49 Z" fill={SC.leafLo} />
      )}
      {showAcc && cfg.acc === "waves" && (
        <g>
          {WAVES.map((d, i) => (
            <path key={i} className={`acc-wave d${i}`} d={d} fill="none" stroke={SC.bodyLo} strokeWidth="2.4" strokeLinecap="round" />
          ))}
        </g>
      )}
      {showAcc && cfg.acc === "zzz" && (
        <g fontFamily="ui-rounded, system-ui, sans-serif" fontWeight="700" fontStyle="italic" fill={SC.bodyLo}>
          <text className="acc-z1" x="138" y="70" textAnchor="middle" fontSize="15">z</text>
          <text className="acc-z2" x="150" y="58" textAnchor="middle" fontSize="22">z</text>
        </g>
      )}
      {showAcc && cfg.acc === "hearts" && (
        <g fill={SC.cheek}>
          <path className="acc-heart" d="M100 96 C97.5 91 90 91 90 86 C90 82.5 94 81.5 97 84 C98.5 85 99.5 87 100 88 C100.5 87 101.5 85 103 84 C106 81.5 110 82.5 110 86 C110 91 102.5 91 100 96 Z" />
          <path className="acc-heart d2" d="M150 78 c-2.2,-4 -8,-4 -8,0.4 c0,3 4.6,3 8,7 c3.4,-4 8,-4 8,-7 c0,-4.4 -5.8,-4.4 -8,-0.4 Z" opacity="0.8" />
        </g>
      )}
      {showAcc && cfg.acc === "confetti" && (
        <g>
          {([["#FF9A8B", 152, 46, 0], ["#6FBF73", 44, 60, 1], ["#6C73FF", 170, 74, 2], ["#F3A8C4", 38, 92, 0], ["#A9E6A0", 176, 100, 1], ["#FF9A8B", 52, 44, 2]] as [string, number, number, number][]).map(([c, x, y, d], i) => (
            <rect key={i} className={`acc-confetti d${d}`} x={x} y={y} width="6" height="9" rx="1.6" fill={c} transform={`rotate(${i * 40} ${x} ${y})`} />
          ))}
        </g>
      )}

      {/* feet */}
      <ellipse cx="85" cy="183" rx="10" ry="3" fill={SC.ao} opacity="0.14" filter={`url(#${id}-blurS)`} />
      <ellipse cx="115" cy="183" rx="10" ry="3" fill={SC.ao} opacity="0.14" filter={`url(#${id}-blurS)`} />
      <ellipse cx="85" cy="179" rx="12" ry="6.5" fill={`url(#${id}-arm)`} />
      <ellipse cx="115" cy="179" rx="12" ry="6.5" fill={`url(#${id}-arm)`} />

      {/* arms (behind body) */}
      <g style={{ transform: `rotate(${cfg.armL}deg)`, transformBox: "view-box", transformOrigin: "50px 115px", transition: "transform .55s cubic-bezier(.2,.8,.2,1)" }}>
        <g className="arm-wiggle" style={{ transformBox: "view-box", transformOrigin: "50px 115px" }}>
          <path d={ARM_L} fill={`url(#${id}-arm)`} />
        </g>
      </g>
      <g style={{ transform: `rotate(${cfg.armR}deg)`, transformBox: "view-box", transformOrigin: "150px 115px", transition: "transform .55s cubic-bezier(.2,.8,.2,1)" }}>
        <g className="arm-wiggle rev" style={{ transformBox: "view-box", transformOrigin: "150px 115px" }}>
          <path d={ARM_R} fill={`url(#${id}-arm)`} />
        </g>
      </g>

      <Sprout id={id} lean={cfg.sprout} />

      {/* body */}
      <path d={BODY} fill={`url(#${id}-body)`} />
      <path d={BODY} fill={`url(#${id}-form)`} />
      <BodyShading id={id} />

      {/* cheeks */}
      <g style={{ opacity: cfg.cheek, transition: "opacity .5s ease" }}>
        <ellipse cx="63" cy="119" rx="9.5" ry="6" fill={SC.cheek} filter={`url(#${id}-blurS)`} />
        <ellipse cx="137" cy="119" rx="9.5" ry="6" fill={SC.cheek} filter={`url(#${id}-blurS)`} />
      </g>

      {/* brows */}
      {cfg.brow === "caring" && (
        <g>
          <path d={CARE_BROW_L} stroke={SC.ink} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d={CARE_BROW_R} stroke={SC.ink} strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      )}
      {cfg.brow === "curious" && (
        <g>
          <path d={CURIOUS_BROW_L} stroke={SC.ink} strokeWidth="2.8" strokeLinecap="round" fill="none" />
          <path d={CURIOUS_BROW_R} stroke={SC.ink} strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </g>
      )}
      {cfg.brow === "worry" && (
        <g>
          <path d={WORRY_BROW_L} stroke={SC.ink} strokeWidth="2.8" strokeLinecap="round" fill="none" />
          <path d={WORRY_BROW_R} stroke={SC.ink} strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </g>
      )}

      {/* eyes */}
      {cfg.eye === "open" && (
        <g style={{ transform: `scale(${cfg.eyeScale})`, transformBox: "view-box", transformOrigin: "100px 105px" }}>
          <g style={{ transform: `translate(${gaze[0]}px,${gaze[1]}px)` }}>
            <g className="sprout-eyes blink" style={{ transformBox: "view-box", transformOrigin: "100px 105px" }}>
              <ellipse cx={EYE_L.cx} cy={EYE_L.cy} rx={EYE_L.rx} ry={EYE_L.ry} fill={SC.ink} />
              <ellipse cx={EYE_R.cx} cy={EYE_R.cy} rx={EYE_R.rx} ry={EYE_R.ry} fill={SC.ink} />
              <circle cx={EYE_L.cx - 3} cy={EYE_L.cy - 3.6} r="3.4" fill="#fff" />
              <circle cx={EYE_R.cx - 3} cy={EYE_R.cy - 3.6} r="3.4" fill="#fff" />
              <circle cx={EYE_L.cx + 2.8} cy={EYE_L.cy + 3.6} r="1.6" fill="#fff" opacity="0.75" />
              <circle cx={EYE_R.cx + 2.8} cy={EYE_R.cy + 3.6} r="1.6" fill="#fff" opacity="0.75" />
            </g>
          </g>
        </g>
      )}
      {cfg.eye === "happy" && (
        <g>
          <path d={HAPPY_L} stroke={SC.ink} strokeWidth="3.4" strokeLinecap="round" fill="none" />
          <path d={HAPPY_R} stroke={SC.ink} strokeWidth="3.4" strokeLinecap="round" fill="none" />
        </g>
      )}
      {cfg.eye === "sleepy" && (
        <g>
          <path d={SLEEPY_L} stroke={SC.ink} strokeWidth="3.2" strokeLinecap="round" fill="none" />
          <path d={SLEEPY_R} stroke={SC.ink} strokeWidth="3.2" strokeLinecap="round" fill="none" />
          <path d="M90 106 l4 2" stroke={SC.ink} strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M110 106 l-4 2" stroke={SC.ink} strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>
      )}
      {cfg.eye === "heart" && (
        <g className="sprout-eyes hpulse" style={{ transformBox: "view-box", transformOrigin: "100px 105px" }} fill={SC.cheek}>
          <path d="M80 112 C74 104 68 105 68 99 C68 95 73 94 77 98 C78.5 99.5 79.5 101 80 102 C80.5 101 81.5 99.5 83 98 C87 94 92 95 92 99 C92 105 86 104 80 112 Z" />
          <path d="M120 112 C114 104 108 105 108 99 C108 95 113 94 117 98 C118.5 99.5 119.5 101 120 102 C120.5 101 121.5 99.5 123 98 C127 94 132 95 132 99 C132 105 126 104 120 112 Z" />
        </g>
      )}

      {/* tear (empathetic) */}
      {showAcc && cfg.acc === "tear" && (
        <path className="acc-tear" d="M72 113 q-4 7 0 11 q4 -4 0 -11 z" fill={SC.tear} opacity="0.9" />
      )}

      {/* mouth */}
      <path d={MOUTH[cfg.mouth]} stroke={SC.ink} strokeWidth="3.2" strokeLinecap="round" fill="none" style={{ transition: "d .4s ease" }} />
    </g>
  );
}

/* ── SIDE profile (Mimi turned, looking to her left) ───────────────────── */
function SideView({ id, cfg }: { id: string; cfg: MoodConfig }) {
  const sidePath =
    "M106 41 C139 41 162 67 162 104 C162 146 139 178 100 178 C78 178 62 172 52 160 C44 150 40 138 39 126 C38 119 33 116 32 110 C31 105 35 101 40 99 C50 70 78 41 106 41 Z";
  const eS = cfg.eyeScale;
  const EX = 66;
  const EY = 99; // single eye anchor (on the face / forehead)
  return (
    <g>
      <ellipse cx="100" cy="187" rx="46" ry="8" fill={SC.ao} opacity="0.16" filter={`url(#${id}-blur)`} />

      {/* back arm — small sliver behind the body (right) */}
      <g style={{ transform: `rotate(${-cfg.armL}deg)`, transformBox: "view-box", transformOrigin: "150px 116px", transition: "transform .55s" }}>
        <g className="arm-wiggle" style={{ transformBox: "view-box", transformOrigin: "150px 116px" }}>
          <ellipse cx="154" cy="132" rx="8" ry="13.5" fill={SC.armLo} />
        </g>
      </g>
      {/* back foot (further, darker, slightly back) */}
      <ellipse cx="120" cy="180" rx="11" ry="6" fill={SC.armLo} />

      {/* sprout — rooted at the crown, leaning forward (left) by mood */}
      <g style={{ transform: `rotate(${-8 - cfg.sprout * 0.7}deg)`, transformBox: "view-box", transformOrigin: "104px 42px", transition: "transform .6s" }}>
        <g className="sp-sway" style={{ transformBox: "view-box", transformOrigin: "104px 42px" }}>
          <path d="M104 42 C103 35 104 29 105 24" stroke={SC.stem} strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M105 28 C96 26 87 19 88 12 C95 10 104 19 105 28 Z" fill={`url(#${id}-leaf)`} />
          <path d="M105 28 C114 26 123 19 122 12 C115 10 106 19 105 28 Z" fill={`url(#${id}-leaf)`} />
          <path d="M104 25 Q97 20 90 14" stroke={SC.leafVein} strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.7" />
          <ellipse cx="105" cy="20" rx="2.6" ry="3.2" fill={SC.leafHi} />
          <ellipse cx="96" cy="17" rx="3" ry="1.6" fill="#fff" opacity="0.45" transform="rotate(-30 96 17)" />
        </g>
      </g>

      {/* body */}
      <clipPath id={`${id}-clipSide`}>
        <path d={sidePath} />
      </clipPath>
      <path d={sidePath} fill={`url(#${id}-body)`} />
      <path d={sidePath} fill={`url(#${id}-form)`} />
      <g clipPath={`url(#${id}-clipSide)`}>
        {/* back of body (right) into shade; face + belly (left) toward the light */}
        <ellipse cx="140" cy="120" rx="40" ry="60" fill={SC.formShade} opacity="0.22" filter={`url(#${id}-blur)`} />
        <ellipse cx="74" cy="140" rx="42" ry="42" fill={SC.frontLight} opacity="0.36" filter={`url(#${id}-blur)`} />
        {/* lifted face-plane highlight around the snout */}
        <ellipse cx="50" cy="110" rx="22" ry="22" fill={SC.bodyHi} opacity="0.40" filter={`url(#${id}-blur)`} />
        {/* top-left key sheen */}
        <ellipse cx="92" cy="64" rx="26" ry="15" fill="#fff" opacity="0.4" filter={`url(#${id}-blur)`} transform="rotate(18 92 64)" />
        <ellipse cx="86" cy="60" rx="10" ry="6" fill="#fff" opacity="0.5" filter={`url(#${id}-blurS)`} transform="rotate(18 86 60)" />
        {/* soft crease where the snout meets the cheek */}
        <path d="M58 96 Q60 110 56 122" stroke={SC.formShade} strokeWidth="3" opacity="0.12" fill="none" filter={`url(#${id}-blurS)`} />
      </g>

      {/* front arm — clearly reaching forward (left) on the lower-front */}
      <g style={{ transform: `rotate(${-cfg.armR * 0.65}deg)`, transformBox: "view-box", transformOrigin: "50px 120px", transition: "transform .55s" }}>
        <g className="arm-wiggle rev" style={{ transformBox: "view-box", transformOrigin: "50px 120px" }}>
          <ellipse cx="49" cy="138" rx="9.5" ry="15.5" fill={`url(#${id}-arm)`} />
        </g>
      </g>
      {/* front foot (nearer, larger, forward) */}
      <ellipse cx="84" cy="181" rx="12.5" ry="6.8" fill={`url(#${id}-arm)`} />

      {/* cheek (single, on the snout / face) */}
      <ellipse cx="56" cy="118" rx="8.5" ry="5.4" fill={SC.cheek} opacity={cfg.cheek} filter={`url(#${id}-blurS)`} style={{ transition: "opacity .5s ease" }} />

      {/* brow (single, over the eye) */}
      {cfg.brow === "caring" && <path d="M57 87 Q66 82 75 87" stroke={SC.ink} strokeWidth="3" strokeLinecap="round" fill="none" />}
      {cfg.brow === "curious" && <path d="M57 84 Q66 79 75 84" stroke={SC.ink} strokeWidth="2.8" strokeLinecap="round" fill="none" />}
      {cfg.brow === "worry" && <path d="M57 85 Q66 80 75 85" stroke={SC.ink} strokeWidth="2.8" strokeLinecap="round" fill="none" />}

      {/* eye (single, looking forward / left) */}
      {cfg.eye === "open" && (
        <g className="sprout-eyes blink" style={{ transformBox: "view-box", transformOrigin: `${EX}px ${EY}px` }}>
          <ellipse cx={EX} cy={EY} rx={9 * eS} ry={10.6 * eS} fill={SC.ink} />
          <circle cx={EX - 2.8} cy={EY - 3.6} r="3.4" fill="#fff" />
          <circle cx={EX + 2.6} cy={EY + 3.6} r="1.6" fill="#fff" opacity="0.75" />
        </g>
      )}
      {cfg.eye === "happy" && (
        <path d={`M${EX - 9} ${EY + 2} Q${EX} ${EY - 7} ${EX + 9} ${EY + 2}`} stroke={SC.ink} strokeWidth="3.4" strokeLinecap="round" fill="none" />
      )}
      {cfg.eye === "sleepy" && (
        <g>
          <path d={`M${EX - 9} ${EY} Q${EX} ${EY + 7} ${EX + 9} ${EY}`} stroke={SC.ink} strokeWidth="3.2" strokeLinecap="round" fill="none" />
          <path d={`M${EX - 9} ${EY + 1} l-4 2`} stroke={SC.ink} strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>
      )}
      {cfg.eye === "heart" && (
        <path
          className="sprout-eyes hpulse"
          style={{ transformBox: "view-box", transformOrigin: `${EX}px ${EY}px` }}
          d={`M${EX} ${EY + 8} C${EX - 6} ${EY} ${EX - 12} ${EY + 1} ${EX - 12} ${EY - 5} C${EX - 12} ${EY - 9} ${EX - 7} ${EY - 10} ${EX - 3} ${EY - 6} C${EX - 1.5} ${EY - 4.5} ${EX - 0.5} ${EY - 3} ${EX} ${EY - 2} C${EX + 0.5} ${EY - 3} ${EX + 1.5} ${EY - 4.5} ${EX + 3} ${EY - 6} C${EX + 7} ${EY - 10} ${EX + 12} ${EY - 9} ${EX + 12} ${EY - 5} C${EX + 12} ${EY + 1} ${EX + 6} ${EY} ${EX} ${EY + 8} Z`}
          fill={SC.cheek}
        />
      )}

      {/* tear (empathetic) */}
      {cfg.acc === "tear" && <path className="acc-tear" d="M55 116 q-4 7 0 11 q4 -4 0 -11 z" fill={SC.tear} opacity="0.9" />}

      {/* mouth — at the front of the snout, just below / ahead of the eye */}
      <path
        d={
          cfg.eye === "sleepy"
            ? "M40 119 Q47 123 54 118"
            : cfg.mouth === "grin" || cfg.mouth === "smile"
              ? "M38 118 Q47 129 56 117"
              : cfg.mouth === "wavy"
                ? "M40 119 Q44 116 47 119 Q50 122 53 119"
                : "M40 119 Q47 125 54 118"
        }
        stroke={SC.ink}
        strokeWidth="3.1"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

/* ── BACK view ─────────────────────────────────────────────────────────── */
function BackView({ id, cfg }: { id: string; cfg: MoodConfig }) {
  return (
    <g>
      <ellipse cx="100" cy="189" rx="46" ry="8" fill={SC.ao} opacity="0.16" filter={`url(#${id}-blur)`} />
      <ellipse cx="85" cy="179" rx="12" ry="6.5" fill={SC.armLo} />
      <ellipse cx="115" cy="179" rx="12" ry="6.5" fill={SC.armLo} />
      {/* arms at sides */}
      <g style={{ transform: `rotate(${cfg.armL}deg)`, transformBox: "view-box", transformOrigin: "50px 115px", transition: "transform .55s" }}>
        <g className="arm-wiggle" style={{ transformBox: "view-box", transformOrigin: "50px 115px" }}>
          <path d={ARM_L} fill={SC.armLo} />
        </g>
      </g>
      <g style={{ transform: `rotate(${cfg.armR}deg)`, transformBox: "view-box", transformOrigin: "150px 115px", transition: "transform .55s" }}>
        <g className="arm-wiggle rev" style={{ transformBox: "view-box", transformOrigin: "150px 115px" }}>
          <path d={ARM_R} fill={SC.armLo} />
        </g>
      </g>
      {/* sprout from behind — leaves splay, slightly darker */}
      <g style={{ transform: `rotate(${cfg.sprout}deg)`, transformBox: "view-box", transformOrigin: "100px 41px", transition: "transform .6s" }}>
        <g className="sp-sway" style={{ transformBox: "view-box", transformOrigin: "100px 41px" }}>
          <path d={STEM} stroke={SC.leafVein} strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d={LEAF_L} fill={SC.leafLo} />
          <path d={LEAF_R} fill={SC.leafLo} />
          <path d={VEIN_L} stroke={SC.leafHi} strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.6" />
          <path d={VEIN_R} stroke={SC.leafHi} strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.6" />
        </g>
      </g>
      {/* body — same silhouette, even tone, soft center seam */}
      <path d={BODY} fill={`url(#${id}-body)`} />
      <g clipPath={`url(#${id}-clip)`}>
        <ellipse cx="100" cy="180" rx="60" ry="28" fill={SC.formShade} opacity="0.28" filter={`url(#${id}-blur)`} />
        <ellipse cx="100" cy="92" rx="46" ry="30" fill={SC.frontLight} opacity="0.18" filter={`url(#${id}-blur)`} />
        <path d="M100 60 C98 100 98 140 100 168" stroke={SC.formShade} strokeWidth="3" opacity="0.16" fill="none" filter={`url(#${id}-blurS)`} />
      </g>
      {/* little back tuft of fluff */}
      <ellipse cx="100" cy="150" rx="7" ry="9" fill={SC.bodyHi} opacity="0.4" filter={`url(#${id}-blurS)`} />
    </g>
  );
}

const VIEW_LABEL: Record<MimiMood, string> = {
  happy: "Mimi, bright and warm",
  calm: "Mimi, calm and at ease",
  listening: "Mimi, listening",
  encouraging: "Mimi, cheering you on",
  thinking: "Mimi, thinking",
  empathetic: "Mimi, here with you",
  worried: "Mimi, gently concerned",
  sleepy: "Mimi, drowsy and resting",
  celebrating: "Mimi, celebrating a small win",
  loving: "Mimi, soft and fond",
};

export default function MimiSprout({
  mood = "happy",
  view = "front",
  size = 220,
  idle = true,
  showAcc = true,
  style = {},
}: MimiSproutProps) {
  const cfg = MOODS[mood] || MOODS.happy;
  const id = `sp${useId().replace(/[:]/g, "")}`;
  const motion = view === "front" ? cfg.motion : "s-breathe";
  return (
    <div style={{ width: size, height: size, position: "relative", ...style }}>
      <div className={idle ? `sprout-body ${motion}` : "sprout-body"} style={{ width: "100%", height: "100%" }}>
        <svg
          role="img"
          aria-label={VIEW_LABEL[mood]}
          viewBox="0 0 200 200"
          width="100%"
          height="100%"
          style={{ overflow: "visible", display: "block" }}
        >
          <Defs id={id} />
          {view === "front" && <FrontView id={id} cfg={cfg} showAcc={showAcc && idle} />}
          {view === "side" && <SideView id={id} cfg={cfg} />}
          {view === "back" && <BackView id={id} cfg={cfg} />}
        </svg>
      </div>
    </div>
  );
}
