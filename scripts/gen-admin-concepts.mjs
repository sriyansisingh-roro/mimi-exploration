// Generates admin-Mimi concept SVGs from the finalized idle state.
// usage: node scripts/gen-admin-concepts.mjs .
import fs from "node:fs";
import path from "node:path";

const root = process.argv[2];
const src = fs.readFileSync(path.join(root, "public/mimi-motion-svg/states/01-idle.svg"), "utf8");
const outDir = path.join(root, "public/mimi-admin-concepts");
fs.mkdirSync(outDir, { recursive: true });

const lines = src.split("\n");
const L = (n) => lines[n - 1]; // 1-indexed like `cat -n`
const ARM_L = L(17);
const ARM_R = L(18);
const EYES = [29, 30, 31, 32].map(L).join("\n");

// ---- accessories (inner coords, same frame as the body) ----
const INK = "#3A3460", ACC = "#6F4BBD", ACC2 = "#8B6FD0", LINE = "#E4DEF4", SOFT = "#C9BDF1";

const HAT = `
<g transform="translate(0 1.6) rotate(-6 68 40)">
<ellipse cx="68" cy="43.2" rx="15" ry="2" fill="${INK}" opacity=".14"/>
<path d="M54.5 39.5C54.5 27.5 60.2 21 68 21C75.8 21 81.5 27.5 81.5 39.5Z" fill="${INK}"/>
<rect x="54.6" y="34" width="26.8" height="4.4" fill="${ACC}"/>
<ellipse cx="68" cy="39.6" rx="19.5" ry="3.6" fill="${INK}"/>
<path d="M59.5 31C60.3 26.8 62.8 24.2 66 23.6" stroke="#fff" stroke-opacity=".28" stroke-width="1.6" stroke-linecap="round"/>
</g>`;

const TIE = `
<path d="M67.4 92.4H72.6L71.7 97H68.3Z" fill="${ACC}"/>
<path d="M68.3 97H71.7L73.8 106.6L70 110.4L66.2 106.6Z" fill="${ACC}"/>`;

const check = (x, y) =>
  `<path d="M${x} ${y}l1.6 1.7 3.2-3.6" stroke="${ACC}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;

// A — wide document held up with both arms (arms redrawn on top to "grip")
const PAPER = `
<g transform="rotate(-3 70 106)">
<rect x="34" y="93" width="72" height="26" rx="2.6" fill="#fff" stroke="${LINE}" stroke-width="1"/>
<path d="M42 100H76M42 105.5H84M42 111H70" stroke="${SOFT}" stroke-width="1.7" stroke-linecap="round"/>
${check(88, 100)}${check(88, 106)}
<circle cx="91.5" cy="112.4" r="1.6" fill="${SOFT}"/>
</g>
${ARM_L}
${ARM_R}`;

// B — small stack of papers tucked under the left arm
const STACK = `
<g transform="rotate(-14 26 98)">
<rect x="12" y="86" width="21" height="27" rx="2" fill="#fff" stroke="${LINE}" stroke-width="1"/>
<rect x="14.5" y="84" width="21" height="27" rx="2" fill="#fff" stroke="${LINE}" stroke-width="1"/>
<rect x="17" y="82" width="21" height="27" rx="2" fill="#fff" stroke="${LINE}" stroke-width="1"/>
<path d="M21 89H33M21 93.5H31M21 98H33M21 102.5H28" stroke="${SOFT}" stroke-width="1.5" stroke-linecap="round"/>
</g>
${ARM_L}`;

// C — clipboard with a checklist, held by the right arm
const CLIPBOARD = `
<g transform="rotate(9 94 104)">
<rect x="80" y="86" width="28" height="36" rx="3.2" fill="${ACC}"/>
<rect x="83" y="91" width="22" height="28" rx="1.6" fill="#fff"/>
<rect x="89" y="84" width="10" height="5.4" rx="1.6" fill="${INK}"/>
${check(85.2, 97.6)}<path d="M92 96.8H102" stroke="${SOFT}" stroke-width="1.6" stroke-linecap="round"/>
${check(85.2, 104.6)}<path d="M92 103.8H100" stroke="${SOFT}" stroke-width="1.6" stroke-linecap="round"/>
<rect x="85.4" y="108.6" width="4.2" height="4.2" rx="1" stroke="${SOFT}" stroke-width="1.1" fill="none"/>
<path d="M92 110.8H101" stroke="${SOFT}" stroke-width="1.6" stroke-linecap="round"/>
</g>
${ARM_R}`;

// ---- minimal round: smaller pieces, one tone (ink + white), accent only on a single check ----
const INK_SOFT = "#4E4780";

const HAT_MIN = `
<g transform="translate(0 2) rotate(-7 68 40)">
<ellipse cx="68" cy="42.6" rx="11.5" ry="1.5" fill="${INK}" opacity=".1"/>
<path d="M58 39.6C58 30.4 62.3 25.6 68 25.6C73.7 25.6 78 30.4 78 39.6Z" fill="${INK}"/>
<rect x="58.1" y="36" width="19.8" height="2.2" fill="${INK_SOFT}"/>
<ellipse cx="68" cy="39.7" rx="15" ry="2.6" fill="${INK}"/>
<path d="M62 33C62.6 30.2 64.2 28.5 66.4 28" stroke="#fff" stroke-opacity=".22" stroke-width="1.2" stroke-linecap="round"/>
</g>`;

const TIE_MIN = `
<path d="M68.4 92.8H71.6L71.1 95.4H68.9Z" fill="${INK}" opacity=".88"/>
<path d="M68.9 95.4H71.1L72.4 102.2L70 104.6L67.6 102.2Z" fill="${INK}" opacity=".88"/>`;

const NOTE_MIN = `
<g transform="rotate(8 97 102)">
<rect x="88" y="90" width="18" height="23" rx="2.2" fill="#fff" stroke="${LINE}" stroke-width=".9"/>
<path d="M92 96.2H102M92 100.6H99" stroke="${SOFT}" stroke-width="1.3" stroke-linecap="round"/>
<path d="M92.2 106.2l1.4 1.5 2.8-3.2" stroke="${ACC}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</g>
${ARM_R}`;

// ---- round 3: reading glasses + a natural, non-default expression (replaces eyes + mouth) ----
const MOUTH = L(33);
const eye = (cx, cy, ry = 3.64) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="2.94" ry="${ry}" fill="${INK}"/>` +
  `<circle cx="${cx - 0.9}" cy="${cy - ry * 0.38}" r=".85" fill="#fff"/>`;
