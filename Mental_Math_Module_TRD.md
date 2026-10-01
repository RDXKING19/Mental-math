# TRD — Quick Minds: Mental Math

**Document type:** Technical Requirements Document
**Companion to:** `Mental_Math_Module_PRD.md`
**Status:** Draft v1 for review
**Reference studied:** `working-backwards-grade7` (React 18.3, Vite 5, Tailwind 3.4, `canvas-confetti`, ElevenLabs narration, procedural question generator)

---

## 1. Technical goals

1. **Same stack family as the course** so engineers and the course shell feel at home: React, Vite, Tailwind.
2. **Content as data, behaviour as components.** Story slides, activities, worlds and narration are described in typed content files, and a small set of reusable components renders them.
3. **A correct, testable question engine.** Mental-math questions must have exactly one right answer, believable distractors and a verifiable strategy trail. This is the highest-risk part of the product.
4. **Resumable and embeddable.** Progress persists. The module runs standalone and can be embedded in a course shell with a small `postMessage` contract.
5. **Accessible, fast, offline-tolerant.** Keyboard-complete, WCAG 2.2 AA, small initial bundle, no runtime third-party dependencies.

---

## 2. Findings from the reference that shape this design

I read the reference source. These are the points that affect decisions here.

| # | Observation (from the code) | Decision for this module |
|---|------------------------------|---------------------------|
| R1 | Phase flow is one `useState('intro' …)` in `App.jsx`; no router, no persistence. `resetProgress()` runs on entry, so a refresh loses everything. | Use an explicit **state machine** plus **hash routes** and a **persisted store** (sections 5 and 6). |
| R2 | `audio.js` reads `import.meta.env.VITE_ELEVENLABS_API_KEY` and, when present, calls ElevenLabs **from the browser**. Vite inlines any `VITE_*` variable into the client bundle, so the key would ship to every user. | The key must **never** be a `VITE_` variable. It is used only by a Node build script. The runtime plays pre-generated files and falls back to browser speech (section 9). |
| R3 | Audio files are named `audio_<text-slug>_<index>.mp3`. Inserting a line shifts indices and orphans files (hence `clean_audio.js`). | Name files by **content hash** and keep a manifest (section 9). |
| R4 | `index.html` loads fonts from Google Fonts at runtime. | **Self-host** fonts (offline use, privacy, predictable loading). |
| R5 | `body { overflow: hidden; height: 100vh }`. On mobile browsers `100vh` includes the area under the URL bar. | Use `100dvh` with a `100vh` fallback (section 10). |
| R6 | Class names such as `font-900`, `font-800`, `gap-4.5`, `w-4.5` appear throughout the JSX. They are not in Tailwind's default scale and I could not find definitions for them in `index.css` or `tailwind.config.js`, so they likely generate no CSS. | Define a strict token set in `tailwind.config.ts` and lint against unknown classes. Verify rather than assume. |
| R7 | The question engine in `mathData.js` builds a chain **forward** from a hidden start and models misconception distractors. Intermediate values are checked to stay whole positive numbers. | Keep the idea, formalise it as a **technique registry** with seeded RNG, validators and automated property tests (section 6). |
| R8 | Activity components are one 987-line file (`SimActivities.jsx`), each activity bespoke. | Build about ten **reusable activity primitives** configured by content (section 8). |
| R9 | Icons and mascots are emoji. | Use an SVG icon and illustration set (consistent across devices). |
| R10 | Narration text lives in `narration.js` as the single source of truth for both UI and generator. | **Keep** this principle, and generate narration from the content files where possible. |

---

## 3. Technology stack

| Concern | Choice | Notes |
|---------|--------|-------|
| Language | **TypeScript (strict)** | The reference is JavaScript. TypeScript is recommended here because generators and content schemas have many invariants. Fallback: JavaScript with JSDoc types. |
| UI | React 18.3 | Same as reference |
| Build | Vite 5 | Same as reference |
| Styling | Tailwind CSS 3.4 with CSS-variable design tokens | Themes via `data-theme` attribute |
| State | `useReducer` + Context (no external state library) | Small state, predictable |
| Routing | Tiny custom hash router (about 60 lines) | Avoids a dependency; routes are guarded by progress |
| Validation | `zod` for content and persisted state | Runs in the validate-content script and on load |
| Drag and drop | `@dnd-kit/core` | Built-in keyboard and screen-reader support. MVP may start with tap-to-place only. |
| Animation | CSS transitions and the Web Animations API, with a small FLIP helper | No heavy animation library |
| Confetti | `canvas-confetti` | Same as reference, disabled under reduced motion |
| Maths display | Unicode symbols and a small `<Frac>` component | No KaTeX; reduces bundle size |
| Fonts | Baloo 2, Lexend, JetBrains Mono via `@fontsource` | Self-hosted, subsetted |
| Testing | Vitest, React Testing Library, Playwright, axe-core | Section 14 |
| Lint and format | ESLint (react, jsx-a11y), Prettier, `tsc --noEmit` | Run in CI |
| Node | 20 LTS | |

