"use client";

import { useState } from "react";
import { Instrument_Serif, Manrope, Space_Grotesk } from "next/font/google";
import MimiConcept, {
  CONCEPT_STATE_META,
  CONCEPT_STATE_ORDER,
} from "@/components/mimi/concepts/MimiConcept";
import type {
  MimiConceptId,
  MimiConceptState,
} from "@/components/mimi/concepts/types";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
});
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
});
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
});

const C = {
  primary: "#6C73FF",
  accent: "#FF9A8B",
  ink: "#252A44",
  soft: "#7C7F95",
  muted: "#A7ABBE",
  bg: "#FBFAFF",
  cool: "#F2F4FF",
  warm: "#FFF8F1",
  line: "#E6E7F5",
  leaf: "#69BD6E",
  white: "#FFFFFF",
};

const SERIF = "var(--font-instrument)";
const SANS = "var(--font-manrope)";
const MONO = "var(--font-grotesk)";

type Concept = {
  id: MimiConceptId;
  name: string;
  tag: string;
  accent: string;
  lead: string;
};

type StateMotion = {
  state: string;
  expression: string;
  body: string;
  secondary: string;
  accessory: string;
  timing: string;
  css: string;
};

const CONCEPTS: Concept[] = [
  {
    id: "pocket-cloud",
    name: "Pocket Cloud",
    tag: "Recommended",
    accent: C.primary,
    lead:
      "The calmest and most distinct route: a pillowy cloud-bud with a green study-marker accent.",
  },
  {
    id: "pebble-glow",
    name: "Pebble Glow",
    tag: "Playful",
    accent: C.leaf,
    lead:
      "A magical pebble-drop companion with a floating green leaf-ring and soft inner glow.",
  },
  {
    id: "calm-compass",
    name: "Calm Compass",
    tag: "Guidance",
    accent: C.accent,
    lead:
      "A gentle guide shape with a rounded teardrop body and a crescent green cap.",
  },
];

