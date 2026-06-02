"use client";

/**
 * ──────────────────────────────────────────────────────────────────────────
 *  Mimi — the Wewa.life companion character (penguin chick, confirmed v2)
 * ──────────────────────────────────────────────────────────────────────────
 *  A soft, 3D-styled penguin chick: a lavender "hood" wrapping a white face,
 *  a little cowlick curl, a tiny orange beak and soft pink cheeks, with
 *  clay-like gradient shading and a grounding drop shadow.
 *
 *  One <MimiPenguin mood size /> component drives all 10 expressions + their
 *  motion. Identity (hood, cowlick, body) is constant; only the eyes / brows /
 *  mouth / cheeks / a touch of motion change per mood.
 *
 *  Motion lives in ./mimi-penguin.css (idle breathe/blink + one gesture per
 *  mood, all reduced-motion safe).
 * ──────────────────────────────────────────────────────────────────────────
 */

import { useId } from "react";
import "./mimi-penguin.css";
import type {
  AccessoryType,
  BrowType,
  EyeType,
  MimiMood,
  MimiPenguinProps,
  MoodConfig,
  MouthType,
} from "./types";

const MIMI = {
  hoodLight: "#CFC6F2",
  hoodMid: "#A99BE2",
  hoodDeep: "#8A78D2",
  hoodEdge: "#7E6BC9",
  face: "#FFFFFF",
  faceShade: "#ECE7F8",
  eye: "#2E2838",
  blush: "#F4A6C4",
  beakTop: "#FBB24A",
  beakBot: "#F2922A",
  mouthIn: "#E07E2A",
  white: "#FFFFFF",
} as const;

// Per-mood face config. Identity (hood, cowlick, body) is constant; only
// eyes / brows / mouth / cheeks / a touch of motion change.
export const MOOD_CFG: Record<MimiMood, MoodConfig> = {
  happy:       { eyes: "happy",  mouth: "beak",  brow: null,    blush: 1,    acc: null,       motion: "m-bounce",  label: "Happy",       blurb: "Bright and warm — the everyday Mimi." },
  calm:        { eyes: "calm",   mouth: "beak",  brow: null,    blush: 0.7,  acc: null,       motion: "m-breathe", label: "Calm",        blurb: "Settled and at ease, breathing slow." },
  listening:   { eyes: "open",   mouth: "beak",  brow: "raise", blush: 0.7,  acc: "sound",    motion: "m-tilt",    label: "Listening",   blurb: "Tilted in, fully paying attention." },
  encouraging: { eyes: "happy",  mouth: "smile", brow: null,    blush: 0.85, acc: "star",     motion: "m-noddy",   label: "Encouraging", blurb: "“You’ve got this.” A proud little nudge." },
  thinking:    { eyes: "look",   mouth: "beak",  brow: "think", blush: 0.55, acc: "dots",     motion: "m-tilt",    label: "Thinking",    blurb: "Curious, mulling something over." },
  sad:         { eyes: "sad",    mouth: "frown", brow: "sad",   blush: 0.55, acc: "tear",     motion: "m-sway",    label: "Empathetic",  blurb: "Sitting with you through the hard bit." },
  worried:     { eyes: "wide",   mouth: "beak",  brow: "worry", blush: 0.5,  acc: null,       motion: "m-shiver",  label: "Worried",     blurb: "Gently concerned, here just in case." },
  sleepy:      { eyes: "sleepy", mouth: "beak",  brow: null,    blush: 0.6,  acc: "zzz",      motion: "m-snooze",  label: "Sleepy",      blurb: "Winding down, soft and drowsy." },
  celebrating: { eyes: "happy",  mouth: "laugh", brow: null,    blush: 1,    acc: "confetti", motion: "m-excited", label: "Celebrating", blurb: "A small win is a real win. Hooray!" },
  loving:      { eyes: "heart",  mouth: "laugh", brow: null,    blush: 1,    acc: "hearts",   motion: "m-floaty",  label: "Caring",      blurb: "Soft, fond, looking out for you." },
};

export const MOOD_ORDER: MimiMood[] = [
  "happy",
  "calm",
  "listening",
  "encouraging",
  "thinking",
  "sad",
  "worried",
  "sleepy",
  "celebrating",
  "loving",
];

// face anchor points
const LX = 80, RX = 120, EY = 110; // eyes
const BX = 100, BY = 124; // beak / mouth