---

## 4. Architecture overview

```
┌──────────────────────────────── Browser ────────────────────────────────┐
│  main.tsx                                                                │
│   └─ <ModuleProvider>  (progress store, settings, audio, telemetry)       │
│        └─ <Shell>      (top bar, stage, action bar, a11y live region)     │
│             └─ <Router> (hash routes, guarded by progress)                │
│                  ├─ IntroScreen                                           │
│                  ├─ BazaarMap                                             │
│                  └─ Gate screens ─ Wonder | Story | Simulate | Practice  │
│                  └─ Reflect | Celebration                                │
│                                                                          │
│  content/  (typed data: story, activities, worlds, narration)             │
│  engine/   (pure TypeScript: techniques, RNG, validators, scoring)        │
│  activities/ (reusable interactive primitives)                            │
│  ui/       (design system components)                                     │
│  services/ (store adapters, audio, telemetry, host bridge)                │
└──────────────────────────────────────────────────────────────────────────┘
```

**Layering rules**
- `engine/` is pure: no React, no DOM, no `Math.random` (it receives an RNG). It can be tested in Node and reused elsewhere.
- `activities/` and screens depend on `engine/` and `ui/`, never the reverse.
- `content/` is plain data validated by schema; no logic.
- `services/` are behind interfaces so tests and host environments can replace them.

---

## 5. Application state and navigation

### 5.1 Finite state machine

```ts
type GateId = 1 | 2 | 3;
type Phase = 'wonder' | 'story' | 'simulate' | 'practice';

type Screen =
  | { kind: 'intro' }
  | { kind: 'map' }
  | { kind: 'gate'; gate: GateId; phase: Phase; sub?: PhaseSub }
  | { kind: 'reflect' }
  | { kind: 'celebration' };

type PhaseSub =
  | { story: number }                         // slide index
  | { station: 1 | 2 | 3; activity: 0 | 1 | 2 } // simulate
  | { world: 0 | 1 | 2 | 3 | 4; mode: 'select' | 'play' };
```

Transitions are pure functions `(state, action) → state`. Illegal transitions (for example jumping to a locked world) are rejected by the reducer and the router redirects to the nearest legal screen.

### 5.2 Routes (hash based)

| Route | Screen |
|-------|--------|
| `#/` | Intro |
| `#/map` | Bazaar Map |
| `#/g1/wonder` | Gate 1 Wonder |
| `#/g1/story/3` | Gate 1 Story, slide 3 |
| `#/g1/sim/2/1` | Gate 1 Simulate, station 2, activity 1 |
| `#/g1/practice` | Gate 1 world select |
| `#/g1/practice/w3` | Gate 1 world 3 play |
| `#/reflect` | Final Reflect |

Hash routing means the module can be hosted on any static host or inside an iframe without server rewrites. The router consults `canEnter(route, progress)` before rendering.

### 5.3 Settings

```ts
interface Settings {
  muted: boolean;
  calmMode: boolean;       // no timers, unlimited retries, no speed bonus
  captions: boolean;       // show narration text
  reducedMotion: 'system' | 'on' | 'off';
  theme: 'paper' | 'focus';
}
```

---

## 6. Question engine (`src/engine`)

This is the core technical asset. It has to be correct by construction.

### 6.1 Core types

