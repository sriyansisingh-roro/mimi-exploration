# Mimi — Admin (approved set)

The approved admin mascot: bowler hat, glasses, checked note. The concept
rounds it was chosen from live in `../mimi-admin-concepts/`.

```
state.svg    150×150   full body, animated        hat, glasses, note
avatar.svg   132×132   face in a circle, animated glasses only
```

The avatar carries no hat. The avatar frame is a tight face crop, so a hat at
its full-body position overhangs the top edge, and seating it inside the circle
means shrinking and lowering it away from the approved proportions.

That leaves the glasses as the only admin cue, and they are drawn at 1.05,
which renders at 1.01 CSS px at 96px and 0.50 px at 48px. Below roughly 96px a
line that thin greys out rather than draws, so the avatar stops reading as the
admin. Use it at 96px and up. Anywhere smaller, use `state.svg`.

`avatar.svg` is built on the same face-only base as the ten avatars in
`../mimi-motion-svg/avatars/`, so it matches them. It is not the full body
cropped into a circle, which is what the earlier `p1-focused-avatar.svg` did
and why that one showed arms and feet and sat small in its frame.

The two drawings share geometry exactly, so accessories move between them with

```
x132 = 66 + 1.32 * (x150 - 70)
y132 = 14.2341 + 1.32 * (y150 - 39.2)
```

The hat is the one exception: at its full-body position it overhangs the tight
avatar crop, so it is seated lower on the head and scaled to 0.92.

Both files honour `prefers-reduced-motion`.