function renderEyes(type: EyeType) {
  const c = MIMI.eye;
  const hi = (cx: number, cy: number) => (
    <circle cx={cx - 2} cy={cy - 3.5} r="2.1" fill="#fff" opacity="0.95" />
  );
  switch (type) {
    case "happy": // ^  ^
      return (
        <g key="e">
          <path d={`M${LX - 8},${EY + 3} Q${LX},${EY - 8} ${LX + 8},${EY + 3}`} stroke={c} strokeWidth="4.2" strokeLinecap="round" fill="none" />
          <path d={`M${RX - 8},${EY + 3} Q${RX},${EY - 8} ${RX + 8},${EY + 3}`} stroke={c} strokeWidth="4.2" strokeLinecap="round" fill="none" />
        </g>
      );
    case "calm": // gentle squint
      return (
        <g key="e">
          <path d={`M${LX - 8},${EY} Q${LX},${EY + 5} ${LX + 8},${EY}`} stroke={c} strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d={`M${RX - 8},${EY} Q${RX},${EY + 5} ${RX + 8},${EY}`} stroke={c} strokeWidth="4" strokeLinecap="round" fill="none" />
        </g>
      );
    case "sleepy": // closed lids w/ tiny lash
      return (
        <g key="e">
          <path d={`M${LX - 8},${EY} Q${LX},${EY + 6} ${LX + 8},${EY}`} stroke={c} strokeWidth="3.6" strokeLinecap="round" fill="none" />
          <path d={`M${RX - 8},${EY} Q${RX},${EY + 6} ${RX + 8},${EY}`} stroke={c} strokeWidth="3.6" strokeLinecap="round" fill="none" />
        </g>
      );
    case "wide":
      return (
        <g className="mimi-eyes blink" key="e">
          <ellipse cx={LX} cy={EY} rx="8" ry="10" fill={c} />
          <ellipse cx={RX} cy={EY} rx="8" ry="10" fill={c} />
          {hi(LX, EY)}
          {hi(RX, EY)}
        </g>
      );
    case "look": // glancing up-right
      return (
        <g className="mimi-eyes blink" key="e">
          <ellipse cx={LX} cy={EY} rx="7" ry="9" fill={c} />
          <ellipse cx={RX} cy={EY} rx="7" ry="9" fill={c} />
          <circle cx={LX + 2.5} cy={EY - 3.5} r="2" fill="#fff" opacity="0.95" />
          <circle cx={RX + 2.5} cy={EY - 3.5} r="2" fill="#fff" opacity="0.95" />
        </g>
      );
    case "sad":
      return (
        <g key="e">
          <ellipse cx={LX} cy={EY + 2} rx="6.2" ry="7.4" fill={c} />
          <ellipse cx={RX} cy={EY + 2} rx="6.2" ry="7.4" fill={c} />
          <circle cx={LX - 1.6} cy={EY - 1.6} r="1.9" fill="#fff" opacity="0.95" />
          <circle cx={RX - 1.6} cy={EY - 1.6} r="1.9" fill="#fff" opacity="0.95" />
        </g>
      );
    case "heart": {
      const heart = (cx: number, cy: number) => (
        <path d={`M${cx},${cy + 7} C${cx - 9},${cy - 1} ${cx - 7},${cy - 9} ${cx},${cy - 4} C${cx + 7},${cy - 9} ${cx + 9},${cy - 1} ${cx},${cy + 7} Z`} fill={MIMI.blush} />
      );
      return (
        <g className="mimi-eyes pulse" key="e">
          {heart(LX, EY)}
          {heart(RX, EY)}
        </g>
      );
    }
    default: // open round
      return (
        <g className="mimi-eyes blink" key="e">
          <ellipse cx={LX} cy={EY} rx="7" ry="9" fill={c} />
          <ellipse cx={RX} cy={EY} rx="7" ry="9" fill={c} />
          {hi(LX, EY)}
          {hi(RX, EY)}
        </g>
      );
  }
}

