# Quick Minds: Mental Math

An interactive standalone mental math module built following the pedagogical 5-phase course structure (**Wonder → Story → Simulate → Practice → Reflect**) with the warm **"Bead & Ink"** aesthetic. Designed for learners in Grades 5–8 (ages 10–14) to build lasting calculation fluency, strategy recognition, and mathematical confidence without anxiety.

---

## 🌟 Key Highlights & Implementation

### 1. Pedagogical Architecture (5 Phases across 3 Gates)
- **Gate 1 · Spark (Foundations & Agility):**
  - Make-10/100, Left-to-right addition, Split-and-jump, Round-and-fix.
  - Doubling & halving (×5, ÷5, ×4), Nine machine (×10 − n), Eleven peek (2-digit sum < 10).
  - Complement subtraction to 100 (*All from 9, last from 10*), 10%/25%/50% percent anchors.
- **Gate 2 · Flow (Vedic Shortcuts & Base Arithmetic):**
  - Squares ending in 5 (*Ekadhikena Purvena*).
  - Multiply by 11 with carry.
  - Near-100 multiplication below and above base 100 (*Nikhilam* deficits & surpluses).
  - 2×2 Vertical and Crosswise (*Urdhva-Tiryagbhyam*).
  - By one less (*Ekanyunena Purvena* ×99), ×25, ×125, ÷25, all-from-9 to 1000/10,000, 15% and 12.5% anchors.
- **Gate 3 · Master (Duplex Columns, Roots & Verification):**
  - Near-base squares (*Yavadunam*), Duplex squaring for any 2-digit number (*Dwandwa Yoga*).
  - Difference of squares ($mid^2 - d^2$), working base 50 (*Anurupyena*).
  - 3×2 vertical-crosswise multiplication with zero-padding.
  - Slide division by 9 (*Paravartya Yojayet*), perfect square roots and cube roots.
  - Digit-sum verification (*Navashesh* / casting out nines) and estimation with tolerance.

### 2. Signature Visual & Interactive Components
- **Interactive Soroban Bead Rail (`src/ui/BeadRail.tsx`):**
  - Real sliding heaven (5) and earth (1) beads on wooden rods.
  - Place value counters for Hundreds, Tens, and Ones with live regrouping visual.
- **Number Line Hopper (`src/ui/NumberLineHopper.tsx`):**
  - Interactive SVG number line demonstrating tens and ones hopping routes.
- **Base Balance Scale (`src/ui/BaseBalance.tsx`):**
  - Visual balance scale demonstrating *Nikhilam* deficits against Base 100.
- **Criss-Cross Lines (`src/ui/CrossGridVisual.tsx`):**
  - Dynamic lightning paths illuminating vertical and crosswise digit products.
- **Thought Trail Chips (`src/ui/ThoughtTrail.tsx`):**
  - Organic, step-by-step strategy chips showing the mental calculation process.
- **Tactile Numeric Keypad (`src/ui/NumericKeypad.tsx`):**
  - Custom on-screen keypad preventing mobile viewport jumping, with physical keyboard listener and ARIA live regions.
- **Mascot Ganu the Owl (`src/ui/MascotGanu.tsx`):**
  - Abacus-feathered mentor with reactive moods (thinking, happy, celebrating) and dynamic speech bubbles.
- **Calculator Bot "Click" (`src/ui/ClickBot.tsx`):**
  - Animated rival bot in Boss Duels with reactive expressions (smug, calculating, panicked, impressed) and live racing progress bar.

### 3. Learner Experience & Accessibility
- **Calm Mode:** Math-anxiety aware toggle available at all times. Removes timers, speed bonuses, and the heart/fail state, allowing relaxed, unlimited retries.
- **Web Audio Sound Effects:** Zero external audio dependencies. Crystal-clear procedural chimes for correct answers, gentle low tones for retries (never harsh buzzers), and celebratory fanfares.
- **Audio Narration:** Natural speech synthesis narration with arithmetic symbol translations (× to "times", ÷ to "divided by", − to "minus", ² to "squared", % to "percent").
- **32 Collectible Trick Scrolls (`src/ui/TrickBookModal.tsx`):** Unlocked through mastery in Practice mode, with one-line rules and verified examples.
- **Diagnostic Quick Check (`src/ui/QuickCheckModal.tsx`):** 3-question assessment for instant level placement into Gates 1, 2, or 3.
- **Theme:** Golden Dawn aesthetic (high-contrast warm honey ivory parchment and dark plum ink).
- **Verified Certificate:** Printable / exportable Certificate of Mental Math Mastery with customizable learner name.

---

## 🚀 Running Locally & Deploying

