# Mimi — Admin (approved set)

The approved admin mascot (hat, glasses, checked note) and the variants
derived from it. The concept rounds live in `../mimi-admin-concepts/`.

```
state.svg    150×150   full body, animated      use at 96px and up
avatar.svg   132×132   face in a circle, animated   use at 48–96px
mark.svg     132×132   simplified, static       use at 32px and below
```

## Why there are two marks

Every stroke in `avatar.svg` is between 1.05 and 1.54 units in a 132 viewBox.
Rendered at 32px that is 0.31–0.46 CSS px, and at 24px it is 0.23–0.34 px.
Below 1px a stroke is alpha-blended into a grey smear, so the glasses, the
smile and the ring border stop reading and the face turns muddy.

`mark.svg` drops everything that depends on a hairline and keeps only shapes
that survive any size: the silhouette, the bowler hat, the eyes and the
cheeks. It is also static, since a favicon that breathes is noise.

Use `avatar.svg` where the character should read, and `mark.svg` where the
logo just has to be recognisable.