```ts
export type Rng = () => number; // returns [0, 1)

export interface Difficulty {
  level: 1 | 2 | 3;
  band: 'warmup' | 'core' | 'stretch'; // controls operand ranges
}

export interface TrailStep {
  label: string;      // "47 + 40"
  value?: number;     // running value after this step
  note?: string;      // "round 39 up to 40"
}

export type AnswerSpec =
  | { kind: 'int'; value: number }
  | { kind: 'decimal'; value: number; tolerance?: number }
  | { kind: 'quotRem'; quotient: number; remainder: number }
  | { kind: 'order'; sequence: string[] }          // trail builder
  | { kind: 'grid'; cells: Record<string, number> } // cross grid
  | { kind: 'choice'; correct: string };            // method picker

export interface Problem {
  id: string;                  // stable hash of techniqueId + operands
  techniqueId: string;
  level: 1 | 2 | 3;
  prompt: PromptPart[];        // text, numbers, operators, fractions
  answer: AnswerSpec;
  options?: { id: string; text: string; misconception?: string }[];
  trail: TrailStep[];          // the intended strategy
  explanation: string;         // one-line recap
  misconceptions: Record<string, string>; // option id → "You added the deficits…"
  targetMs: number;            // speed-bonus threshold
  tags: string[];
}

export interface Technique {
  id: string;                  // "G2-T3"
  level: 1 | 2 | 3;
  name: string;                // "Near-100 (Nikhilam)"
  skill: Skill;                // add | sub | mul | div | pow | root | pct | check
  applicable(operands: number[]): boolean;
  draw(rng: Rng, d: Difficulty): number[];                  // choose operands
  compute(operands: number[]): number;                      // ground truth
  trail(operands: number[]): TrailStep[];                   // strategy steps
  distractors(operands: number[], rng: Rng): Distractor[];  // misconception-based
  prompt(operands: number[]): PromptPart[];
  targetMs(d: Difficulty): number;
}
```

### 6.2 Generation pipeline

```
seeded RNG ─► draw operands ─► applicable()? ─► compute() ground truth
        ─► trail() ─► assert trail ends at compute()
        ─► distractors() (misconception-based)
        ─► dedupe, drop non-positive or equal-to-answer
        ─► ensure 3 unique distractors (retry up to N times)
        ─► Problem
```

- **Seeded RNG** (`mulberry32`). The session seed is stored in progress, so a learner's question stream is reproducible for debugging and tests.
- **No repeats** within a world attempt (a `Set` of problem IDs). Across attempts the engine prefers unseen operand pairs.
- **Retry budget:** up to 200 draws per problem, then throw in dev and fall back to a known-good problem set in production.
- **Ground truth:** `compute()` uses plain integer arithmetic; the *trail* is independent and is asserted to land on the same value. This catches errors in the explanation as well as in the answer.

### 6.3 Technique registry

Every technique in PRD section 5.2 is one module that implements `Technique`. Example (Nikhilam below 100):

```ts
export const nikhilamBelow100: Technique = {
  id: 'G2-T3',
  level: 2,
  name: 'Near-100 (Nikhilam)',
  skill: 'mul',
  applicable: ([a, b]) => a < 100 && b < 100 && 100 - a <= 15 && 100 - b <= 15,
  draw: (rng, d) => [pickInt(rng, 85, 99), pickInt(rng, 85, 99)],
  compute: ([a, b]) => a * b,
  trail: ([a, b]) => {
    const da = 100 - a, db = 100 - b;
    const left = a - db;
    const right = da * db;
    return [
      { label: `${a} → deficit ${da}`, note: 'gap from 100' },
      { label: `${b} → deficit ${db}`, note: 'gap from 100' },
      { label: `${a} − ${db} = ${left}`, value: left, note: 'cross-subtract' },
      { label: `${da} × ${db} = ${right}`, value: right, note: 'multiply the gaps' },
      { label: `${left}|${String(right).padStart(2, '0')}`, value: left * 100 + right },
    ];
  },
  distractors: ([a, b]) => {
    const da = 100 - a, db = 100 - b;
    const left = a - db, right = da * db;
    const out: Distractor[] = [
      { value: (a + db) * 100 + right, why: 'You added the gap; cross-subtract it instead.' },
      { value: (a - da - db) * 100 + right, why: 'You subtracted both gaps; subtract only the other number’s gap.' },
    ];
    if (right < 10) // 98 × 97: right part is 06, not 6
      out.push({ value: left * 10 + right, why: 'Keep two digits on the right, so 6 becomes 06.' });
    else if (right >= 100) // carry needed, e.g. left|120
      out.push({ value: Number(`${left}${right}`), why: 'The right part has three digits: carry the extra 1 to the left.' });
    else
      out.push({ value: left * 100 + (da + db), why: 'You added the gaps; multiply them.' });
    return out;
  },
  prompt: ([a, b]) => [num(a), op('×'), num(b)],
  targetMs: d => ({ warmup: 14000, core: 10000, stretch: 8000 }[d.band]),
};
```