const MOTION_SPECS: Record<MimiConceptId, StateMotion[]> = {
  "pocket-cloud": [
    {
      state: "Idle",
      expression: "Open oval eyes, tiny smile, low blush.",
      body: "Slow cloud breathing: center lobe lifts 2px while side lobes widen slightly, then settles.",
      secondary: "Tucked arms float outward by 1-2deg; feet stay planted with a soft grounding glow.",
      accessory: "Green bookmark tab sways once every breath, no independent sparkle.",
      timing: "4.2s ease-in-out loop, blink every 5.2s.",
      css: "pc-breathe + pc-tab-sway",
    },
    {
      state: "Listening",
      expression: "Eyes widen, mouth becomes a small attentive dot.",
      body: "Whole body leans 6deg toward the speaker, then eases back halfway without fully centering.",
      secondary: "Nearest lobe rises like a soft ear; one hand lifts to cheek height.",
      accessory: "Three lavender ripple arcs fade outward from the listening side; tab gives a tiny answer flick.",
      timing: "3.4s lean loop, ripple staggered every 650ms.",
      css: "pc-listen-lean + pc-ripple",
    },
    {
      state: "Thinking",
      expression: "Eyes look up-right, brows barely raised, small rounded mouth.",
      body: "Gentle vertical bob with a 1deg alternating tilt, like a quiet thought pulse.",
      secondary: "Top lobe rises first, side lobes follow 120ms later for a soft delayed squash/stretch.",
      accessory: "Single star twinkle above the bookmark scales 0.4 -> 1 -> 0.7 and fades.",
      timing: "2.8s bob loop, twinkle every 2.2s.",
      css: "pc-think-bob + pc-twinkle",
    },
    {
      state: "Celebrating",
      expression: "Closed-eye smile, brighter blush, open happy mouth.",
      body: "Small buoyant hop: anticipatory squash, 10px lift, soft landing squash, return to idle.",
      secondary: "Both arms lift high; side lobes puff outward at the top of the hop.",
      accessory: "Two short joy ticks and one tiny star near the bookmark; no busy confetti field.",
      timing: "2.1s hop loop with 180ms landing squash.",
      css: "pc-hop + pc-joy-ticks",
    },
    {
      state: "Resting",
      expression: "Closed sleepy eyes, tiny relaxed smile.",
      body: "Cloud curls sideways into a pillow shape, compressing down 3px on each slow exhale.",
      secondary: "One arm tucks under the cheek; feet become barely visible and static.",
      accessory: "Bookmark tab droops lower and drifts 1px with the breath.",
      timing: "5.4s snooze loop, no blink.",
      css: "pc-snooze + pc-tab-droop",
    },
    {
      state: "Concerned",
      expression: "Larger wet-looking eyes, small curved brows, tiny downturned mouth.",
      body: "Lobes pull inward and down, then release slightly; movement reads like quiet empathy, not panic.",
      secondary: "Hands meet near the center lobe and softly pulse inward.",
      accessory: "Bookmark stays still so the face carries the emotion.",
      timing: "4.6s care-sway loop, optional single blink at 5s.",
      css: "pc-care-sway + pc-hands-hold",
    },
  ],
  "pebble-glow": [
    {
      state: "Idle",
      expression: "Round calm eyes, tiny centered smile, soft blush.",
      body: "Pebble breathes from its base: 1.5px lift, slight vertical stretch, then a warm settle.",
      secondary: "Tiny feet stay fixed; arms hover at a relaxed 10deg angle.",
      accessory: "Leaf-ring orbits only 4-6deg, more like a soft halo sway than a spin.",
      timing: "4s ease-in-out loop, blink every 4.8s.",
      css: "pgw-breathe + pgw-ring-sway",
    },
    {
      state: "Listening",
      expression: "Eyes track toward the sound, mouth small and quiet.",
      body: "Pebble rotates 5deg toward the sound and leans forward 3px.",
      secondary: "One hand rises to cheek; opposite arm opens slightly for balance.",
      accessory: "Ring pauses its sway while two sound arcs fade in and out beside the face.",
      timing: "3.2s lean loop, sound arcs 1.8s stagger.",
      css: "pgw-listen-tilt + pgw-sound",
    },
    {
      state: "Thinking",
      expression: "Eyes look upward, brows tiny and curious, mouth forms a small o.",
      body: "Slow thoughtful bob with the top of the pebble leading the motion.",
      secondary: "Inner glow brightens subtly at the center during the top of the bob.",
      accessory: "Leaf-ring tilts forward; one star pops near the ring, then dissolves.",
      timing: "2.9s bob loop, star 2.4s loop.",
      css: "pgw-think-bob + pgw-glow-pulse",
    },
    {
      state: "Celebrating",
      expression: "Closed-eye smile, open cheerful mouth.",
      body: "Two-part bounce: small prep dip, 14px hop, rounded landing.",
      secondary: "Arms swing up and outward; feet separate a touch at takeoff.",
      accessory: "Ring lifts 2px with the hop and snaps back softly; two lavender joy ticks appear.",
      timing: "1.9s loop, spring cubic-bezier landing.",
      css: "pgw-hop + pgw-ring-pop",
    },
    {
      state: "Resting",
      expression: "Closed eyes, faint smile, low blush.",
      body: "Pebble rolls onto its side and breathes almost flat, with a 2px blanket-like compression.",
      secondary: "Arms rest against body; feet tuck behind the silhouette.",
      accessory: "Ring slips behind the body and drifts with a slow 5deg sway.",
      timing: "5.6s snooze loop, no accessory sparkle.",
      css: "pgw-rest-roll + pgw-ring-drift",
    },
    {
      state: "Concerned",
      expression: "Soft wide eyes, raised curved brows, small worried mouth.",
      body: "Barely-there side-to-side shiver, capped at 1px so it reads tender rather than nervous.",
      secondary: "Hands lift to cheeks and hold; shoulders tuck inward.",
      accessory: "Ring droops 3deg and stops orbiting.",
      timing: "0.7s micro-shiver layered over 4.2s slow breath.",
      css: "pgw-care-shiver + pgw-ring-droop",
    },
  ],
  "calm-compass": [
    {
      state: "Idle",
      expression: "Steady open eyes, small smile, calm brows.",
      body: "Teardrop remains centered with a grounded inhale/exhale, stretching only 1-2px.",
      secondary: "Arms rest low; feet hold a symmetrical stance.",
      accessory: "Green crescent cap sways 2deg, and the chest star gives a faint opacity pulse.",
      timing: "4.4s breathe loop, blink every 5s.",
      css: "cc-breathe + cc-crescent-sway",
    },
    {
      state: "Listening",
      expression: "Eyes widen and shift toward the listener, mouth becomes a small dot.",
      body: "Body turns 4deg and leans in, with the pointed top following the sound direction.",
      secondary: "One hand lifts toward the cheek; other hand stays low as an anchor.",
      accessory: "Crescent tilts toward the sound; two soft ripple arcs appear behind the head.",
      timing: "3.5s lean loop, ripple repeats every 2s.",
      css: "cc-listen-turn + cc-ripple",
    },
    {
      state: "Thinking",
      expression: "Upward gaze, tiny asymmetrical brows, quiet frown-smile mouth.",
      body: "Small top-led bob: crown rises, lower body follows, then both settle.",
      secondary: "Hands hover close to the body instead of gesturing broadly.",
      accessory: "Single star twinkle near the crescent; chest star brightens once after the twinkle.",
      timing: "3s bob loop, twinkle offset by 700ms.",
      css: "cc-think-bob + cc-star-glow",
    },
    {
      state: "Celebrating",
      expression: "Closed-eye smile and warm blush.",
      body: "Contained hop with a guidance feel: small dip, 9px lift, no big spin.",
      secondary: "Arms open into a small hooray; feet squash on landing.",
      accessory: "Crescent cap pops up 2px and returns; two green-lavender accent ticks appear.",
      timing: "2.2s hop loop with slow landing ease.",
      css: "cc-small-hop + cc-crescent-pop",
    },
    {
      state: "Resting",
      expression: "Closed eyes, tiny content smile.",
      body: "Sits lower and rounder, compressing at the base as if settling into a cushion.",
      secondary: "Arms tuck in, feet shift inward, top point relaxes to one side.",
      accessory: "Crescent slides lower and rocks once per breath.",
      timing: "5.2s settle loop, no twinkle.",
      css: "cc-rest-settle + cc-crescent-low",
    },
    {
      state: "Concerned",
      expression: "Wide soft eyes, curved raised brows, very small downturned mouth.",
      body: "Body leans forward 2deg and pulses inward at the chest, like attentive concern.",
      secondary: "Hands gather near the chest star and hold there.",
      accessory: "Crescent lowers and becomes still; chest star glow dims slightly.",
      timing: "4.8s empathy pulse, optional slow blink.",
      css: "cc-empathy-pulse + cc-hands-chest",
    },
  ],
};

