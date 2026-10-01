# PRD — Quick Minds: Mental Math

**Document type:** Product Requirements Document
**Module:** Standalone interactive module, same pedagogical flow as the course (Wonder → Story → Simulate → Practice → Reflect)
**Working title:** *Quick Minds: Mental Math*
**Status:** Draft v1 for review
**Reference studied:** `working-backwards-grade7` (React + Vite + Tailwind, 5-phase flow, 10 procedural game worlds, ElevenLabs narration)

---

## 0. Assumptions and open questions

These decisions were not specified, so I made assumptions. Please confirm or correct them; most are cheap to change now and expensive later.

| # | Item | Assumption used in this PRD |
|---|------|------------------------------|
| A1 | Topic | **Mental Math** (all four operations, squares/roots, percent and fraction anchors, Vedic techniques). The earlier mention of "Fractions" is treated as a working-title leftover. Fraction/percent anchors are included as a bridge skill. |
| A2 | Levels | Three levels, named **Gates**: Gate 1 *Spark* (easy / beginner), Gate 2 *Flow* (medium / intermediate), Gate 3 *Master* (hard / advanced). |
| A3 | Learner | Grades 5–8 (ages ~10–14). Gate 1 is also accessible to strong Grade 4 learners. |
| A4 | Language | English first. Content is data-driven so Hindi or other languages can be added later. |
| A5 | Curriculum alignment | Not tied to a specific board. Skills are mapped to general upper-primary and lower-secondary arithmetic outcomes. |
| A6 | Session length | One Gate is about 35–45 minutes, designed to be done in 1–3 sittings with resume. Whole module is about 2 hours. |
| A7 | Persistence | Progress **is saved** (the reference resets on every entry). A standalone module that takes ~2 hours must be resumable. |
| A8 | Platform | Browser-based, tablet and laptop first, phone supported. No native app. |
| A9 | Vedic Maths framing | Taught as a **system of calculation shortcuts**, using the Sanskrit sutra names as memorable labels. See section 11 for the accuracy policy. |

---

## 1. Vision and goals

### 1.1 Vision
Make a learner feel *"I can do this in my head, and I know why it works."* Mental math is taught as a toolbox of named, visual strategies rather than as a memory or speed test.

### 1.2 Product goals
1. **Teach strategies, not just answers.** Every skill is shown as a visible "thought trail" of small steps that a learner can repeat on their own.
2. **Build fluency and confidence together.** Speed matters, but never at the cost of math anxiety (see Calm Mode).
3. **Keep the course flow recognisable.** A learner who has completed other course modules should instantly recognise the five phases.
4. **Look and feel unique.** The module has its own visual identity (section 9) suitable for an education product, distinct from the dark-cosmic style of the reference.
5. **Be a clean, reusable pattern.** Content, question generators and activity components are data-driven so the next module reuses the shell.

### 1.3 Learning outcomes
By the end of the module a learner can:

| Gate | Outcome (the learner can…) |
|------|----------------------------|
| 1 Spark | Add and subtract two- and three-digit numbers mentally using make-10/100, split-and-jump and round-and-fix. Multiply by 2, 4, 5, 9, 10, 11 using doubling, halving and ×10 adjustments. Divide by 2, 4, 5, 10. Use 10%, 25%, 50% anchors. |
| 2 Flow | Square numbers ending in 5. Multiply by 11 (any 2-digit). Multiply numbers near 100 using Nikhilam. Multiply 2-digit × 2-digit using vertical-and-crosswise. Use ×9/99, ×25/125, ÷25/50 shortcuts. Subtract from powers of ten. Find 5%, 15%, 12.5% and common fraction equivalents. |
| 3 Master | Square any 2-digit number (near-base and duplex methods). Multiply 3-digit × 2-digit. Use difference of squares and working-base methods. Divide by 9/99 with the Vedic slide method. Find square roots (up to 10,000) and cube roots (up to 1,000,000) of perfect powers. Verify answers with digit sums. Chain multiple strategies and estimate with a tolerance. |

### 1.4 Non-goals (MVP)
- No live multiplayer or leaderboards.
- No teacher dashboard or classroom management.
- No handwriting or voice-answer recognition.
- No calculators inside the module (the "Calculator Bot" is an opponent, not a tool).
- No claims about the historical origin of the techniques (section 11).

---

## 2. What we keep and what we change from the reference