function renderBrows(type: BrowType) {
  if (!type) return null;
  const s = {
    stroke: MIMI.eye,
    strokeWidth: 3.4,
    strokeLinecap: "round" as const,
    fill: "none",
  };
  const by = EY - 16;
  switch (type) {
    case "sad":
      return (
        <g key="b">
          <path d={`M${LX - 8},${by + 3} Q${LX - 1},${by - 1} ${LX + 7},${by - 2}`} {...s} />
          <path d={`M${RX + 8},${by + 3} Q${RX + 1},${by - 1} ${RX - 7},${by - 2}`} {...s} />
        </g>
      );
    case "worry":
      return (
        <g key="b">
          <path d={`M${LX - 7},${by + 1} Q${LX},${by - 4} ${LX + 7},${by + 1}`} {...s} />
          <path d={`M${RX - 7},${by + 1} Q${RX},${by - 4} ${RX + 7},${by + 1}`} {...s} />
        </g>
      );
    case "think":
      return (
        <g key="b">
          <path d={`M${LX - 7},${by + 2} L${LX + 7},${by + 2}`} {...s} />
          <path d={`M${RX - 7},${by - 3} Q${RX},${by - 7} ${RX + 7},${by - 4}`} {...s} />
        </g>
      );
    case "raise":
      return (
        <g key="b">
          <path d={`M${LX - 7},${by - 1} Q${LX},${by - 4} ${LX + 7},${by - 1}`} {...s} />
          <path d={`M${RX - 7},${by - 1} Q${RX},${by - 4} ${RX + 7},${by - 1}`} {...s} />
        </g>
      );
    default:
      return null;
  }
}

function renderMouth(type: MouthType, id: string) {
  switch (type) {
    case "laugh": // open laughing beak
      return (
        <g key="m">
          <path d={`M${BX - 13},${BY - 6} Q${BX},${BY - 10} ${BX + 13},${BY - 6} Q${BX + 11},${BY + 13} ${BX},${BY + 14} Q${BX - 11},${BY + 13} ${BX - 13},${BY - 6} Z`} fill={`url(#${id}-beak)`} />
          <path d={`M${BX - 9},${BY + 3} Q${BX},${BY + 13} ${BX + 9},${BY + 3} Z`} fill={MIMI.mouthIn} />
          <path d={`M${BX - 13},${BY - 6} Q${BX},${BY - 10} ${BX + 13},${BY - 6} Q${BX},${BY - 4} ${BX - 13},${BY - 6} Z`} fill="#fff" opacity="0.22" />
        </g>
      );
    case "smile":
      return (
        <g key="m">
          <path d={`M${BX - 9},${BY - 3} Q${BX},${BY - 6} ${BX + 9},${BY - 3} Q${BX + 7},${BY + 9} ${BX},${BY + 10} Q${BX - 7},${BY + 9} ${BX - 9},${BY - 3} Z`} fill={`url(#${id}-beak)`} />
          <path d={`M${BX - 5},${BY + 5} Q${BX},${BY + 9} ${BX + 5},${BY + 5}`} stroke={MIMI.mouthIn} strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      );
    case "frown":
      return (
        <g key="m">
          <path d={`M${BX - 8},${BY - 2} Q${BX},${BY - 5} ${BX + 8},${BY - 2} Q${BX + 6},${BY + 8} ${BX},${BY + 9} Q${BX - 6},${BY + 8} ${BX - 8},${BY - 2} Z`} fill={`url(#${id}-beak)`} />
          <path d={`M${BX - 5},${BY + 8} Q${BX},${BY + 4} ${BX + 5},${BY + 8}`} stroke={MIMI.mouthIn} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </g>
      );
    default: // closed beak
      return (
        <g key="m">
          <path d={`M${BX - 9},${BY - 4} Q${BX},${BY - 7} ${BX + 9},${BY - 4} Q${BX + 7},${BY + 8} ${BX},${BY + 9} Q${BX - 7},${BY + 8} ${BX - 9},${BY - 4} Z`} fill={`url(#${id}-beak)`} />
          <path d={`M${BX - 9},${BY - 4} Q${BX},${BY - 7} ${BX + 9},${BY - 4} Q${BX},${BY - 3} ${BX - 9},${BY - 4} Z`} fill="#fff" opacity="0.25" />
          <path d={`M${BX},${BY - 5} L${BX},${BY + 8}`} stroke={MIMI.mouthIn} strokeWidth="1" opacity="0.35" />
        </g>
      );
  }
}