(The code is illustrative of the contract. Each distractor function is individually unit-tested against a reference implementation of the wrong procedure.)

### 6.4 Difficulty bands within a Gate
Each world draws 10 questions: **3 warm-up, 5 core, 2 stretch**, in that order. Operand ranges per band are configured per technique (for example Nikhilam warm-up uses deficits 1–5; stretch uses up to 15).

### 6.5 Answer checking
- `int`: exact match after trimming and removing thousands separators.
- `decimal`: parsed numeric comparison within tolerance (`0.5`, `.5`, `1/2` where allowed).
- `quotRem`: two inputs.
- `order` and `grid`: compared structurally.
- The checker returns `{ correct, closeMiss?: boolean, matchedMisconception?: string }`. If the typed answer equals a known distractor, the matching misconception message is shown, even in Number Entry mode.

### 6.6 Scoring service (pure)

```ts
interface AttemptResult { correct: boolean; ms: number; hintUsed: boolean; retried: boolean }
const xpFor = (r: AttemptResult, calm: boolean, targetMs: number, streak: number) => {
  if (!r.correct) return 0;
  let xp = r.retried ? 5 : 10;
  if (!calm && r.ms <= targetMs && !r.retried) xp += 5;
  if (r.hintUsed) xp -= 3;
  if (streak >= 5) xp = Math.round(xp * 1.5);
  return Math.max(xp, 1);
};
const starsFor = (correct: number) => (correct >= 8 ? 3 : correct >= 6 ? 2 : correct >= 4 ? 1 : 0);
```
Thresholds mirror the reference (4, 6, 8 of 10). They live in config, not code.

### 6.7 Automated verification (must pass in CI)

For **every** technique, with 5,000 seeded draws per band:

| Check | Rule |
|-------|------|
| Ground truth | `compute()` equals a brute-force reference implementation |
| Trail integrity | The last trail `value` equals `compute()`; no intermediate negative or non-integer values unless the technique declares it |
| Applicability | `applicable()` is true for every drawn operand set |
| Distractors | 3 unique values; none equals the answer; none negative; each has a non-empty `why` |
| Misconception correctness | Each distractor is reproducible by the *described* wrong procedure (checked with a small reference function per misconception) |
| Range | Operands and answers stay within the band's declared bounds |
| Uniqueness | No duplicate problem IDs in 10-question sets (statistical test over 1,000 sets) |
| Stability | The same seed gives the same problems |
| Formatting | Prompt renders to the expected string; narration text spells symbols out |

A **question report** script prints 20 sample questions per technique for human review before each release.

---

## 7. Content model (`src/content`)

Content is typed data validated with `zod` at build time and on load.

```ts
interface StorySlide {
  id: string;
  title: string;
  body: string;
  quote: string;          // pull-quote
  bubble: string;         // mascot speech
  art: ArtId;             // SVG illustration component id
  trail?: TrailStep[];    // optional inline trail demo
  narration?: NarrationOverride;
}

interface ActivityDef {
  id: string;             // "g1-s1-a1"
  gate: 1 | 2 | 3;
  station: 1 | 2 | 3;
  index: 0 | 1 | 2;
  title: string;
  description: string;
  primitive: PrimitiveId; // see section 8
  config: unknown;        // validated per primitive
  rule: string;           // restated at completion
}

interface WorldDef {
  gate: 1 | 2 | 3;
  index: 0 | 1 | 2 | 3 | 4;
  name: string;
  icon: IconId;
  mode: 'sprint' | 'entry' | 'trail' | 'spotter' | 'crossgrid' | 'detective' | 'boss';
  techniques: { id: string; weight: number }[];
  questionCount: 10;
}
```

**Authoring workflow:** content editors change files in `src/content/gate1/…`; `npm run validate-content` catches missing fields, over-long text, unknown technique IDs and illegal characters.

**Limits enforced by the validator:** quote ≤ 90 characters, bubble ≤ 80, body ≤ 320, hint ≤ 120, so layouts never overflow.

---

## 8. Activity primitives (`src/activities`)

To avoid 27 bespoke components, build about ten primitives and configure them per activity.