| Area | Reference (`working-backwards-grade7`) | This module |
|------|-----------------------------------------|-------------|
| Flow | Intro → Wonder → Story → Simulate → Practice → Reflect → Celebration | **Kept**, repeated once per Gate (Wonder card, Story, Simulate, Practice, Gate Checkpoint) with one final Reflect and Celebration |
| Top navigation | Capsule with 5 numbered phases, home, sound, close | **Kept in spirit**: capsule with 5 phases plus a Gate badge and settings |
| Story | 8 slides, image + body + pull-quote + mascot bubble | **Kept**: 6 slides per Gate, same four elements, SVG illustrations |
| Simulate | 3 stations × 3 activities (understand → try → solve alone) | **Kept**, per Gate. This gradient is a good pedagogical pattern. |
| Practice | 10 worlds × 10 questions, 3 hearts, ≥4/10 unlocks next, stars at 4/6/8 | **Kept** thresholds. 5 worlds per Gate, with new input types (typed answers, trail builder, trick spotter, boss duel) |
| Question engine | Procedural generator with misconception-based distractors | **Kept and extended** (seeded RNG, no-repeat, technique tagging, automated tests) |
| Reflect | Free-text explanation to a robot, scoreboard | **Kept**, plus technique matching and a confidence rating |
| Narration | `narration.js` single source of truth, pre-generated mp3, fallback to browser speech | **Kept**, with a safer key policy (see TRD) |
| Progress | Reset every time the module is entered | **Changed**: saved and resumable |
| Layout | Fixed `100vh`, no page scroll | **Kept** (no page scroll) but uses `100dvh` and responsive stacking for phones |
| Visual identity | Dark purple cosmic, emoji icons, Fredoka | **Replaced**: light "Bead & Ink" theme, SVG icon set, new mascot and fonts |

---

## 3. Target learner and pedagogy

### 3.1 Learner profile
- Comfortable with written arithmetic but slow or inconsistent mentally.
- Often believes mental math is a talent ("some people are just fast").
- Some learners have math anxiety triggered by timers and wrong-answer feedback.

### 3.2 Pedagogical principles
1. **Concrete → Visual → Abstract.** Bead rail and number line (concrete), thought-trail chips (visual), pure numeric entry (abstract).
2. **Strategy before speed.** Timers appear only after a strategy is practised untimed.
3. **Name the trick.** Each technique has a short name, a one-line rule and a collectible Trick Scroll, so learners can talk about methods.
4. **Choose the right tool.** From Gate 2 onward, learners must decide *which* trick fits (e.g., 47 × 99 vs 46 × 47).
5. **Mistakes are information.** Distractors model real misconceptions; wrong answers show the exact slip and a retry.
6. **Always verify.** Estimation and digit-sum checks build the habit of sense-checking.
7. **Calm by default in Gate 1.** Timers are soft and optional; Calm Mode can switch them off at any Gate.

---

## 4. Module structure

### 4.1 Journey map

```
INTRO ─► BAZAAR MAP (hub)
            │
            ├─ GATE 1  Spark  ─► Wonder ► Story ► Simulate ► Practice ► Guardian ─┐
            │                                                                        │ unlocks
            ├─ GATE 2  Flow   ─► Wonder ► Story ► Simulate ► Practice ► Guardian ◄─┘
            │                                                                        │ unlocks
            └─ GATE 3  Master ─► Wonder ► Story ► Simulate ► Practice ► Guardian ◄─┘
                                                                                     │
                                                                              REFLECT ► CELEBRATION
```

- **Intro screen:** title, mascot, learning journey card, "Begin" and optional **Quick Check** (3 questions that recommend a Gate; learners may skip ahead only through this check).
- **Bazaar Map (hub):** three gates shown as stalls on a street, with stars, progress ring and Trick Scroll count. Gate 2 unlocks when the Gate 1 Guardian is passed; Gate 3 likewise.
- **Why per-Gate phases rather than one big phase each?** Five phases for 150 questions and about 27 activities in one pass would be too long and would mix beginner and advanced skills. Per-Gate loops keep each sitting short, give three natural "I finished something" moments, and let a teacher assign one Gate at a time.

> **Alternative considered:** one global Wonder/Story/Simulate with levels only in Practice. Rejected because it would not scaffold Vedic techniques, which need their own explanation and visuals at each step.

### 4.2 Characters and story spine
- **Ira**, a young helper at her family's market stall. Her cash-register screen breaks on the busiest day, and she has to calculate in her head.
- **Ganu the Owl**, an abacus-feathered mentor who appears as the mascot and teaches in the Story and speech bubbles.
- **Calculator Bot ("Click")**, a friendly but smug rival in boss duels. It is fast, but it cannot explain anything.
- Each Gate is a gate in the market wall. Passing the **Gate Guardian** boss opens the next.

---

## 5. Curriculum scope: levels × operations

### 5.1 Operation coverage matrix

