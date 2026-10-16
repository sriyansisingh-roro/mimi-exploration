# Mimi — Motion (animated SVG)

Self-contained, looping, vector-crisp animations for the finalized Mimi mascot.
No JS, no library, ~7 KB each. Drop straight into the app.

```
states/   01-idle … 10-typing      (full-body, 150×150 viewBox)
avatars/  01-idle … 10-typing      (face-only circle, 132×132 viewBox)
review.html                        (open in a browser to preview all 20)
```

## Usage

```tsx
// as an <img>
<img src="/mimi-motion-svg/states/01-idle.svg" width={120} height={120} alt="Mimi" />

// or inline the SVG to control via CSS
```

## Motion model (per state)

Each animation layers three things, tuned per mood:

- **Body** — moves by translation only (no scaling/squash), so the mascot's
  shape and face stay pixel-identical to the static design: idle float,
  listening lean, thinking rise, concerned sway, celebrating hop, resting
  slow float, encouraging bob, waiting sway, reassurance float, typing nod.
- **Glow orb** — the warm top-right dot keeps its original color/design and
  just twinkles in place (scale + brightness pulse).
- **Signature element** — sound ripples (listening), "?" thought-bubble
  (thinking), tear (concerned), confetti (celebrating), "z z z" (resting),
  "Wow!" pop (encouraging), clock + pulsing dots (waiting), heartbeat
  (reassurance), bouncing dots (typing), sparkles (idle).

States: `idle, listening, thinking, concerned, celebrating, resting,
encouraging, waiting, reassurance, typing`.