### 1. Run in Development
```bash
npm install
npm run dev
```
Open [http://localhost:3000/](http://localhost:3000/) in your browser.

### 2. Build for Production
```bash
npm run build
```
Generates a zero-dependency, static production bundle in `dist/`.

### 3. Preview Production Build Locally
```bash
npm run preview
```

---

## 🌐 Deployment Guide

### Deploy to Vercel (Recommended)
1. Push your repository to GitHub / GitLab / Bitbucket:
   ```bash
   git add .
   git commit -m "feat: complete Quick Minds Mental Math module"
   git push origin main
   ```
2. Import the repository in [Vercel](https://vercel.com).
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **Deploy**.

### Deploy to Netlify
1. Run `npm run build`.
2. Drag and drop the `dist/` folder directly into [Netlify Drop](https://app.netlify.com/drop), OR connect your GitHub repository with Build Command `npm run build` and Publish Directory `dist`.

### Deploy to GitHub Pages
Because `vite.config.ts` uses `base: './'`, the static files can be served directly from any subdirectory or GitHub Pages branch:
```bash
npm install -D gh-pages
```
Add to `package.json` scripts:
```json
"deploy": "npm run build && gh-pages -d dist"
```
Then run:
```bash
npm run deploy
```

---

## 📁 Repository Structure

```
mental-math/
├── index.html                  # HTML entry point with Baloo 2, Lexend & JetBrains Mono fonts
├── vite.config.ts              # Vite + React + Tailwind plugins
├── package.json                # Dependencies and npm scripts
├── tsconfig.json               # Strict TypeScript configuration
└── src/
    ├── main.tsx                # React application entry point
    ├── index.css               # Design tokens, variables & utility styles
    ├── app/
    │   ├── Shell.tsx           # Master layout shell with top navigation and modals
    │   └── reducer.ts          # State machine router and navigation transitions
    ├── engine/
    │   ├── types.ts            # Type definitions for techniques, problems, answers
    │   ├── rng.ts              # Seeded Mulberry32 random generator
    │   ├── scoring.ts          # XP, streak multiplier, star tiers, and guardian logic
    │   ├── checker.ts          # Answer verification & misconception detector
    │   ├── generator.ts        # Procedural problem generator with difficulty curves
    │   └── techniques/
    │       ├── gate1.ts        # Gate 1 arithmetic techniques (G1-T1 to G1-T10)
    │       ├── gate2.ts        # Gate 2 Vedic techniques (G2-T1 to G2-T10)
    │       └── gate3.ts        # Gate 3 Duplex & verification techniques (G3-T1 to G3-T12)
    ├── content/
    │   └── gatesData.ts        # Story slides, activity configs, world defs, and 32 trick scrolls
    ├── services/
    │   ├── store.ts            # LocalStorage progress persistence & schema versioning
    │   └── audio.ts            # Web Audio sound effects & speech synthesis narration
    ├── ui/
    │   ├── TopBar.tsx          # 5-phase capsule, gate badge, XP, stars & controls
    │   ├── MascotGanu.tsx      # SVG mentor owl with reactive expressions & speech
    │   ├── ClickBot.tsx        # Rival calculator bot avatar & racing bar
    │   ├── NumericKeypad.tsx   # Custom numeric keyboard & live accessibility
    │   ├── ThoughtTrail.tsx    # Strategy step chips sequence
    │   ├── SpeedRing.tsx       # Soft circular timer ring
    │   ├── BeadRail.tsx        # Interactive SVG Soroban abacus
    │   ├── NumberLineHopper.tsx# Interactive SVG number line
    │   ├── BaseBalance.tsx     # Interactive SVG balance scale
    │   ├── CrossGridVisual.tsx # Interactive Urdhva criss-cross lines
    │   ├── TrickBookModal.tsx  # Collectible 32-scroll drawer
    │   ├── QuickCheckModal.tsx # 3-question diagnostic assessment
    │   └── SettingsModal.tsx   # Audio, calm mode, theme & reset options
    └── screens/
        ├── IntroScreen.tsx     # Welcome screen & journey overview
        ├── BazaarMap.tsx       # Market street gate stalls hub
        ├── ReflectScreen.tsx   # Scoreboard, teach Ganu & self-assessment
        ├── CelebrationScreen.tsx# Confetti celebration & printable certificate
        └── gate/
            ├── WonderScreen.tsx# Hook challenge & interactive reveals
            ├── StoryScreen.tsx # 6-slide illustrated pedagogical narrative
            ├── SimulateScreen.tsx # 3 stations × 3 activities interactive lab
            ├── PracticeSelectScreen.tsx # World map selection
            └── PracticePlayScreen.tsx  # Procedural gameplay, hearts & boss duel
```
