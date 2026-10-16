/**
 * Mimi (penguin chick) — mood model.
 *
 * The confirmed companion character: a soft, 3D-styled penguin chick — a
 * lavender "hood" wrapping a white face, a little cowlick curl, a tiny orange
 * beak and soft pink cheeks. Identity (hood, cowlick, body) stays constant;
 * only the eyes / brows / mouth / cheeks / a touch of motion change per mood.
 *
 * Ten moods, one Mimi. Keep this list closed so the rest of the app can switch
 * on it exhaustively.
 */
export type MimiMood =
  | "happy" // bright and warm — the everyday Mimi
  | "calm" // settled and at ease, breathing slow
  | "listening" // tilted in, fully paying attention
  | "encouraging" // "you've got this" — a proud little nudge
  | "thinking" // curious, mulling something over
  | "sad" // empathetic — sitting with you through the hard bit
  | "worried" // gently concerned, here just in case
  | "sleepy" // winding down, soft and drowsy
  | "celebrating" // a small win is a real win — hooray!
  | "loving"; // caring — soft, fond, looking out for you

export type EyeType =
  | "happy"
  | "calm"
  | "sleepy"
  | "wide"
  | "look"
  | "sad"
  | "heart"
  | "open";
export type BrowType = "sad" | "worry" | "think" | "raise" | null;
export type MouthType = "laugh" | "smile" | "frown" | "beak";
export type AccessoryType =
  | "star"
  | "dots"
  | "sound"
  | "zzz"
  | "tear"
  | "hearts"
  | "confetti"
  | null;

export interface MoodConfig {
  eyes: EyeType;
  mouth: MouthType;
  brow: BrowType;
  blush: number;
  acc: AccessoryType;
  motion: string; // CSS class for the idle body gesture
  label: string;
  blurb: string;
}

export interface MimiPenguinProps {
  /** Current mood. Defaults to "happy". */
  mood?: MimiMood;
  /** Rendered square size in px (internal viewBox is 200×205). Defaults to 200. */
  size?: number;
  /** Whether the idle / mood micro-motion plays. Defaults to true. */
  idle?: boolean;
  /** Extra inline styles on the root wrapper. */
  style?: React.CSSProperties;
  /** Accessible label. Defaults to a mood-aware description. */
  "aria-label"?: string;
}