| Operation | Gate 1 Spark | Gate 2 Flow | Gate 3 Master |
|-----------|--------------|-------------|----------------|
| Addition | Make-10/100, left-to-right, split-and-jump, round-and-fix | Adding near powers of ten, chunking 3-digit | Multi-step chains, estimate-then-exact |
| Subtraction | Counting up, round-and-fix, "all from 9, last from 10" (to 100) | All-from-9 to 1000 and 10,000, borrow-free | Chained, with digit-sum verification |
| Multiplication | ×2/4/5/9/10/11 (2-digit), doubling and halving | Squares ending 5, ×11 any, Nikhilam near 100, 2×2 vertical-crosswise, ×99, ×25, ×125 | 3×2 vertical-crosswise, working-base, difference of squares, squaring (near-base and duplex) |
| Division | ÷2, ÷4, ÷5, ÷10 with remainders | ÷25, ÷50 via ×4/×2 | Vedic division by 9/99, chunking by 2-digit, divisibility checks |
| Powers and roots | Squares to 12² | Squares ending 5, near-100 squares preview | Squares to 99², perfect-square roots to 10,000, perfect-cube roots to 1,000,000 |
| Percent / fraction bridge | 10%, 25%, 50% | 5%, 15%, 12.5%, 1/8 and 3/8 anchors, 1/3 ≈ 33.3% | Percent of amount chains (e.g. 18% of 250) |
| Number sense | Estimation by rounding | Choosing the best method | Estimate with tolerance, digit-sum check |

### 5.2 Technique catalogue (with verified worked examples)

Every example below has been checked arithmetically.

#### Gate 1 · Spark

| ID | Technique | Rule in one line | Example |
|----|-----------|-------------------|---------|
| G1-T1 | Make 10 / 100 | Find the friend that completes the round number | 64 + 36 = 100 |
| G1-T2 | Left-to-right add | Add the big parts first, then the small | 47 + 38: 40 + 30 = 70; 7 + 8 = 15; 70 + 15 = **85** |
| G1-T3 | Split and jump | Jump tens, then ones, on a number line | 58 + 27: 58 + 20 = 78; 78 + 7 = **85** |
| G1-T4 | Round and fix | Round to a friendly number, then adjust | 47 + 39 = 47 + 40 − 1 = **86**; 83 − 48 = 83 − 50 + 2 = **35** |
| G1-T5 | Double and halve | Double one number, halve the other, or use ×10 ÷ 2 | 36 × 5 = 36 × 10 ÷ 2 = **180** |
| G1-T6 | Nine-machine | ×9 = ×10 − the number | 17 × 9 = 170 − 17 = **153** |
| G1-T7 | Eleven peek | Peek: first digit, sum of digits, last digit | 23 × 11 → 2 · 5 · 3 = **253** |
| G1-T8 | Halving division | ÷4 = halve twice; ÷5 = ×2 ÷10 | 85 ÷ 5 = 170 ÷ 10 = **17** |
| G1-T9 | Complement subtraction | All from 9, last from 10 | 100 − 63 = **37** |
| G1-T10 | Percent anchors | 50% = half, 25% = half of half, 10% = move the point | 10% of 240 = **24** |

#### Gate 2 · Flow

| ID | Technique (sutra label) | Rule in one line | Example |
|----|--------------------------|-------------------|---------|
| G2-T1 | Squares ending 5 (*Ekadhikena Purvena*) | n × (n + 1), then write 25 | 65²: 6 × 7 = 42 → **4225** |
| G2-T2 | Multiply by 11, any 2-digit | First digit · sum · last digit, carry if needed | 57 × 11: 5 · 12 · 7 → **627** |
| G2-T3 | Near-100 multiplication (*Nikhilam*) | Cross-subtract the deficits, multiply the deficits | 97 × 94: deficits 3 and 6; 97 − 6 = 91; 3 × 6 = 18 → **9118** |
| G2-T4 | Above-base Nikhilam | Cross-add the surpluses, multiply the surpluses | 104 × 103: 104 + 3 = 107; 4 × 3 = 12 → **10712** |
| G2-T5 | Vertical and crosswise (*Urdhva-Tiryagbhyam*) 2×2 | Multiply down, crosswise, down; carry left | 23 × 14: 2 · (8 + 3 = 11) · 12 → **322** |
| G2-T6 | By one less (*Ekanyunena Purvena*) ×9/99 | ×99 = ×100 − the number | 47 × 99 = 4700 − 47 = **4653** |
| G2-T7 | ×25 and ×125 | ×25 = ÷4 then ×100; ×125 = ÷8 then ×1000 | 36 × 25 = **900**; 48 × 125 = **6000** |
| G2-T8 | All from 9 subtraction | Subtract each digit from 9, last from 10 | 1000 − 467 = **533** |
| G2-T9 | Division by 25 / 50 | ÷25 = ×4 ÷100 | 350 ÷ 25 = **14** |
| G2-T10 | Percent building blocks | 15% = 10% + 5%; 12.5% = 1/8 | 15% of 80 = 8 + 4 = **12**; 12.5% of 64 = **8** |

#### Gate 3 · Master

