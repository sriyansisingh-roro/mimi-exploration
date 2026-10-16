/**
 * Mimi (Sprout) — expanded model.
 *
 * The "sprout" companion brought up to the full bar: 10 expressions, full-body
 * poses, and front / side / back views (see <MimiSprout />). This is the same
 * plush seed-body + green-sprout geometry as the 6-state <Mimi />, ported to
 * plain SVG + CSS motion and widened to a richer mood set.
 *
 * Keep MimiMood / MimiView closed so the rest of the app can switch on them
 * exhaustively.
 */

/** The ten expressions, in canonical display order (see MOOD_ORDER). */
export type MimiMood =
  | "happy" // bright, warm — the everyday Mimi
  | "calm" // settled, breathing slow
  | "listening" // ears up, leaning in, attentive
  | "encouraging" // a proud little cheer — "you've got this"
  | "thinking" // a quiet bob, hand up, mulling it over
  | "empathetic" // sitting with you through the hard bit
  | "worried" // gently concerned, here just in case
  | "sleepy" // leaned aside, soft and drowsy
  | "celebrating" // a small win is a real win — hooray
  | "loving"; // soft, fond, looking out for you (heart eyes)

/** Camera angle for the turnaround. */
export type MimiView = "front" | "side" | "back";

export type EyeMode = "open" | "happy" | "sleepy" | "heart";
export type BrowMode = "none" | "caring" | "curious" | "worry";
export type AccType =
  | null
  | "waves"
  | "star"
  | "sparkle"
  | "tear"
  | "zzz"
  | "confetti"
  | "hearts";

/** Per-mood look + posture. */
export interface MoodConfig {
  eye: EyeMode;
  brow: BrowMode;
  mouth: "gentle" | "smile" | "relaxed" | "soft" | "think" | "grin" | "wavy";
  /** Cheek-blush opacity, 0–1. */
  cheek: number;
  /** Arm pose in degrees (L positive lifts outward; R is mirrored). */
  armL: number;
  armR: number;
  /** Sprout lean in degrees, pivoting from its base. */
  sprout: number;
  /** Idle micro-motion class (front view only). */
  motion: string;
  /** Floating accessory loop. */
  acc: AccType;
  /** Eye scale (slightly larger reads softer / more vulnerable). */
  eyeScale: number;
  /** Optional gaze offset [x, y] in viewBox units. */
  gaze?: [number, number];
  label: string;
  blurb: string;
}

export interface MimiSproutProps {
  /** Current mood. Defaults to "happy". */
  mood?: MimiMood;
  /** Camera angle. Defaults to "front". */
  view?: MimiView;
  /** Rendered square size in px (internal viewBox is 200×200). Defaults to 220. */
  size?: number;
  /** Run idle breathing / blinking / mood micro-motion. Defaults to true. */
  idle?: boolean;
  /** Show the floating accessory (sparkle, tear, confetti…). Defaults to true. */
  showAcc?: boolean;
  /** Extra styles on the wrapper. */
  style?: React.CSSProperties;
}