function renderAccessory(acc: AccessoryType) {
  switch (acc) {
    case "star":
      return (
        <path
          key="a"
          className="acc-twinkle"
          d="M150,52 l2.4,7.6 7.6,2.4 -7.6,2.4 -2.4,7.6 -2.4,-7.6 -7.6,-2.4 7.6,-2.4 z"
          fill={MIMI.beakTop}
        />
      );
    case "dots":
      return (
        <g key="a" className="acc-think">
          <circle cx="150" cy="60" r="3.5" fill={MIMI.hoodMid} opacity="0.6" />
          <circle cx="161" cy="52" r="4.5" fill={MIMI.hoodMid} opacity="0.8" />
          <circle cx="174" cy="42" r="5.5" fill={MIMI.hoodMid} />
        </g>
      );
    case "sound":
      return (
        <g key="a" fill="none" stroke={MIMI.hoodDeep} strokeWidth="3" strokeLinecap="round" opacity="0.75">
          <path className="acc-wave" d="M174,98 Q182,108 174,118" />
          <path className="acc-wave d2" d="M182,90 Q196,108 182,126" />
        </g>
      );
    case "zzz":
      return (
        <g key="a" fill={MIMI.hoodDeep} fontFamily="Manrope" fontWeight="800" opacity="0.7">
          <text className="acc-rise" x="150" y="60" fontSize="13">z</text>
          <text className="acc-rise d2" x="161" y="48" fontSize="17">z</text>
          <text className="acc-rise d3" x="174" y="34" fontSize="22">Z</text>
        </g>
      );
    case "tear":
      return (
        <path key="a" className="acc-tear" d="M70,118 q-4.5,8 0,12 q4.5,-4 0,-12 z" fill="#7FC9E0" opacity="0.9" />
      );
    case "hearts":
      return (
        <g key="a" fill={MIMI.blush}>
          <path className="acc-rise" d="M150,72 c-3.5,-3.5 -9,0 -4.5,4.5 l4.5,4.5 4.5,-4.5 c4.5,-4.5 -1,-8 -4.5,-4.5 z" />
          <path className="acc-rise d2" d="M48,82 c-3,-3 -7.5,0 -3.7,3.7 l3.7,3.7 3.7,-3.7 c3.7,-3.7 -1,-6.5 -3.7,-3.7 z" opacity="0.85" />
          <path className="acc-rise d3" d="M160,98 c-3,-3 -7.5,0 -3.7,3.7 l3.7,3.7 3.7,-3.7 c3.7,-3.7 -1,-6.5 -3.7,-3.7 z" opacity="0.75" />
        </g>
      );
    case "confetti": {
      const bits: [string, number, number, number][] = [
        ["#F68D1E", 150, 58, 0],
        ["#00B7CA", 46, 70, 1],
        ["#8A78D2", 164, 88, 2],
        ["#F4A6C4", 38, 104, 0],
        ["#00B7CA", 170, 116, 1],
        ["#F68D1E", 54, 50, 2],
      ];
      return (
        <g key="a">
          {bits.map(([c, x, y, d], i) => (
            <rect
              key={i}
              className={`acc-confetti d${d}`}
              x={x}
              y={y}
              width="6"
              height="9"
              rx="1.6"
              fill={c}
              transform={`rotate(${i * 40} ${x} ${y})`}
            />
          ))}
        </g>
      );
    }
    default:
      return null;
  }
}

const DEFAULT_LABEL: Record<MimiMood, string> = {
  happy: "Mimi, happy",
  calm: "Mimi, calm",
  listening: "Mimi, listening",
  encouraging: "Mimi, encouraging",
  thinking: "Mimi, thinking",
  sad: "Mimi, sitting with you",
  worried: "Mimi, gently concerned",
  sleepy: "Mimi, sleepy",
  celebrating: "Mimi, celebrating",
  loving: "Mimi, caring",
};

