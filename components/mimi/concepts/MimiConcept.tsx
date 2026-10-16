"use client";

import "./mimi-concepts.css";
import type { MimiConceptId, MimiConceptProps, MimiConceptState } from "./types";

export const CONCEPT_STATE_ORDER: MimiConceptState[] = [
  "idle",
  "listening",
  "thinking",
  "celebrating",
  "resting",
  "concerned",
];

export const CONCEPT_STATE_META: Record<
  MimiConceptState,
  { label: string; hint: string }
> = {
  idle: { label: "Idle", hint: "breathing · calm" },
  listening: { label: "Listening", hint: "lean · soft ripple" },
  thinking: { label: "Thinking", hint: "bob · twinkle" },
  celebrating: { label: "Celebrating", hint: "small hop · smile" },
  resting: { label: "Resting", hint: "sleepy · settle" },
  concerned: { label: "Concerned", hint: "hands close · soft eyes" },
};

const CONCEPT_LABEL: Record<MimiConceptId, string> = {
  "pocket-cloud": "Pocket Cloud",
  "pebble-glow": "Pebble Glow",
  "calm-compass": "Calm Compass",
};

const CONCEPT_IMAGE: Record<MimiConceptId, string> = {
  "pocket-cloud": "/mimi-concepts/pocket-cloud.png",
  "pebble-glow": "/mimi-concepts/pebble-glow.png",
  "calm-compass": "/mimi-concepts/calm-compass.png",
};

const STATE_CELL: Record<MimiConceptState, { col: number; row: number }> = {
  idle: { col: 0, row: 0 },
  listening: { col: 1, row: 0 },
  thinking: { col: 2, row: 0 },
  celebrating: { col: 0, row: 1 },
  resting: { col: 1, row: 1 },
  concerned: { col: 2, row: 1 },
};

const STATE_MOTION: Record<MimiConceptState, string> = {
  idle: "mc-motion-breathe",
  listening: "mc-motion-listen",
  thinking: "mc-motion-think",
  celebrating: "mc-motion-celebrate",
  resting: "mc-motion-rest",
  concerned: "mc-motion-concern",
};

const STATE_CENTER_OFFSET: Record<
  MimiConceptId,
  Record<MimiConceptState, { x: number; y: number }>
> = {
  "pocket-cloud": {
    idle: { x: -51, y: -43 },
    listening: { x: -6, y: -58 },
    thinking: { x: 35, y: -48 },
    celebrating: { x: -16, y: 46 },
    resting: { x: 1, y: 23 },
    concerned: { x: 35, y: 33 },
  },
  "pebble-glow": {
    idle: { x: -53, y: -34 },
    listening: { x: 9, y: -39 },
    thinking: { x: 46, y: -43 },
    celebrating: { x: -41, y: 48 },
    resting: { x: 3, y: 8 },
    concerned: { x: 50, y: 35 },
  },
  "calm-compass": {
    idle: { x: -72, y: -29 },
    listening: { x: 22, y: -32 },
    thinking: { x: 86, y: -30 },
    celebrating: { x: -77, y: 57 },
    resting: { x: 4, y: 31 },
    concerned: { x: 100, y: 40 },
  },
};

export default function MimiConcept({
  concept = "pocket-cloud",
  state = "idle",
  size = 220,
  idle = true,
  style = {},
  "aria-label": ariaLabel,
}: MimiConceptProps) {
  const cell = STATE_CELL[state];
  const motionClass = idle ? STATE_MOTION[state] : "";
  const centerOffset = STATE_CENTER_OFFSET[concept][state];
  const panX = (centerOffset.x / 512) * size;
  const panY = (centerOffset.y / 512) * size;

  return (
    <div style={{ width: size, height: size, position: "relative", ...style }}>
      <div
        className="mc-crop-stage"
        role="img"
        aria-label={
          ariaLabel ??
          `${CONCEPT_LABEL[concept]} Mimi concept, ${CONCEPT_STATE_META[
            state
          ].label.toLowerCase()}`
        }
      >
        <div className="mc-crop-frame">
          <div className={`mc-character-motion ${motionClass}`}>
            <div
              className="mc-crop-position"
              style={{ transform: `translate(${panX}px, ${panY}px)` }}
            >
              <img
                src={CONCEPT_IMAGE[concept]}
                alt=""
                aria-hidden="true"
                className="mc-crop-sheet"
                draggable={false}
                style={{
                  transform: `translate(${-cell.col * 33.333333}%, ${
                    -cell.row * 50
                  }%)`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