| ID | Technique | Rule in one line | Example |
|----|-----------|-------------------|---------|
| G3-T1 | Near-base squares (*Yavadunam*) | Add or subtract the deviation, then square the deviation | 103² = 106 · 09 → **10609**; 97² = 94 · 09 → **9409** |
| G3-T2 | Duplex squaring (*Dwandwa Yoga*) | Duplex columns, carry left | 43²: 16 · 24 · 9 → **1849** |
| G3-T3 | Difference of squares | Balance around the middle | 47 × 53 = 50² − 3² = **2491** |
| G3-T4 | Working base (*Anurupyena*) | Use base 50 (half of 100) | 46 × 47: deficits 4 and 3; 46 − 3 = 43; 43 × 50 = 2150; + 4 × 3 → **2162** |
| G3-T5 | 3×2 vertical and crosswise | Pad with zeros, then five columns | 213 × 14: 2 · 9 · 7 · 12 → **2982** |
| G3-T6 | Division by 9 (slide method) | Carry the running sum | 1234 ÷ 9: 1 · 3 · 6, remainder 10 → adjust → **137 R 1** |
| G3-T7 | Distributive chunking | Group before multiplying | 47 × 6 + 53 × 6 = 100 × 6 = **600** |
| G3-T8 | Perfect-square roots | Last digit gives the candidates; range gives the tens | √2209: ends in 9 → 3 or 7; between 40² and 50² → **47** |
| G3-T9 | Perfect-cube roots | Last digit gives the unit; leading digits give the tens | ∛29791: ends in 1 → 1; 29 is between 27 and 64 → 3 → **31** |
| G3-T10 | Digit-sum check (*Navashesh*) | Reduce to single digits; the product must match | 213 × 14 = 2982: 6 × 5 → 3; 2 + 9 + 8 + 2 = 21 → **3** ✔ |
| G3-T11 | Percent chains and fraction bridge | Combine anchors | 18% of 250 = 25 + 20 = **45**; 7/8 of 96 = **84** |
| G3-T12 | Estimate with tolerance | Round, compute, decide if the answer is within a band | ~±5% bands |

> **Stretch content** (post-MVP): vinculum (bar) numbers, cubes near a base, divisibility rules for 7/11/13, Flash-style visual number memory.

---

## 6. Phase specifications

Each Gate runs the same five-phase structure. Counts below are per Gate.

### 6.1 Intro (once)
- Pill badge: "Grades 5–8 · Mental Math".
- Title, mascot (Ganu), speech pill ("Ready to think faster than a screen?").
- **Your Learning Journey** card with the five phases and the three Gates.
- Primary CTA **Begin**. Secondary CTA **Quick Check**.
- Feature tiles: *Trick Scrolls*, *Thought Trails*, *Beat the Click Bot*.

### 6.2 Phase 1 — Wonder (one card per Gate, about 1–2 min)

**Purpose:** create an "how did they do that?" moment before any explanation.

**Pattern (consistent across Gates):**
1. A challenge appears: "Can you beat Click?"
2. The learner taps **Reveal step** up to three times. Each tap shows one stage of the trick, without naming the method.
3. Ganu asks the wonder question.
4. CTA to the Story.

| Gate | Hook challenge | Reveal |
|------|----------------|--------|
| 1 | "99 × 7 in three seconds?" | 100 × 7 = 700; take away one 7 → **693** |
| 2 | "96 × 97 without paper?" | Gaps from 100 are 4 and 3; 96 − 3 = 93; 4 × 3 = 12 → **9312** |
| 3 | "47 × 53, no calculator?" | Both are 3 away from 50 → 50² − 3² = **2491** |

**Acceptance:** one screen, no scroll; narration plays unless muted; the hook numbers are real and verified; revealing steps can be repeated.

### 6.3 Phase 2 — Story (6 slides per Gate, about 5 min)

Each slide has the same four elements as the reference: **Title, body, pull-quote, mascot bubble**, plus an illustration. Navigation uses Back, progress dots and Next. The slide counter appears under the capsule.

**Gate 1 — "The Day the Register Broke"**

| # | Title | Core idea |
|---|-------|-----------|
| 1 | The queue is getting long | Ira's register breaks. Why mental math is useful. |
| 2 | Friends of ten | Make-10 and make-100 pairs; bead rail visual |
| 3 | Round and Fix | 47 + 39 → 47 + 40 − 1 |
| 4 | Double and Halve | ×5 and ×4 |
| 5 | Nine and Eleven tricks | ×9 as ×10 − n; ×11 peek |
| 6 | Does that make sense? | Estimating to catch slips → enter the lab |

**Gate 2 — "The Scroll Cupboard"**

| # | Title | Core idea |
|---|-------|-----------|
| 1 | Ganu's secret scrolls | A short, honest framing of Vedic Maths as a shortcut system (section 11) |
| 2 | Five-square magic | Multiply n by (n + 1), then write 25 |
| 3 | Near 100 | Nikhilam below and above 100 |
| 4 | Cross and carry | Vertical and crosswise 2×2 |
| 5 | The shortcut fair | ×99, ×25, ×125, ÷25, all-from-9 |
| 6 | Which trick fits? | Choosing the method; percent building blocks |