export default function MimiPenguin({
  mood = "happy",
  size = 200,
  idle = true,
  style = {},
  "aria-label": ariaLabel,
}: MimiPenguinProps) {
  const cfg = MOOD_CFG[mood] ?? MOOD_CFG.happy;
  const id = `mimi-${useId().replace(/:/g, "")}`;
  return (
    <div style={{ width: size, height: size, position: "relative", ...style }}>
      <div
        className={idle ? `mimi-body ${cfg.motion}` : "mimi-body"}
        style={{ width: "100%", height: "100%" }}
      >
        <svg
          viewBox="0 0 200 205"
          width="100%"
          height="100%"
          role="img"
          aria-label={ariaLabel ?? DEFAULT_LABEL[mood]}
          style={{ overflow: "visible", display: "block" }}
        >
          <defs>
            <radialGradient id={`${id}-hood`} cx="40%" cy="26%" r="78%">
              <stop offset="0%" stopColor={MIMI.hoodLight} />
              <stop offset="58%" stopColor={MIMI.hoodMid} />
              <stop offset="100%" stopColor={MIMI.hoodDeep} />
            </radialGradient>
            <radialGradient id={`${id}-face`} cx="50%" cy="40%" r="68%">
              <stop offset="0%" stopColor={MIMI.face} />
              <stop offset="76%" stopColor={MIMI.face} />
              <stop offset="100%" stopColor={MIMI.faceShade} />
            </radialGradient>
            <linearGradient id={`${id}-beak`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={MIMI.beakTop} />
              <stop offset="100%" stopColor={MIMI.beakBot} />
            </linearGradient>
            <radialGradient id={`${id}-cheek`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={MIMI.blush} stopOpacity="0.85" />
              <stop offset="100%" stopColor={MIMI.blush} stopOpacity="0" />
            </radialGradient>
            <filter id={`${id}-soft`} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3.4" />
            </filter>
            <filter id={`${id}-drop`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
            <clipPath id={`${id}-faceclip`}>
              <path d="M40,116 C44,94 58,80 78,80 C90,80 95,90 100,98 C105,90 110,80 122,80 C142,80 156,94 160,116 C164,144 138,170 100,170 C62,170 36,144 40,116 Z" />
            </clipPath>
          </defs>

          {/* grounding drop shadow */}
          <ellipse cx="100" cy="190" rx="56" ry="11" fill="#7E6BC9" opacity="0.22" filter={`url(#${id}-drop)`} />

          {/* HOOD — full soft body silhouette */}
          <path
            d="M100,30 C146,30 176,64 176,108 C176,156 144,182 100,182 C56,182 24,156 24,108 C24,64 54,30 100,30 Z"
            fill={`url(#${id}-hood)`}
          />
          {/* soft top highlight */}
          <ellipse cx="74" cy="62" rx="34" ry="24" fill="#fff" opacity="0.28" filter={`url(#${id}-soft)`} />
          {/* darker rim along the bottom for volume */}
          <path
            d="M30,120 C40,162 66,182 100,182 C134,182 160,162 170,120 C160,150 134,168 100,168 C66,168 40,150 30,120 Z"
            fill={MIMI.hoodEdge}
            opacity="0.30"
            filter={`url(#${id}-soft)`}
          />

          {/* WHITE FACE */}
          <path
            d="M40,116 C44,94 58,80 78,80 C90,80 95,90 100,98 C105,90 110,80 122,80 C142,80 156,94 160,116 C164,144 138,170 100,170 C62,170 36,144 40,116 Z"
            fill={`url(#${id}-face)`}
          />
          {/* soft occlusion of the hood overhang onto the face (clipped inside face) */}
          <g clipPath={`url(#${id}-faceclip)`}>
            <path
              d="M40,116 C44,94 58,80 78,80 C90,80 95,90 100,98 C105,90 110,80 122,80 C142,80 156,94 160,116"
              fill="none"
              stroke={MIMI.hoodDeep}
              strokeWidth="9"
              opacity="0.16"
              filter={`url(#${id}-soft)`}
            />
          </g>

          {/* cowlick curl — rooted into the crown */}
          <g className="mimi-curl">
            <path
              d="M95,38 C92,24 98,9 108,11 C115,12.5 113,22 105,23 C111,26 107,36 99,37 C97.5,37.4 96,37.6 95,38 Z"
              fill={`url(#${id}-hood)`}
            />
          </g>

          {/* cheeks */}
          <ellipse cx="62" cy="122" rx="11" ry="7.5" fill={`url(#${id}-cheek)`} opacity={cfg.blush} />
          <ellipse cx="138" cy="122" rx="11" ry="7.5" fill={`url(#${id}-cheek)`} opacity={cfg.blush} />

          {renderBrows(cfg.brow)}
          {renderEyes(cfg.eyes)}
          {renderMouth(cfg.mouth, id)}
          {renderAccessory(cfg.acc)}
        </svg>
      </div>
    </div>
  );
}