const stroke = (d, w = 1.26, op = 0.72) =>
  `<path d="${d}" stroke="${INK}" stroke-width="${w}" stroke-linecap="round" opacity="${op}" fill="none"/>`;
const lens = (cx, cy, r) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" fill-opacity=".16" stroke="${INK}" stroke-width="1.3"/>`;

// Reading: eyes lowered toward the note, soft lids, focused brows, small asymmetric "hmm" mouth
const FACE_READING = `
${eye(59.2, 79.6, 3)}${eye(83, 79.6, 3)}
${stroke("M55.6 77.2Q59.2 75.6 62.8 77.4", 1.1, 0.9)}${stroke("M79.4 77.4Q83 75.6 86.6 77.2", 1.1, 0.9)}
${stroke("M54.4 70.8Q57.8 69.4 61.4 70.4")}${stroke("M78.6 70.4Q82.2 69.4 85.6 70.8")}
${lens(58.6, 78.6, 6.4)}${lens(82.4, 78.6, 6.4)}
${stroke("M65 77.8Q70.5 75.6 76 77.8", 1.3, 1)}${stroke("M52.2 77.6L48 76.4", 1.3, 1)}${stroke("M88.8 77.6L93 76.4", 1.3, 1)}
${stroke("M67.4 89.4Q70.6 90.8 73.8 88.8", 1.68, 1)}`;

// Peering over the glasses: frames low on the face, eyes up at you, one brow raised, small smirk
const FACE_PEERING = `
${eye(58.1, 76.2)}${eye(81.9, 76.2)}
${stroke("M54.2 69.6Q57.8 68.6 61.4 69.6")}${stroke("M78.2 67.6Q82.2 65.4 86.2 67.2")}
${lens(58.4, 85.4, 5.2)}${lens(81.6, 85.4, 5.2)}
${stroke("M63.6 84.4Q70 82.4 76.4 84.4", 1.3, 1)}${stroke("M53.2 84.6L49.4 83.4", 1.3, 1)}${stroke("M86.8 84.6L90.6 83.4", 1.3, 1)}
${stroke("M66.4 89.6Q70.4 91.2 74.4 88.2", 1.68, 1)}`;

// ---- round 4: premium pass — fewer strokes; expression comes from eye shape, not extra lines ----
// Calm, half-lidded eye: soft flat-ish top, original rounded bottom
const calmEye = (cx, cy) =>
  `<path d="M${cx - 2.94} ${cy - 1.1}Q${cx} ${cy - 2.9} ${cx + 2.94} ${cy - 1.1}C${cx + 2.94} ${cy + 2.4} ${cx + 1.6} ${cy + 3.6} ${cx} ${cy + 3.6}C${cx - 1.6} ${cy + 3.6} ${cx - 2.94} ${cy + 2.4} ${cx - 2.94} ${cy - 1.1}Z" fill="${INK}"/>` +
  `<circle cx="${cx - 0.9}" cy="${cy - 0.1}" r=".75" fill="#fff"/>`;
const fineLens = (cx, cy) =>
  `<circle cx="${cx}" cy="${cy}" r="5.8" stroke="${INK}" stroke-width="1.05" opacity=".92" fill="none"/>`;