**Gate 3 — "The Grand Tournament"**

| # | Title | Core idea |
|---|-------|-----------|
| 1 | The Tournament begins | Why advanced learners still check their work |
| 2 | Squares, two ways | Near-base and duplex |
| 3 | Balance the see-saw | Difference of squares and working base |
| 4 | Towers and columns | 3×2 vertical-crosswise |
| 5 | Division and roots | ÷9/99 slide, square and cube roots |
| 6 | Trust, but verify | Digit-sum check and estimation tolerance |

### 6.4 Phase 3 — Simulate (3 stations × 3 activities per Gate, about 14 min)

The reference's pedagogical gradient is kept:

- **Station 1 — Understand** (watch and explore, mostly guided)
- **Station 2 — Try it yourself** (guided build, match or order)
- **Station 3 — Solve alone** (unguided, with a boss at the end)

**Layout:** left sidebar with the three stations, right interactive panel with title, short description, the activity, and Previous / Next footer. Activities remount per step. A hint is available in every activity (see 8.3).

| Gate | Station | Activity 1 | Activity 2 | Activity 3 |
|------|---------|------------|------------|------------|
| 1 | 1 Understand | **Bead Rail Sum:** build 47 + 38 on a bead rail, regroup ten beads into one | **Number Line Hopper:** compare three routes for 58 + 27 by number of jumps | **Double-Halve Mirror:** show 36 × 5 as 36 × 10 ÷ 2 with an array that splits in half |
| 1 | 2 Try | **Round and Fix:** slide to round 47 + 39 to 40, then place the "−1" chip | **Nine-Machine:** fill the ×10 − n grid for 17 × 9 | **Eleven Peek:** slide the digits of 23 apart and add in the gap |
| 1 | 3 Solo | **Speed Ladder:** climb five mixed rungs with a soft ghost timer | **Error Detective:** find where a character slipped | **Beat the Click Bot:** 3 short rounds against the bot |
| 2 | 1 Understand | **Square Spark:** 65² as an area grid; discover the pattern | **Base Balance Scale:** deficits shown on a scale for 97 × 94 | **Cross-Lines:** animated vertical and crosswise lines for 23 × 14 |
| 2 | 2 Try | **Build the Trail:** order the Nikhilam steps | **Carry Catcher:** tap the digit that carries | **Which Trick?:** pick the best method for a problem |
| 2 | 3 Solo | **Percent Builder:** make 15% from 10% + 5% blocks | **Mix-Master Ladder:** mixed rungs, choose the trick | **Vedic vs Standard Race:** count steps for each method |
| 3 | 1 Understand | **Duplex Engine:** animate the duplex columns for 43² | **See-Saw Squares:** balance 47 × 53 around 50 | **Tower Crossing:** five columns of 213 × 14 |
| 3 | 2 Try | **Chain Chef:** assemble a multi-technique chain | **Root Reveal:** deduce a root from its ending and range | **Nine-Slide Division:** slide the carry for 1234 ÷ 9 |
| 3 | 3 Solo | **Digit-Sum Detective:** reveal a planted error with casting out nines | **Estimate then Exact:** a tolerance slider and a typed answer | **Grand Tournament:** boss, multi-round |

**Acceptance criteria**
- Every activity has a clear *goal*, *success state* and *wrong-state feedback* that names the slip.
- Every activity finishes with a one-line "rule" restated in the pull-quote style.
- Learners can freely move back and forward between activities. The final Next goes to Practice.
- All 9 activities per Gate fit one viewport without page scroll (inner panel scroll allowed on phones only).

### 6.5 Phase 4 — Practice (5 worlds × 10 questions per Gate, about 15 min)

**World map** reuses the reference pattern: a grid of worlds, lock icons, stars per world, total stars, and a "Go to Checkpoint" button when the Gate is complete.

- A world unlocks when the previous world has at least **1 star** (≥ 4 / 10 correct).
- Stars: **3★** ≥ 8, **2★** ≥ 6, **1★** ≥ 4.
- World 5 of each Gate is the **Gate Guardian** boss duel, which doubles as the Level Checkpoint. Passing (≥ 7 / 10) unlocks the next Gate.

**Game modes** (the "different games" the course expects):

| Mode | Description | Where used |
|------|-------------|------------|
| **Speed Sprint** | Multiple choice, soft timer ring, optional | G1-W1 and others |
| **Number Entry** | Type the answer on an on-screen keypad | most worlds |
| **Trail Builder** | Drag or tap step chips into the right order | G1-W2, G2-W2 |
| **Trick Spotter** | Pick the fastest strategy for a given problem | G1-W4, G2-W4 |
| **Cross Grid** | Fill an Urdhva cross-multiplication grid | G2-W3, G3-W2 |
| **Error Detective** | Tap the line where the working goes wrong | G3-W5 |
| **Boss Duel** | Race Click Bot over 10 questions; bot speed scales per Gate | W5 of each Gate |

