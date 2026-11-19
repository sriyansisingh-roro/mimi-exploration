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

## Reduced motion

Every file carries its own guard:

```css
@media(prefers-reduced-motion:reduce){*{animation:none!important}}
```

When the viewer has asked their system for reduced motion, the mascot settles
to its static pose instead of looping. The guard lives inside each SVG rather
than in the host app's stylesheet, so it still applies when the file is used
as an `<img>`, where outside CSS cannot reach it. Nothing disappears when the
animation is suppressed: no animated element depends on its keyframes to
become visible.

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

## Dark theme

`dark/states/` and `dark/avatars/` hold the same twenty animations with the
body recoloured for dark surfaces. Taken from the Figma dark frame, the only
difference is the purple ramp:

| light     | dark      |
|-----------|-----------|
| `#ECE6FC` | `#E6DDFA` |
| `#C9BDF1` | `#B6A2E6` |
| `#A78FDE` | `#8674C6` |

The artwork also bakes in its own surface, a plate behind each state and a disc
behind each avatar, so the dark files recolour those too:

| light     | dark      |                    |
|-----------|-----------|--------------------|
| `#F5F2FC` | `#241F2E` | state plate        |
| `#FCFBFF` | `#241F2E` | avatar disc, inner |
| `#EEE9FB` | `#241F2E` | avatar disc, outer |
| `#E4DEF4` | `#3B3348` | avatar ring        |

The Figma dark frame leaves these light because it sits on a white board. An
asset meant for a dark surface cannot carry a light card with it, so these four
values differ from Figma on purpose. Everything else matches.

The avatar disc is a gradient in light. On dark both stops take the plate
colour, so an avatar and a state sit on exactly the same ground; the ring still
defines the circular crop.

Ink, cheeks and the glow orb are identical in both themes.