| Primitive | Used for | Config highlights |
|-----------|----------|--------------------|
| `StepperVisual` | Guided animations: bead rail, number-line hops, array mirror, base balance, cross lines, duplex columns, see-saw, tower columns | `variant`, `steps[]`, `autoplay`, `canReplay` |
| `TrailBuilder` | Order step chips; round-and-fix; build a chain | `chips[]`, `correctOrder`, `distractorChips[]` |
| `GridFill` | ×10 − n grid; cross grid; carry catcher | `cells`, `inputKind` |
| `MethodPicker` | "Which trick fits?" | `problems[]`, `options[]`, `explain` |
| `Ladder` | Speed ladder and mix-master ladder | `rungs`, `softTimer` |
| `ErrorDetective` | Spot the faulty line (also digit-sum detective) | `working[]`, `faultIndex` |
| `BotDuel` | Click Bot races and Guardian bosses | `rounds`, `botProfile` |
| `EstimateSlider` | Estimate with tolerance, then exact | `target`, `tolerancePct` |
| `SlideDivision` | ÷9/99 slide-carry method | `dividend`, `divisor` |
| `RootReveal` | Square and cube root from ending and range | `kind`, `value` |

**Common contract**

```ts
interface ActivityProps<C> {
  config: C;
  calm: boolean;
  muted: boolean;
  onHint(): void;                 // reveals first trail step; reported to analytics
  onComplete(result: ActivityResult): void;
}
```

- Every primitive is **keyboard operable** and has an equivalent non-drag interaction.
- Every primitive reports `ActivityResult { completed: boolean; attempts: number; ms: number; hintsUsed: number }`.
- Primitives are lazy-loaded per Gate (section 12).

### 8.1 Bot Duel logic
- The bot's response time for a question is `targetMs × k ± jitter`, with `k` = 1.4 (Gate 1), 1.1 (Gate 2), 0.9 (Gate 3), drawn from the seeded RNG so a run is reproducible.
- **Stars and unlocking depend on the learner's correctness only** (PRD section 7). Beating the bot affects only flavour and the *Click Crusher* badge.
- In Calm Mode the bot race is replaced by a static progress bar for the bot; the learner is never racing.

### 8.2 Numeric keypad
- Custom component with readonly display (`inputMode="none"`) so the OS keyboard never appears and resizes the viewport.
- Handles keyboard digits, Enter, Backspace and minus.
- Announces the entered value via a polite live region.

---

## 9. Audio and narration

### 9.1 Principles carried over
- A single source of truth for spoken text (`narration.ts`), generated from content where possible.
- Pre-generated mp3 files for zero-latency playback.
- Browser `speechSynthesis` as the last-resort fallback so the module never goes silent.

### 9.2 Changes
1. **API key handling.** The ElevenLabs key is read only by `scripts/generate-audio.ts` from a non-`VITE_` environment variable (for example `ELEVENLABS_API_KEY`) and is never referenced in `src/`. The runtime does **not** call ElevenLabs. If a live-generation proxy is ever needed, it must be a server endpoint that holds the key.
2. **Content-hash filenames and manifest.**
   `audio/<sha1(voiceId + modelId + style + text)[0..10]>.mp3`, plus `audio/manifest.json` mapping `hash → { text, style, durationMs }`. Re-running the generator only produces files for new or changed lines, and unused files are reported.
3. **Lazy loading and preloading.** Load audio for the current screen and prefetch the next story slide or activity.
4. **Autoplay policy.** Audio starts only after the first user gesture (the *Begin* button) so browsers do not block it.
5. **Styles.** Reuse the reference's style presets (statement, question, emphasis, encouragement, celebration, instruction).
6. **Encoding.** Mono, 64–96 kbps mp3.
7. **Captions.** If `captions` is on, show the narration text in a caption bar.
8. **Sound effects.** A tiny SFX set (tap, correct, gentle try-again, level up) generated with the Web Audio API or one small sprite file; no harsh buzzers.

### 9.3 Narration rules (kept from the reference)
- Narrate paragraphs and questions, not titles or labels.
- Spell out symbols: × as "times", ÷ as "divided by", − as "minus", ² as "squared", % as "percent".

---

## 10. Design system, theming and responsive layout

### 10.1 Tokens
Tokens are CSS variables, consumed by Tailwind:

```css
:root[data-theme='paper'] {
  --paper: 255 248 236;   --ink: 31 42 90;     --saffron: 255 159 28;
  --teal: 18 165 148;     --coral: 242 95 92;  --lavender: 124 108 240;
  --sun: 255 201 60;
}
:root[data-theme='focus'] { --paper: 18 23 51; --ink: 245 241 230; /* … */ }
```