**Worlds**

| Gate | World | Name | Skill focus | Mode |
|------|-------|------|-------------|------|
| 1 | W1 | Make-Ten Market | Make-10/100, left-to-right add | Speed Sprint |
| 1 | W2 | Jump Lane | Split-and-jump, round-and-fix (add and subtract) | Trail Builder |
| 1 | W3 | Double and Halve Stall | ×2/4/5, ÷2/4/5 | Number Entry |
| 1 | W4 | Nine and Eleven Alley | ×9, ×11, ×10, complement subtraction | Trick Spotter |
| 1 | W5 | **Gate Guardian 1** | Mixed, plus 10%/25%/50% anchors | Boss Duel |
| 2 | W1 | Five-Square Fort | Squares ending 5, ×11 any | Number Entry |
| 2 | W2 | Base Bridge | Nikhilam below and above 100 | Number Entry |
| 2 | W3 | Cross Canal | Urdhva 2×2 | Cross Grid |
| 2 | W4 | Shortcut and Percent Fair | ×99, ×25, ×125, ÷25, all-from-9, 15%/12.5% | Trick Spotter |
| 2 | W5 | **Gate Guardian 2** | Mixed, timed | Boss Duel |
| 3 | W1 | Duplex Dojo | Near-base squares, duplex squares | Number Entry |
| 3 | W2 | Tower Crossing | Urdhva 3×2 and 2×2 at speed | Cross Grid |
| 3 | W3 | Balance Gate | Difference of squares, working base, chunking | Number Entry |
| 3 | W4 | Division Den | Slide division by 9/99, square and cube roots | Number Entry |
| 3 | W5 | **Gate Guardian 3** | Chains, estimates, digit-sum verification | Error Detective + Boss Duel |

**Question behaviour**
- Every question is generated procedurally from a technique (TRD section 6). Learners see unlimited non-repeating variants.
- After a **wrong** answer: show the *Thought Trail* of the intended strategy and a one-line misconception ("You added the deficits instead of subtracting"). The learner gets one retry for half XP before the next question.
- Hearts: 3 per world attempt (as in the reference). At 0 hearts the learner sees "Out of hearts" with **Try again** and **Back to map**. In Calm Mode hearts are replaced by unlimited retries and no fail state.
- Hint: shows the first step of the trail only, costs 3 XP, never affects stars.

### 6.6 Gate Checkpoint
The Guardian world is the checkpoint, so no separate test is added. On pass: a Gate-opening animation, a Gate badge, and the Trick Scrolls collected are summarised.

### 6.7 Phase 5 — Reflect (module end, once, about 5 min)

1. **Scoreboard:** Total XP, Stars (x / 45), Best streak, Fastest correct answer, Tricks mastered.
2. **World results:** a 15-cell grid of stars (5 per Gate).
3. **Teach Ganu:** free-text "Explain one trick you learned to Ganu, with an example" (minimum 20 characters).
4. **Match the Trick:** three quick matching items (problem → best technique).
5. **Confidence slider (1–5)** per Gate: "How confident do you feel?"
6. **Celebration screen:** confetti, certificate card, "Play again" and "Back to map".

> A short **Gate Reflection** (one prompt, optional) is shown after each Guardian, so reflective thinking is not left to the very end of a 2-hour module.

---

## 7. Gamification and progression

| Element | Rule |
|---------|------|
| XP | +10 per correct answer; +5 speed bonus if under the target time; −3 for using a hint |
| Streak | Counts consecutive correct answers; ×1.5 XP from a streak of 5 |
| Stars | 15 worlds × 3 = **45** possible stars |
| Trick Scrolls | One per technique (about 32). Earned after using the technique correctly three times in Practice. Visible in the Trick Book on the map |
| Badges | *Lightning* (average time under target in a world), *Trail Blazer* (never needed a hint in a Gate), *Click Crusher* (beat the bot in all three Guardians), *Comeback* (passed a world after a failed attempt) |
| Gate gating | World n+1 needs ≥ 1★ in world n. Next Gate needs the Guardian passed. Quick Check can skip learners ahead. |
| Replay | Any completed Gate or world can be replayed to improve stars. Best result is kept. |

**Fairness note:** speed bonuses never affect whether a Gate unlocks. Stars and unlocking depend on correctness only.

---

## 8. Learner experience requirements

### 8.1 Calm Mode (math-anxiety aware)
- Toggle available from the first screen and in Settings at all times.
- Removes timers, speed bonuses and the "Out of hearts" fail state; retries are unlimited.
- Gate 1 defaults to **soft timers** (visible ring, no penalty) and Calm Mode is suggested to learners who fail a world twice.
- Wrong-answer feedback never uses red flashes or buzzers: coral highlight and a gentle tone.