function Pill({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 13px",
        borderRadius: 999,
        background: C.cool,
        border: `1px solid ${C.line}`,
        color,
        fontFamily: MONO,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      <span style={{ width: 7, height: 7, borderRadius: 99, background: color }} />
      {children}
    </span>
  );
}

function ConceptButton({
  concept,
  active,
  onClick,
}: {
  concept: Concept;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        cursor: "pointer",
        textAlign: "left",
        border: `1.5px solid ${active ? concept.accent : C.line}`,
        background: active ? C.cool : C.white,
        color: C.ink,
        borderRadius: 18,
        padding: "14px 15px",
        boxShadow: active
          ? "0 14px 30px -24px rgba(37,42,68,.6)"
          : "0 1px 2px rgba(37,42,68,.04)",
        transition: "border-color .16s ease, background .16s ease, box-shadow .16s ease",
      }}
    >
      <span
        style={{
          display: "block",
          color: active ? concept.accent : C.muted,
          fontFamily: MONO,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {concept.tag}
      </span>
      <span
        style={{
          display: "block",
          marginTop: 5,
          color: C.ink,
          fontFamily: SANS,
          fontSize: 15,
          fontWeight: 800,
        }}
      >
        {concept.name}
      </span>
    </button>
  );
}

function StateButton({
  state,
  active,
  onClick,
  accent,
}: {
  state: MimiConceptState;
  active: boolean;
  onClick: () => void;
  accent: string;
}) {
  const meta = CONCEPT_STATE_META[state];

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        cursor: "pointer",
        textAlign: "left",
        border: `1.5px solid ${active ? accent : C.line}`,
        background: active ? C.cool : C.white,
        color: C.ink,
        borderRadius: 16,
        padding: "12px 13px",
        boxShadow: active
          ? "0 12px 26px -22px rgba(37,42,68,.6)"
          : "0 1px 2px rgba(37,42,68,.04)",
      }}
    >
      <span style={{ display: "block", color: C.ink, fontSize: 13, fontWeight: 800 }}>
        {meta.label}
      </span>
      <span style={{ display: "block", marginTop: 3, color: C.muted, fontSize: 11.5 }}>
        {meta.hint}
      </span>
    </button>
  );
}

function LiveStage({
  concept,
  state,
}: {
  concept: Concept;
  state: MimiConceptState;
}) {
  const meta = CONCEPT_STATE_META[state];

  return (
    <div>
      <div
        style={{
          minHeight: 430,
          borderRadius: 26,
          background: `radial-gradient(120% 100% at 50% 18%, ${C.white} 0%, ${C.warm} 42%, ${C.cool} 100%)`,
          border: `1px solid ${C.line}`,
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,.8)",
        }}
      >
        <MimiConcept concept={concept.id} state={state} size={310} />
      </div>
      <div
        style={{
          marginTop: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 9,
          color: C.soft,
          fontSize: 13,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 99,
            background: concept.accent,
            boxShadow: `0 0 0 5px ${C.cool}`,
          }}
        />
        <b style={{ color: C.ink }}>{concept.name}</b>
        <span>
          {meta.label} · {meta.hint}
        </span>
      </div>
    </div>
  );
}