```ts
// tailwind.config.ts (excerpt)
colors: {
  paper: 'rgb(var(--paper) / <alpha-value>)',
  ink: 'rgb(var(--ink) / <alpha-value>)',
  saffron: 'rgb(var(--saffron) / <alpha-value>)',
  teal: 'rgb(var(--teal) / <alpha-value>)',
  coral: 'rgb(var(--coral) / <alpha-value>)',
},
fontFamily: { display: ['"Baloo 2"', 'sans-serif'], body: ['Lexend', 'sans-serif'], mono: ['"JetBrains Mono"', 'monospace'] },
```

- Fluid type scale with `clamp()`; minimum body 16 px.
- Contrast pairs are listed in a token test that fails CI if a pair drops under 4.5:1 (text) or 3:1 (large text and UI).

### 10.2 Viewport handling

```css
html, body, #root { height: 100vh; height: 100dvh; overflow: hidden; }
.stage { min-height: 0; overflow: auto; overscroll-behavior: contain; }
```

| Breakpoint | Layout |
|------------|--------|
| ≥ 1024 px wide | Two-column stage (sidebar and activity) |
| 640–1023 px | Stacked; large touch targets |
| < 640 px | Single column; hint as bottom sheet; keypad docked to bottom |

- Support landscape 1024 × 600 as the minimum desktop and tablet size; test also at 1280 × 720, 1920 × 1080, 768 × 1024, 390 × 844 and 360 × 640.
- Respect safe-area insets (`env(safe-area-inset-*)`).
- Orientation change must not lose in-progress state.

### 10.3 Motion
- A `data-motion="reduced"` attribute on `<html>` (from system setting or user override) switches transitions to instant and disables confetti.
- Trail and bead animations use the Web Animations API with cancel on unmount.

### 10.4 Icons and art
- SVG icon set as a React component library with `title` and `aria-hidden` handled in one place.
- Story illustrations are SVG components (themeable by tokens) rather than raster images; each has a text alternative in the content file.

---

## 11. Persistence, telemetry and host integration

### 11.1 Progress store

```ts
interface ProgressV1 {
  schema: 1;
  sessionSeed: number;
  startedAt: string;
  settings: Settings;
  xp: number;
  bestStreak: number;
  fastestCorrectMs: number | null;
  gates: Record<GateId, {
    wonderSeen: boolean;
    storyIndex: number;
    simPos: { station: 1 | 2 | 3; activity: 0 | 1 | 2 };
    worlds: Array<{ stars: 0 | 1 | 2 | 3; bestCorrect: number; attempts: number; bestAvgMs: number | null } | null>;
    guardianPassed: boolean;
    reflection?: string;
    confidence?: 1 | 2 | 3 | 4 | 5;
  }>;
  scrolls: Record<string, { correctCount: number; earned: boolean }>;
  badges: string[];
  final?: { teachGanu: string; matches: boolean[] };
}

interface ProgressStore {
  load(): Promise<ProgressV1 | null>;
  save(p: ProgressV1): Promise<void>;
  clear(): Promise<void>;
}
```

- **Adapters:** `LocalStorageStore` (default), `MemoryStore` (tests, incognito fallback), `HostStore` (delegates to the host via `postMessage`).
- Writes are debounced (about 500 ms) and wrapped in `try/catch`; failure never blocks the learner.
- Loaded data is validated with `zod`; `migrate(vN → vN+1)` functions handle schema changes; unrecognised data is ignored, not trusted.
- "Start over" requires confirmation and calls `clear()`.
- Free-text reflections are stored locally only unless the host adapter is used.

### 11.2 Telemetry

```ts
interface Telemetry { emit(event: string, props: Record<string, unknown>): void }
```
- Default implementation: no-op. Optional adapters: console (dev), `navigator.sendBeacon` to a configured endpoint, or host bridge.
- Events as in PRD section 12.1, with a random anonymous session ID and **no personal data, names or free-text reflections**.
- Events are batched and flushed on `visibilitychange`.

### 11.3 Host bridge (embedding in the course shell)

The module runs standalone. When inside an iframe and a host origin is allow-listed, it exchanges messages:

| Direction | Message | Payload |
|-----------|---------|---------|
| module → host | `module:ready` | `{ version }` |
| module → host | `module:progress` | `{ percent, gate, phase }` |
| module → host | `module:complete` | `{ xp, stars, durationMs }` |
| host → module | `host:init` | `{ learnerKey?, settings?, progress? }` |
| host → module | `host:setLang` | `{ lang }` |