### 8.2 Input
- Custom on-screen **numeric keypad** (digits, backspace, minus, decimal point, submit) so a phone keyboard never covers the question.
- Physical keyboard supported (digits, Enter, Backspace).
- Typed answers accept equivalent forms where sensible (e.g., `0.5`, `.5`).

### 8.3 Hints, feedback and explanation
- **Hint:** first step of the trail only.
- **Wrong-answer feedback:** shows the intended Thought Trail and one-line misconception.
- **Correct-answer feedback:** short praise and, if a faster method existed, a "Faster path" chip once per question.

### 8.4 Audio
- Narration on all Wonder and Story text, activity intros, and answer feedback.
- Mute toggle in the top bar. The module fully works with audio muted.
- Narration text mirrors on-screen text, with symbols spelled out (×, ÷, −, %, ²) so the voice reads naturally.

### 8.5 Accessibility and inclusion
- WCAG 2.2 AA colour contrast for all text and controls.
- Fully keyboard-operable, including drag interactions (alternative "tap to place").
- Visible focus rings; no motion-only information; `prefers-reduced-motion` respected.
- Screen-reader labels on all controls; live-region announcements for answer feedback.
- No colour-only meaning (correct and incorrect also use icon and text).
- Minimum touch target 44 × 44 px.
- Neutral currency and names; localisable numerals and content (data-driven).

---

## 9. UI/UX design language: "Bead & Ink"

The module has its own identity: warm paper, ink, and abacus beads, rather than dark space.

### 9.1 Design concept
A sunlit market and a mathematician's notebook. Cards look like paper tags, answers are beads sliding on a rail, and strategies appear as hand-drawn **Thought Trails**.

### 9.2 Colour tokens (proposal)

| Token | Hex | Use |
|-------|-----|-----|
| `paper` | `#FFF8EC` | Page background |
| `paper-2` | `#FFFFFF` | Cards |
| `ink` | `#1F2A5A` | Primary text, outlines |
| `ink-soft` | `#4A557F` | Secondary text |
| `saffron` | `#FF9F1C` | Primary CTA (ink text on top) |
| `teal` | `#12A594` | Success, correct |
| `coral` | `#F25F5C` | "Try again" (never flashing) |
| `lavender` | `#7C6CF0` | Wonder phase accent |
| `sun` | `#FFC93C` | Stars, XP |
| `focus-bg` | `#121733` | Optional dark "Focus Mode" for timed worlds |

Gate accents: **Spark** = saffron, **Flow** = teal, **Master** = indigo and magenta (`#C13584`).
Phase accents: Wonder lavender, Story saffron, Simulate teal, Practice sun, Reflect ink.

All colour pairs must be verified at design time to meet 4.5:1 for body text and 3:1 for large text and UI.

### 9.3 Typography
- **Display:** Baloo 2 (friendly, supports Devanagari for later localisation).
- **Body:** Lexend (designed for reading fluency).
- **Numbers and columns:** JetBrains Mono, so digits align in Urdhva and duplex columns.
- Fluid sizing with `clamp()` tied to viewport height as in the reference, with a minimum body size of 16 px.

### 9.4 Signature components

| Component | Purpose |
|-----------|---------|
| **Thought Trail** | Horizontal chips showing the steps (`47 + 39` → `47 + 40` → `− 1` → `86`). Used in Story, Simulate, wrong-answer feedback. Replaces the reference's `FlowDiagram`. |
| **Bead Rail** | SVG abacus for place value and regrouping |
| **Number Line Hopper** | Animated jumps with step counter |
| **Base Balance** | Visual for Nikhilam deficits and surpluses |
| **Cross Grid** | Interactive vertical-crosswise layout |
| **Speed Ring** | Soft, circular timer (optional) |
| **Trick Scroll card** | Collectible card with name, rule and example |
| **Click Bot** | Opponent avatar with a progress bar |
| **Numeric keypad** | On-screen entry |

### 9.5 Layout skeleton (all phases)
- **Top bar:** Home, Map, 5-phase capsule with the active Gate badge, Sound, Settings (Calm Mode, captions, motion).
- **Stage:** one card, never scrolls the page.
- **Bottom action bar:** Back / Primary action (consistent position).
- Consistent card radius, paper texture, and soft shadow. Icons are an SVG set (emoji render differently across devices and are avoided for core UI).

### 9.6 Viewports
| Tier | Size | Behaviour |
|------|------|-----------|
| Primary | 1024 × 600 to 1920 × 1080 landscape | Two-column layouts (sidebar and activity) |
| Tablet portrait | 768 × 1024 | Stacked, large touch targets |
| Phone | 360 × 640 to 430 × 932 | Single column, bottom sheet for hints, keypad docked |
Use `100dvh` so mobile browser bars do not clip content.

