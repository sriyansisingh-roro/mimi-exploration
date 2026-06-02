/**
 * Mimi — state model.
 *
 * The character is driven by a single discriminated state. Each state maps to
 * a posture + micro-animation; transitions between them are smooth (handled in
 * <Mimi />). Keep this list closed — new behaviors should be new states here
 * so the rest of the app can switch on them exhaustively.
 */
export type MimiState =
  | "idle" // gentle breathing, occasional slow blink
  | "listening" // soft head tilt, eyes track, alert-but-calm
  | "thinking" // small bob + a quiet sparkle near the head
  | "celebrating" // small smile + soft single hop (never a big reaction)
  | "resting" // sleepy, off to the side, low opacity
  | "concerned"; // soft, present, quiet — no alarm, never sad

export interface MimiProps {
  /** Current behavioral state. Defaults to "idle". */
  state?: MimiState;
  /** Rendered square size in px (internal viewBox is 200×200). Defaults to 200. */
  size?: number;
  /** Extra classes on the root <svg>. */
  className?: string;
  /** Accessible label. Defaults to a state-aware description. */
  "aria-label"?: string;
}