- Always check `event.origin` against an allow-list set at build time; ignore everything else.
- If SCORM or xAPI is later required, add an adapter that translates these messages; the module itself stays unaware.

---

## 12. Performance and delivery

| Budget | Target |
|--------|--------|
| Initial JavaScript (Intro and Map) | ≤ 180 KB gzip |
| Per-Gate chunk (lazy loaded) | ≤ 120 KB gzip |
| Largest Contentful Paint (mid-range tablet, 4G) | ≤ 2.5 s |
| Input latency on keypad and drag | ≤ 100 ms |
| Audio per screen | ≤ 400 KB, prefetched |
| Fonts | ≤ 150 KB total, `font-display: swap`, subset to Latin (and Devanagari when localised) |

- Code-split by Gate and by activity primitive with `React.lazy`.
- Static hosting behind a CDN (any of Netlify, Vercel, S3 + CloudFront); hashed asset filenames with long cache; HTML and manifest short cache.
- A service worker is optional (R4 stretch) for offline play, caching the app shell and audio for the current Gate.
- Browser support: last two versions of Chrome, Edge, Firefox, Safari; iOS Safari 15+; Chrome on Android 10+; ChromeOS.

---

## 13. Accessibility implementation

| Concern | Implementation |
|---------|----------------|
| Landmarks | `header` (top bar), `main` (stage), `nav` (phase capsule) |
| Focus | On every screen change, move focus to the stage heading; trap focus in modals |
| Keyboard | Every control reachable; `Enter` and `Space` activate; arrow keys move within activity grids and keypad; `Esc` closes overlays |
| Live regions | `aria-live="polite"` announces correct, wrong, hint and level-up messages |
| Drag alternative | Tap-to-select then tap-to-place; dnd-kit keyboard sensor |
| Labels | Every icon button has an accessible name; SVG illustrations have text alternatives or `aria-hidden` |
| Colour | No colour-only meaning; tokens tested for contrast |
| Motion | Respects `prefers-reduced-motion` and the in-app setting |
| Timers | Calm Mode removes all time pressure; soft timers are announced only on request |
| Touch | Targets ≥ 44 × 44 px |
| Language | `lang` attribute set from content; numerals consistent |

---

## 14. Testing strategy

| Layer | Tool | Scope |
|-------|------|-------|
| Unit and property tests | Vitest | Engine (section 6.7), scoring, reducers, router guards, migrations |
| Content validation | `validate-content` script | Schemas, length limits, technique IDs, narration symbol spelling |
| Component tests | React Testing Library | Keypad, TrailBuilder, GridFill, MethodPicker |
| End-to-end | Playwright | Full Gate 1 flow with a dev-only fast-forward flag; resume after reload; locked-route redirects; Calm Mode |
| Accessibility | axe-core in Playwright and manual keyboard and screen-reader passes | Every screen at three viewports |
| Visual regression | Playwright screenshots | 1280 × 720, 768 × 1024, 390 × 844 |
| Performance | Lighthouse CI | Budgets in section 12 |
| Playtests | Learners aged 10–14 and 2–3 teachers | Before each Gate release |

The dev-only flag (`?debug=skip`) is removed from production builds via `import.meta.env.DEV`.

---

## 15. Security and privacy

- No personal data collected by default; analytics are anonymous and optional.
- No third-party scripts, fonts or trackers at runtime.
- Content-Security-Policy: `default-src 'self'; img-src 'self' data:; media-src 'self'; connect-src 'self' <telemetry-endpoint>; frame-ancestors <allowed-host-origins>`.
- API secrets are never in the client bundle (R2).
- `postMessage` origin allow-list (section 11.3).
- Learner reflections are not sent anywhere unless the host adapter is configured; if they are, the host owns the privacy review.
- Dependencies are pinned with a lockfile; `npm audit` and Dependabot in CI.
- Because the audience includes minors, review against applicable children's-privacy rules (for example COPPA, GDPR-K, or local equivalents) before enabling any analytics endpoint.

---

## 16. Proposed repository structure