### 9.7 Motion
- Short (150–300 ms) transitions; bead and trail animations are the "hero" motion.
- Confetti only for world 3★, Gate pass and final celebration.
- Reduced-motion setting replaces animation with instant state changes.

---

## 10. Content and localisation requirements
- All text, narration, activity definitions and question templates live in structured content files, not in components.
- Narration uses a single source of truth, as in the reference, with every sentence tagged by style (statement, question, encouragement).
- A **content review checklist** (maths accuracy, reading level, no stereotypes) applies to every Gate.
- Reading level: simple sentences, maximum about 20 words, with maths vocabulary introduced in context.

---

## 11. Vedic Maths content-accuracy policy

- Present the techniques as a **named system of shortcuts**. The sutra names are labels that help learners remember a method.
- The techniques are valid arithmetic shortcuts, and every example is mathematically checked.
- Do **not** assert that the methods come from ancient Vedic texts. The "Vedic Mathematics" system was compiled and published in the twentieth century (by Bharati Krishna Tirtha), and the claim of ancient Vedic origin is disputed by historians. Suggested Story wording: *"A collection of calculation shortcuts known as Vedic Mathematics."*
- Where a standard method is just as quick (e.g., ×99 as ×100 − n), say so. The goal is the best tool, not loyalty to a label.
- A reviewer with maths-education background signs off on Gate 2 and Gate 3 Story copy before release.

---

## 12. Analytics and success metrics

### 12.1 Events (no personal data)
`module_start`, `quick_check_result`, `phase_enter`, `activity_complete`, `question_answered` (technique ID, correct, time in ms, attempts, hint used), `world_complete` (stars), `gate_pass`, `calm_mode_toggle`, `reflect_submit`, `module_complete`.

### 12.2 Proposed success metrics (to be calibrated after a pilot)

| Metric | Target |
|--------|--------|
| Gate 1 completion among learners who start | ≥ 70% |
| Learners finishing all three Gates | ≥ 40% |
| Median response time for the same question type, pre-check vs post-check | ≥ 20% faster at equal or higher accuracy |
| Accuracy on technique-tagged items at the end of a Gate | ≥ 75% |
| Share of questions where the intended strategy was used (trail builder and spotter) | ≥ 60% |
| Calm Mode adoption | Tracked, with no target. High adoption means timers are too stressful. |
| Learner and teacher satisfaction (pilot survey) | ≥ 4 / 5 |

### 12.3 Pre/post measurement
A short **Mind Check** (10 mixed questions) is offered at the start and at the end, using separate question sets from the same generator, so improvement can be measured fairly.

---

## 13. Release plan, scope and risks

### 13.1 Phased delivery

| Release | Contents |
|---------|----------|
| **MVP** | Intro, Bazaar Map, Gate 1 complete, shared engine and design system, save and resume, analytics events |
| **R2** | Gate 2 complete, Trick Book, Click Bot tuning |
| **R3** | Gate 3 complete, Mind Check, Reflect and Celebration with certificate |
| **R4 (stretch)** | Hindi localisation, printable Trick Book PDF, teacher summary export |

### 13.2 Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Timers raise anxiety | Learners disengage | Calm Mode, soft timers, no fail state option |
| Vedic origin claims challenged | Credibility | Section 11 policy and expert review |
| Procedural questions produce bad numbers (non-applicable technique, duplicate options) | Wrong or confusing questions | Technique-aware generators, validators, automated tests (TRD) |
| Too many custom activities | Schedule slip | Build ~10 reusable activity components configured per Gate (TRD) |
| Drag interactions inaccessible | Exclusion | Tap-to-place alternatives, keyboard support |
| Long audio generation cost | Budget | Pre-generate once, content-hash cache, regenerate only changed lines |

---

## 14. Appendix: question template examples

| Technique | Template | Valid when | Distractor logic |
|-----------|----------|-----------|------------------|
| G2-T3 Nikhilam | `a × b`, both within 2–15 below 100 | deficits ≤ 15 | adds deficits instead of subtracting; drops the leading zero of the deficit product (e.g., 98 × 97 gives 95 · 06, written as 956 instead of 9506) |
| G2-T1 Square ending 5 | `(10k+5)²` for k = 1..9 | any | writes `n × n` instead of `n × (n + 1)`; forgets the 25 |
| G1-T4 Round and fix | `a ± b` where `b` ends in 7, 8 or 9 | b % 10 ≥ 7 | adjusts in the wrong direction |
| G3-T6 Division by 9 | 3- or 4-digit ÷ 9 | any | forgets to adjust when the last sum is ≥ 9 |
| G3-T8 Square roots | perfect squares 100–10,000 | any | picks the wrong candidate unit (3 vs 7) |

---

*End of PRD. See `Mental_Math_Module_TRD.md` for the technical design.*
