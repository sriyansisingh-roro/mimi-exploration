import type { CSSProperties } from "react";

export type MimiConceptId = "pocket-cloud" | "pebble-glow" | "calm-compass";

export type MimiConceptState =
  | "idle"
  | "listening"
  | "thinking"
  | "celebrating"
  | "resting"
  | "concerned";

export interface MimiConceptProps {
  concept?: MimiConceptId;
  state?: MimiConceptState;
  size?: number;
  idle?: boolean;
  style?: CSSProperties;
  "aria-label"?: string;
}

