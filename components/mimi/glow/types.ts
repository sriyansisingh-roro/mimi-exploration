import type { CSSProperties } from "react";

export type MimiGlowState =
  | "idle"
  | "listening"
  | "thinking"
  | "concerned"
  | "celebrating"
  | "resting"
  | "encouraging"
  | "waiting"
  | "error"
  | "typing";

export type EyeMode = "open" | "look" | "soft" | "happy" | "sleepy" | "wide" | "aside";
export type BrowMode = "none" | "raise" | "care";
export type MouthMode = "gentle" | "smile" | "soft" | "small" | "relaxed";
export type GlowMode = "steady" | "pulse" | "bright" | "soft" | "warm" | "dim";
export type AccType = "ripple" | "think" | "spark" | "typing" | null;

export interface StateConfig {
  eye: EyeMode;
  brow: BrowMode;
  mouth: MouthMode;
  glow: GlowMode;
  acc: AccType;
  tilt: number;
  motion: string;
  label: string;
  feel: string;
}

export interface MimiGlowProps {
  state?: MimiGlowState;
  size?: number;
  idle?: boolean;
  style?: CSSProperties;
  "aria-label"?: string;
}