const FACE_PRO = `
${calmEye(58.7, 78.6)}${calmEye(82.5, 78.6)}
${fineLens(58.6, 78.6)}${fineLens(82.4, 78.6)}
${stroke("M64.4 78Q70.5 76.4 76.6 78", 1.05, 0.92)}${stroke("M52.8 77.8L50.9 77", 1.05, 0.92)}${stroke("M88.2 77.8L90.1 77", 1.05, 0.92)}
${stroke("M66.8 89Q70.2 90.8 73.6 88.5", 1.5, 1)}`;

const HAT_PRO = HAT_MIN.replace('rotate(-7 68 40)', 'rotate(-4 68 40)').replace(/\n<ellipse cx="68" cy="42.6"[^\n]*/, "");

const NOTE_PRO = `
<g transform="rotate(5 97 102)">
<rect x="88" y="90" width="18" height="23" rx="2.4" fill="#fff" stroke="${LINE}" stroke-width=".8"/>
<path d="M92 96.4H102M92 100.6H98.5" stroke="${SOFT}" stroke-width="1.1" stroke-linecap="round"/>
<path d="M92.3 106.1l1.3 1.4 2.6-3" stroke="${ACC}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</g>
${ARM_R}`;

const face = (f) => (s) => s.replace(`${EYES}\n${MOUTH}`, f);

const lookAt =(dx, dy) => (s) => s.replace(EYES, `<g transform="translate(${dx} ${dy})">\n${EYES}\n</g>`);

function build({ extras, eyes = (s) => s }) {
  let s = src
    .replace(/\n<g><path class="tw tw1"[\s\S]*?<\/g>\n/, "\n") // drop idle sparkles
    .replace(/\.tw\{[^\n]*\n/, "");
  s = eyes(s);
  // inject accessories inside the body group (they float with Mimi), after the orb
  s = s.replace("<defs>", `${extras}\n<defs>`);
  return s;
}

// Avatar = circular crop of the same art (head + hat), so it never drifts from the full body.
function avatar(stateSvg, vb) {
  const inner = stateSvg
    .replace(/^<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "")
    .replace(/<rect width="150" height="150"[^>]*\/>/, "");
  return `<svg viewBox="0 0 132 132" xmlns="http://www.w3.org/2000/svg">
<defs><clipPath id="av"><circle cx="66" cy="66" r="64.9"/></clipPath>
<radialGradient id="avbg" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(66 53) scale(93.456)"><stop stop-color="#FCFBFF"/><stop offset="1" stop-color="#EEE9FB"/></radialGradient></defs>
<circle cx="66" cy="66" r="64.9" fill="url(#avbg)"/>
<g clip-path="url(#av)"><svg x="0" y="0" width="132" height="132" viewBox="${vb}">${inner}</svg></g>
<circle cx="66" cy="66" r="63.8" stroke="#E4DEF4" stroke-width="1.54" fill="none" opacity=".7"/>
</svg>`;
}

const concepts = {
  "a-reviewer": { extras: PAPER, eyes: lookAt(0, 1.4), vb: "17 22 116 116" },
  "b-manager": { extras: HAT + TIE + STACK, vb: "17 16 116 116" },
  "c-hat-tie-clipboard": { extras: HAT + TIE + CLIPBOARD, eyes: lookAt(1.4, 1.1), vb: "17 16 116 116" },
  "m1-hat": { extras: HAT_MIN, vb: "17 18 116 116" },
  "m2-hat-note": { extras: HAT_MIN + NOTE_MIN, eyes: lookAt(1, 0.8), vb: "17 18 116 116" },
  "m3-hat-tie-note": { extras: HAT_MIN + TIE_MIN + NOTE_MIN, eyes: lookAt(1, 0.8), vb: "17 18 116 116" },
  "r1-reading": { extras: HAT_MIN + NOTE_MIN, eyes: face(FACE_READING), vb: "17 18 116 116" },
  "r2-peering": { extras: HAT_MIN + NOTE_MIN, eyes: face(FACE_PEERING), vb: "17 18 116 116" },
  "r3-reading-tie": { extras: HAT_MIN + TIE_MIN + NOTE_MIN, eyes: face(FACE_READING), vb: "17 18 116 116" },
  // Round 4 avatars match Figma: face-only close-up (no note), head filling the circle
  "p1-focused": { extras: HAT_PRO + NOTE_PRO, avatarExtras: HAT_PRO, eyes: face(FACE_PRO), vb: "21 21 108 108" },
  "p2-no-hat": { extras: NOTE_PRO, avatarExtras: "", eyes: face(FACE_PRO), vb: "21 27 108 108" },
  "p3-mark": { extras: HAT_PRO, eyes: face(FACE_PRO), vb: "21 21 108 108" },
};

for (const [name, c] of Object.entries(concepts)) {
  const state = build(c);
  fs.writeFileSync(path.join(outDir, `${name}.svg`), state);
  const avatarArt = c.avatarExtras === undefined ? state : build({ ...c, extras: c.avatarExtras });
  fs.writeFileSync(path.join(outDir, `${name}-avatar.svg`), avatar(avatarArt, c.vb));
}
console.log("wrote", fs.readdirSync(outDir));