```
quick-minds-mental-math/
├─ index.html
├─ package.json
├─ vite.config.ts
├─ tailwind.config.ts
├─ tsconfig.json
├─ public/
│  └─ audio/                    # generated mp3 + manifest.json
├─ scripts/
│  ├─ generate-audio.ts         # reads narration, hashes, calls TTS (server-side key only)
│  ├─ clean-audio.ts
│  ├─ validate-content.ts
│  └─ question-report.ts        # prints sample questions per technique
├─ src/
│  ├─ main.tsx
│  ├─ app/
│  │  ├─ Shell.tsx
│  │  ├─ router.ts              # hash router + guards
│  │  ├─ reducer.ts             # state machine
│  │  └─ ModuleProvider.tsx
│  ├─ screens/
│  │  ├─ Intro.tsx  BazaarMap.tsx  Reflect.tsx  Celebration.tsx
│  │  └─ gate/ Wonder.tsx  Story.tsx  Simulate.tsx  PracticeSelect.tsx  PracticePlay.tsx
│  ├─ activities/               # primitives (section 8)
│  ├─ engine/
│  │  ├─ rng.ts  types.ts  scoring.ts  checker.ts  generator.ts
│  │  └─ techniques/ g1/…  g2/…  g3/…
│  ├─ content/
│  │  ├─ schema.ts
│  │  ├─ gate1/ wonder.ts story.ts activities.ts worlds.ts
│  │  ├─ gate2/ …
│  │  └─ gate3/ …
│  ├─ ui/                       # Button, Card, TrailChips, BeadRail, SpeedRing, Keypad, TopBar, Icons…
│  ├─ services/
│  │  ├─ store/ localStorage.ts memory.ts host.ts
│  │  ├─ audio.ts  sfx.ts  telemetry.ts  hostBridge.ts
│  ├─ styles/ tokens.css  base.css
│  └─ tests/ …
└─ README.md
```

---

## 17. Delivery plan (relative sizing)

Estimates are planning guesses for a team of about two engineers, one designer and one content/maths author. Replace them with your own after a spike.

| Milestone | Scope | Size |
|-----------|-------|------|
| M0 Foundation | Repo, tokens, shell, state machine, router, store, a11y base, CI | M |
| M1 Engine | RNG, types, generator, checker, scoring, Gate 1 techniques, full property tests, question report | M |
| M2 Design system and primitives | Keypad, TrailChips, BeadRail, Speed Ring, `StepperVisual`, `TrailBuilder`, `GridFill`, `MethodPicker` | L |
| M3 Gate 1 vertical slice | Intro, Map, Gate 1 Wonder, Story, Simulate, Practice, Guardian; audio pipeline; save and resume | L |
| M4 Gate 2 | Techniques G2-T1…T10, extra primitives (`BotDuel` tuning), content | M |
| M5 Gate 3 | Techniques G3-T1…T12, `SlideDivision`, `RootReveal`, `ErrorDetective`, content | L |
| M6 Reflect, Mind Check, Celebration | Final phase, pre/post check, certificate | S |
| M7 Hardening | Accessibility audit, performance budgets, playtests, bug fixing, host-bridge testing | M |

**Critical path:** M1 (engine correctness) → M3 (first complete Gate). Do M1 first, because every later phase depends on it. Ship Gate 1 end to end before building Gate 2.

---

## 18. Risks and technical open questions

| Risk or question | Impact | Mitigation or decision needed |
|------------------|--------|--------------------------------|
| Distractor quality (not truly "believable") | Weak learning signal | Each distractor tied to a named misconception and unit-tested; teacher review of the question report |
| Drag interactions on low-end touch devices | Frustration | Tap-to-place as default on touch; drag optional |
| Timer fairness across devices | Unfair speed bonus | Measure with `performance.now()`, exclude the first render and tab-hidden time, keep bonus small and optional |
| Audio generation cost and drift | Budget | Hash cache, regenerate only changed lines, review diffs |
| Local storage cleared or unavailable (private browsing) | Lost progress | `MemoryStore` fallback with a visible notice |
| Host shell requirements unknown (SCORM, xAPI, LTI) | Rework | Confirm early; the adapter pattern isolates the change |
| TypeScript vs course codebase in JavaScript | Team friction | Decision needed from the team; JSDoc-typed JavaScript is an acceptable fallback |
| Hindi or multi-language narration | Scope | Content is already data-driven; fonts, TTS voices and text length need a localisation spike |

**Decisions needed from you**
1. Confirm the grade band and the Gate names.
2. Confirm saved progress (vs the reference's reset-on-entry behaviour).
3. Confirm whether the course shell needs SCORM, xAPI or LTI.
4. Confirm TypeScript or JavaScript.
5. Confirm the Vedic Maths framing in PRD section 11.

---

*End of TRD.*