function MotionSpecCard({
  motion,
  accent,
}: {
  motion: StateMotion;
  accent: string;
}) {
  return (
    <article
      style={{
        background: C.white,
        border: `1px solid ${C.line}`,
        borderRadius: 18,
        padding: "18px 18px 20px",
        boxShadow: "0 1px 2px rgba(37,42,68,.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <h4
          style={{
            margin: 0,
            color: C.ink,
            fontFamily: SANS,
            fontSize: 16,
            fontWeight: 800,
          }}
        >
          {motion.state}
        </h4>
        <span
          style={{
            border: `1px solid ${C.line}`,
            borderRadius: 999,
            color: accent,
            background: C.cool,
            fontFamily: MONO,
            fontSize: 10,
            fontWeight: 700,
            padding: "5px 8px",
            whiteSpace: "nowrap",
          }}
        >
          {motion.css}
        </span>
      </div>

      <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
        <MotionLine label="Expression" value={motion.expression} />
        <MotionLine label="Body" value={motion.body} />
        <MotionLine label="Secondary" value={motion.secondary} />
        <MotionLine label="Accessory" value={motion.accessory} />
        <MotionLine label="Timing" value={motion.timing} />
      </div>
    </article>
  );
}

function MotionLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          color: C.muted,
          fontFamily: MONO,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <p style={{ margin: "3px 0 0", color: C.soft, fontSize: 13, lineHeight: 1.45 }}>
        {value}
      </p>
    </div>
  );
}

function ConceptMotionSection({ concept }: { concept: Concept }) {
  const specs = MOTION_SPECS[concept.id];

  return (
    <section
      style={{
        borderTop: `1px solid ${C.line}`,
        paddingTop: 34,
        marginTop: 34,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        <div>
          <Pill color={concept.accent}>{concept.tag}</Pill>
          <h3
            style={{
              margin: "12px 0 0",
              color: C.ink,
              fontFamily: SERIF,
              fontSize: 32,
              fontWeight: 400,
              lineHeight: 1.08,
            }}
          >
            {concept.name} motion
          </h3>
        </div>
        <p
          style={{
            margin: 0,
            maxWidth: 470,
            color: C.soft,
            fontSize: 14,
            lineHeight: 1.58,
          }}
        >
          {concept.name} should keep one constant silhouette and change through
          face, posture, accessory behavior, and one restrained loop per state.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: 16,
        }}
      >
        {specs.map((motion) => (
          <MotionSpecCard key={motion.state} motion={motion} accent={concept.accent} />
        ))}
      </div>
    </section>
  );
}

export default function MimiNewCharacterPage() {
  const [selectedId, setSelectedId] = useState<MimiConceptId>("pocket-cloud");
  const [selectedState, setSelectedState] = useState<MimiConceptState>("idle");
  const selected = CONCEPTS.find((concept) => concept.id === selectedId) ?? CONCEPTS[0];

  return (
    <div
      className={`${manrope.variable} ${instrument.variable} ${grotesk.variable}`}
      style={{
        minHeight: "100dvh",
        background: C.bg,
        color: C.ink,
        fontFamily: SANS,
      }}
    >
      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "56px 40px 90px" }}>
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))",
            gap: 42,
            alignItems: "center",
            background: C.white,
            border: `1px solid ${C.line}`,
            borderRadius: 32,
            padding: "46px",
            boxShadow:
              "0 1px 2px rgba(37,42,68,.04), 0 40px 90px -54px rgba(37,42,68,.32)",
          }}
        >
          <LiveStage concept={selected} state={selectedState} />

          <div>
            <Pill color={selected.accent}>Mimi · new companion</Pill>
            <h1
              style={{
                margin: "18px 0 0",
                color: C.ink,
                fontFamily: SERIF,
                fontSize: 52,
                fontWeight: 400,
                letterSpacing: "-0.02em",
                lineHeight: 1.02,
              }}
            >
              Start with
              <br />
              {selected.name}.
            </h1>
            <p
              style={{
                margin: "16px 0 24px",
                maxWidth: 430,
                color: C.soft,
                fontSize: 15,
                lineHeight: 1.65,
              }}
            >
              {selected.lead}
            </p>
            <div style={{ display: "grid", gap: 10 }}>
              {CONCEPTS.map((concept) => (
                <ConceptButton
                  key={concept.id}
                  concept={concept}
                  active={concept.id === selected.id}
                  onClick={() => setSelectedId(concept.id)}
                />
              ))}
            </div>
            <div style={{ marginTop: 24 }}>
              <div
                style={{
                  color: C.muted,
                  fontFamily: MONO,
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  marginBottom: 10,
                  textTransform: "uppercase",
                }}
              >
                Live states
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 10,
                }}
              >
                {CONCEPT_STATE_ORDER.map((state) => (
                  <StateButton
                    key={state}
                    state={state}
                    active={state === selectedState}
                    accent={selected.accent}
                    onClick={() => setSelectedState(state)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
