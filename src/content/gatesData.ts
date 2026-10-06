import { GateId } from '../engine/types';

export interface StorySlide {
  id: string;
  title: string;
  body: string;
  quote: string;
  bubble: string;
  artType: 'market' | 'abacus' | 'roundFix' | 'doubleHalve' | 'eleven' | 'estimation' | 'scrolls' | 'square5' | 'balanceScale' | 'crossGrid' | 'fair' | 'picker' | 'tournament' | 'duplex' | 'seeSaw' | 'tower' | 'roots' | 'digitSum';
  image?: string;
  trailDemo?: { label: string; note?: string }[];
}

export interface ActivityDef {
  id: string;
  gate: GateId;
  station: 1 | 2 | 3;
  stationTitle: string;
  activityIndex: 0 | 1 | 2;
  title: string;
  description: string;
  instruction: string;
  rule: string;
  type:
    | 'beadRail'
    | 'numberLine'
    | 'doubleHalve'
    | 'roundFixBuilder'
    | 'nineMachine'
    | 'elevenPeek'
    | 'speedLadder'
    | 'errorDetective'
    | 'miniBotDuel'
    | 'squareSpark'
    | 'baseBalance'
    | 'crossLines'
    | 'trailOrder'
    | 'carryCatcher'
    | 'whichTrick'
    | 'percentBuilder'
    | 'duplexEngine'
    | 'seeSawSquares'
    | 'rootReveal'
    | 'digitSumCheck';
  data?: Record<string, unknown>;
}

export interface WorldDef {
  index: number;
  name: string;
  subtitle: string;
  skillFocus: string;
  mode: 'sprint' | 'entry' | 'trail' | 'spotter' | 'crossgrid' | 'detective' | 'boss';
  techniqueIds: string[];
  isGuardian: boolean;
}

export interface GateData {
  id: GateId;
  name: string;
  tagline: string;
  accentColor: string;
  wonder: {
    hook: string;
    revealSteps: string[];
    wonderQuestion: string;
    dialogue: string;
  };
  storySlides: StorySlide[];
  activities: ActivityDef[];
  worlds: WorldDef[];
}

export const GATES: Record<GateId, GateData> = {
  1: {
    id: 1,
    name: 'Spark',
    tagline: 'Market Foundations & Mental Agility',
    accentColor: '#FF9F1C',
    wonder: {
      hook: '99 × 7 in three seconds?',
      revealSteps: [
        'Think of 99 as 100 − 1.',
        '100 × 7 = 700.',
        'Now take away one 7: 700 − 7 = 693!',
      ],
      wonderQuestion: 'Can you see how rounding to a friendly number turns hard arithmetic into simple child’s play?',
      dialogue: 'Ira’s cash register went black, but 99 × 7 is right there in the air!',
    },
    storySlides: [
      {
        id: 'g1-s1',
        title: 'The Queue is Getting Long',
        body: 'The market was bustling at sunrise. Suddenly, Ira’s electronic till flashed red and died. A line of hungry customers stared at her fresh fruits and spices. "What now?" she gasped.',
        quote: 'When screens turn off, real mental agility turns on.',
        bubble: 'Don’t panic, Ira! Your brain is ten times faster than any silicone chip!',
        artType: 'market',
        image: './images/story/g1_s1.jpg',
      },
      {
        id: 'g1-s2',
        title: 'Friends of Ten & Hundred',
        body: 'Ganu hopped onto the counter with an ancient wooden abacus. "Look at the numbers that make whole tens: 64 and 36, 72 and 28. Find the friends of ten first, and hundreds snap together like magnets."',
        quote: 'Find the companion pair, and the sum completes itself.',
        bubble: '64 needs 36 to make 100. 4 + 6 = 10, 60 + 30 + 10 = 100!',
        artType: 'abacus',
        image: './images/story/g1_s2.jpg',
        trailDemo: [
          { label: '64 + 36', note: 'Spot friends of 10' },
          { label: '4 + 6 = 10', note: 'Units lock in' },
          { label: '60 + 30 + 10 = 100', note: 'Magnets snap!' },
        ],
      },
      {
        id: 'g1-s3',
        title: 'Round and Fix',
        body: 'A customer ordered items costing 47 and 39 coins. "39 is awkward," thought Ira. "Wait! 39 is just 40 minus 1! 47 + 40 is 87... minus 1 is 86!" The customer smiled and paid instantly.',
        quote: 'Jump to the friendly round number first, then trim the fix.',
        bubble: 'Always add the friendly 40, then subtract the 1 extra coin you borrowed!',
        artType: 'roundFix',
        image: './images/story/g1_s3.jpg',
        trailDemo: [
          { label: '47 + 39', note: 'Awkward addition' },
          { label: '47 + 40 = 87', note: 'Friendly round hop' },
          { label: '87 − 1 = 86', note: 'Trim the fix!' },
        ],
      },
      {
        id: 'g1-s4',
        title: 'Double and Halve',
        body: '"Here is a bag of 36 apples at 5 coins each," said the farmer. Multiplying by 5 seemed slow, until Ganu smiled: "Multiplying by 5 is multiplying by 10 and cutting in half! 36 × 10 is 360, half of 360 is 180!"',
        quote: 'Times ten and cut in half: five is just half of ten.',
        bubble: 'Try it with any even number: 24 × 5 = 240 ÷ 2 = 120!',
        artType: 'doubleHalve',
        image: './images/story/g1_s4.jpg',
        trailDemo: [
          { label: '36 × 5', note: 'Five is 10 ÷ 2' },
          { label: '36 × 10 = 360', note: 'Add a zero' },
          { label: '360 ÷ 2 = 180', note: 'Cut in half!' },
        ],
      },
      {
        id: 'g1-s5',
        title: 'Nine and Eleven Tricks',
        body: 'Next came 23 boxes of tea at 11 coins each. Ganu showed Ira the Eleven Peek: "Spread the 2 and 3 apart, and drop their sum (2 + 3 = 5) right between them: 253! And for 9? It’s ×10 minus the number!"',
        quote: 'Numbers have patterns written right on their faces.',
        bubble: '23 × 11: 2 in front, 3 in back, 5 in the middle. 253!',
        artType: 'eleven',
        image: './images/story/g1_s5.jpg',
        trailDemo: [
          { label: '23 × 11', note: 'Peek pattern' },
          { label: '2 _ 3', note: 'Spread outer digits' },
          { label: '2 + 3 = 5', note: 'Sum goes in middle' },
          { label: '253', note: 'Instant answer!' },
        ],
      },
      {
        id: 'g1-s6',
        title: 'Does That Make Sense?',
        body: 'The last customer gave 100 coins for a 63-coin basket. "All from 9, last from 10!" sang Ira. 9 − 6 = 3, 10 − 3 = 7. Change is 37 coins! The market cheered—Ira was faster than the register ever was.',
        quote: 'A mental mathematician never borrows: they look at the complement.',
        bubble: 'You are ready to enter the Practice Lab and earn your first Spark Scrolls!',
        artType: 'estimation',
        image: './images/story/g1_s6.jpg',
      },
    ],
    activities: [
      {
        id: 'g1-s1-a1',
        gate: 1,
        station: 1,
        stationTitle: 'Station 1 · Understand',
        activityIndex: 0,
        title: 'Bead Rail Sum',
        description: 'See place value regrouping in action on an interactive abacus.',
        instruction: 'Slide the beads on the lower rail to add 47 + 38. Watch 10 single beads turn into a ten-bead!',
        rule: 'Ten ones make a ten. Regrouping visually turns carrying into simple counting.',
        type: 'beadRail',
      },
      {
        id: 'g1-s1-a2',
        gate: 1,
        station: 1,
        stationTitle: 'Station 1 · Understand',
        activityIndex: 1,
        title: 'Number Line Hopper',
        description: 'Compare two jumping routes for 58 + 27 on the number line.',
        instruction: 'Click the big jump (+20) and small jump (+7) to reach the destination.',
        rule: 'Split-and-jump keeps the first number stable so your memory never overloads.',
        type: 'numberLine',
      },
      {
        id: 'g1-s1-a3',
        gate: 1,
        station: 1,
        stationTitle: 'Station 1 · Understand',
        activityIndex: 2,
        title: 'Double-Halve Mirror',
        description: 'Watch an array of 36 × 5 transform into 360 ÷ 2.',
        instruction: 'Tap the mirror button to double the width and cut the height in half.',
        rule: 'Multiplying by 5 is multiplying by 10 and halving. The area remains identical!',
        type: 'doubleHalve',
      },
      {
        id: 'g1-s2-a1',
        gate: 1,
        station: 2,
        stationTitle: 'Station 2 · Try It Yourself',
        activityIndex: 0,
        title: 'Round and Fix Builder',
        description: 'Assemble the thought trail for 47 + 39.',
        instruction: 'Pick the rounded jump (+40) and place the correction chip (−1).',
        rule: 'Friendly round numbers make addition easy; always remember to trim what you borrowed.',
        type: 'roundFixBuilder',
      },
      {
        id: 'g1-s2-a2',
        gate: 1,
        station: 2,
        stationTitle: 'Station 2 · Try It Yourself',
        activityIndex: 1,
        title: 'Nine Machine',
        description: 'Multiply 17 × 9 using the ×10 − n method.',
        instruction: 'Multiply 17 by 10, then subtract 17 to finish.',
        rule: 'Nine is ten minus one: 17 × 9 = 170 − 17 = 153.',
        type: 'nineMachine',
      },
      {
        id: 'g1-s2-a3',
        gate: 1,
        station: 2,
        stationTitle: 'Station 2 · Try It Yourself',
        activityIndex: 2,
        title: 'Eleven Peek',
        description: 'Slide the digits apart to reveal the middle sum.',
        instruction: 'Drag or tap to place the middle sum of 2 + 3 into 23 × 11.',
        rule: 'For 2-digit numbers without carry, 11 multiplies by slotting the sum in the center.',
        type: 'elevenPeek',
      },
      {
        id: 'g1-s3-a1',
        gate: 1,
        station: 3,
        stationTitle: 'Station 3 · Solve Alone',
        activityIndex: 0,
        title: 'Speed Ladder',
        description: 'Climb 5 mixed mental math rungs at your own pace.',
        instruction: 'Solve each rung to climb to the top of the market watchtower.',
        rule: 'Consistent technique builds effortless mental fluency.',
        type: 'speedLadder',
      },
      {
        id: 'g1-s3-a2',
        gate: 1,
        station: 3,
        stationTitle: 'Station 3 · Solve Alone',
        activityIndex: 1,
        title: 'Error Detective',
        description: 'Find where the character made an arithmetic slip.',
        instruction: 'Inspect the 3-step working and tap the line that contains the mistake.',
        rule: 'Spotting misconceptions in working protects you from making them in your head.',
        type: 'errorDetective',
      },
      {
        id: 'g1-s3-a3',
        gate: 1,
        station: 3,
        stationTitle: 'Station 3 · Solve Alone',
        activityIndex: 2,
        title: 'Beat Click Bot (Mini)',
        description: 'Race Click Bot over 3 quick mental arithmetic questions.',
        instruction: 'Answer accurately before Click Bot finishes calculations.',
        rule: 'Strategy beats brute computation every single time!',
        type: 'miniBotDuel',
      },
    ],
    worlds: [
      {
        index: 0,
        name: 'Make-Ten Market',
        subtitle: 'Friends of 10 & 100, Left-to-Right Add',
        skillFocus: 'Add to round numbers quickly',
        mode: 'sprint',
        techniqueIds: ['G1-T1', 'G1-T2'],
        isGuardian: false,
      },
      {
        index: 1,
        name: 'Jump Lane',
        subtitle: 'Split-and-Jump & Round-and-Fix',
        skillFocus: 'Hop tens and adjust friendly values',
        mode: 'trail',
        techniqueIds: ['G1-T3', 'G1-T4'],
        isGuardian: false,
      },
      {
        index: 2,
        name: 'Double & Halve Stall',
        subtitle: 'Multiply & Divide by 5 and 4',
        skillFocus: 'Halving and doubling shortcuts',
        mode: 'entry',
        techniqueIds: ['G1-T5', 'G1-T8'],
        isGuardian: false,
      },
      {
        index: 3,
        name: 'Nine & Eleven Alley',
        subtitle: '×9, ×11 Peek, Complement Subtraction',
        skillFocus: 'Spotting instant single-step tricks',
        mode: 'spotter',
        techniqueIds: ['G1-T6', 'G1-T7', 'G1-T9'],
        isGuardian: false,
      },
      {
        index: 4,
        name: 'Gate Guardian 1',
        subtitle: 'Boss Duel against Click Bot',
        skillFocus: 'All Gate 1 skills + Percent Anchors',
        mode: 'boss',
        techniqueIds: ['G1-T1', 'G1-T2', 'G1-T4', 'G1-T5', 'G1-T7', 'G1-T10'],
        isGuardian: true,
      },
    ],
  },

  2: {
    id: 2,
    name: 'Flow',
    tagline: 'Vedic Shortcuts & Base Arithmetic',
    accentColor: '#12A594',
    wonder: {
      hook: '96 × 97 without paper?',
      revealSteps: [
        'Deficits from 100: 96 is −4, 97 is −3.',
        'Cross-subtract: 96 − 3 = 93 (or 97 − 4 = 93).',
        'Multiply deficits: 4 × 3 = 12. Join them: 9312!',
      ],
      wonderQuestion: 'Why does cross-subtracting deficits from 100 automatically produce the exact answer?',
      dialogue: 'No long multiplication, no carrying rows of scratchpad notes—just pure symmetry!',
    },
    storySlides: [
      {
        id: 'g2-s1',
        title: 'Ganu’s Secret Scrolls',
        body: 'Ira unlocked the ancient cupboard behind the spice counter. Inside lay scrolls labeled with strange names: Nikhilam, Ekadhikena, Urdhva. "These are calculation shortcuts compiled in Vedic Mathematics," Ganu explained.',
        quote: 'Named shortcuts give your memory a handle to hold onto.',
        bubble: 'Each sutra is a mental superpower: memorable, visual, and mathematically verified!',
        artType: 'scrolls',
        image: './images/story/g2_s1.jpg',
      },
      {
        id: 'g2-s2',
        title: 'Five-Square Magic',
        body: '“Ever need to square 65?” Ganu asked. Take the tens digit (6). Multiply it by one more than itself: 6 × 7 = 42. Now write 25 at the end: 4225! It works for 15, 25, 35, all the way to 95!',
        quote: 'Ekadhikena Purvena: By one more than the previous one.',
        bubble: '75² = (7 × 8) | 25 = 5625. In two seconds, without writing a single line!',
        artType: 'square5',
        image: './images/story/g2_s2.jpg',
        trailDemo: [
          { label: '65²', note: 'Ends in 5' },
          { label: '6 × (6 + 1) = 42', note: 'One more than previous' },
          { label: 'Attach 25 → 4225', note: 'Complete answer' },
        ],
      },
      {
        id: 'g2-s3',
        title: 'Near 100 (Nikhilam)',
        body: 'Two merchants argued over 94 × 98. Ira stepped forward: "94 is 6 below 100; 98 is 2 below 100. Cross-subtract: 94 − 2 = 92. Multiply the deficits: 6 × 2 = 12. The product is 9212!" Both merchants stood amazed.',
        quote: 'All from 9 and last from 10: base arithmetic balances on 100.',
        bubble: 'It works above 100 too: 104 × 103 = (104 + 3) | (4 × 3) = 10712!',
        artType: 'balanceScale',
        image: './images/story/g2_s3.jpg',
        trailDemo: [
          { label: '94 × 98', note: 'Near base 100' },
          { label: 'Deficits: −6 and −2', note: 'Gaps from 100' },
          { label: '94 − 2 = 92', note: 'Cross-subtract' },
          { label: '6 × 2 = 12 → 9212', note: 'Multiply deficits' },
        ],
      },
      {
        id: 'g2-s4',
        title: 'Cross and Carry',
        body: 'What if numbers aren’t near 100? Urdhva-Tiryagbhyam: Vertical and crosswise! For 23 × 14: right vertical 3 × 4 = 12. Criss-cross: 2×4 + 3×1 = 11. Left vertical 2 × 1 = 2. Regroup carries to get 322!',
        quote: 'Urdhva-Tiryagbhyam: Vertical and Crosswise multiplication.',
        bubble: 'Think of it as lightning bolts striking across the columns!',
        artType: 'crossGrid',
        image: './images/story/g2_s4.jpg',
      },
      {
        id: 'g2-s5',
        title: 'The Shortcut Fair',
        body: 'Ira discovered more gems: ×99 is ×100 − n. Multiplying by 25 is dividing by 4 and appending two zeros (36 × 25 = 900). Division by 25 is multiplying by 4 and dividing by 100!',
        quote: 'Choose the sharpest tool for the numbers in front of you.',
        bubble: 'Why multiply by 25 when you can just divide 36 by 4?',
        artType: 'fair',
        image: './images/story/g2_s5.jpg',
      },
      {
        id: 'g2-s6',
        title: 'Which Trick Fits?',
        body: '“Now the real test begins,” warned Ganu. “A master doesn’t use a hammer for every nail. 47 × 99 uses Ekanyunena; 47 × 53 uses difference of squares. Choosing the right trick is half the battle!”',
        quote: 'Fluency is knowing not just how to calculate, but which path is fastest.',
        bubble: 'Step into Gate 2’s Flow and let calculation become a natural reflex!',
        artType: 'picker',
        image: './images/story/g2_s6.jpg',
      },
    ],
    activities: [
      {
        id: 'g2-s1-a1',
        gate: 2,
        station: 1,
        stationTitle: 'Station 1 · Understand',
        activityIndex: 0,
        title: 'Square Spark (65²)',
        description: 'Discover why n × (n+1) works geometrically using an area grid.',
        instruction: 'Split the 65 × 65 square into (60 + 5) × (60 + 5) areas to see the 25 emerge.',
        rule: 'Every square of a number ending in 5 breaks down into n(n+1) hundreds plus 25.',
        type: 'squareSpark',
      },
      {
        id: 'g2-s1-a2',
        gate: 2,
        station: 1,
        stationTitle: 'Station 1 · Understand',
        activityIndex: 1,
        title: 'Base Balance Scale',
        description: 'See Nikhilam deficits balanced against 100 on an interactive scale.',
        instruction: 'Move the deficit weights for 97 × 94 to observe the cross-subtraction balance.',
        rule: 'Cross-subtraction removes the shared overlap from the base 100.',
        type: 'baseBalance',
      },
      {
        id: 'g2-s1-a3',
        gate: 2,
        station: 1,
        stationTitle: 'Station 1 · Understand',
        activityIndex: 2,
        title: 'Cross-Lines Visualizer',
        description: 'Watch criss-cross lines light up for vertical and crosswise multiplication.',
        instruction: 'Click each stage (Right, Cross, Left) to see lines calculate 23 × 14.',
        rule: 'Vertical and crosswise calculates all place-value combinations in a single leftward pass.',
        type: 'crossLines',
      },
      {
        id: 'g2-s2-a1',
        gate: 2,
        station: 2,
        stationTitle: 'Station 2 · Try It Yourself',
        activityIndex: 0,
        title: 'Build the Trail (Nikhilam)',
        description: 'Drag and arrange the 4 steps of a Nikhilam calculation into correct order.',
        instruction: 'Order the steps from finding deficits to final concatenation.',
        rule: 'Deficit → Cross-subtract → Multiply deficits → Combine 2-digit right part.',
        type: 'trailOrder',
      },
      {
        id: 'g2-s2-a2',
        gate: 2,
        station: 2,
        stationTitle: 'Station 2 · Try It Yourself',
        activityIndex: 1,
        title: 'Carry Catcher',
        description: 'Spot which columns carry in vertical-crosswise multiplication.',
        instruction: 'Tap the column that exceeds 9 and must send a carry to the left.',
        rule: 'Keep only the unit digit in each column; all tens carry into the next column left.',
        type: 'carryCatcher',
      },
      {
        id: 'g2-s2-a3',
        gate: 2,
        station: 2,
        stationTitle: 'Station 2 · Try It Yourself',
        activityIndex: 2,
        title: 'Which Trick Fits?',
        description: 'Pick the fastest mental shortcut for given problems.',
        instruction: 'Select whether to use Nikhilam, Ending in 5, ×99, or Vertical-Crosswise.',
        rule: 'Examining the structure of numbers first saves 80% of mental effort.',
        type: 'whichTrick',
      },
      {
        id: 'g2-s3-a1',
        gate: 2,
        station: 3,
        stationTitle: 'Station 3 · Solve Alone',
        activityIndex: 0,
        title: 'Percent Builder',
        description: 'Construct 15% and 12.5% using friendly building blocks.',
        instruction: 'Combine 10% + 5% blocks to calculate tips and discounts.',
        rule: 'Complex percentages are easily calculated as sums and halves of 10%.',
        type: 'percentBuilder',
      },
      {
        id: 'g2-s3-a2',
        gate: 2,
        station: 3,
        stationTitle: 'Station 3 · Solve Alone',
        activityIndex: 1,
        title: 'Mix-Master Ladder',
        description: 'Climb 5 rungs that switch randomly between all Gate 2 techniques.',
        instruction: 'Identify the pattern and solve each question before the soft timer pulses.',
        rule: 'Switching rapidly between shortcuts is the hallmark of mathematical flow.',
        type: 'speedLadder',
      },
      {
        id: 'g2-s3-a3',
        gate: 2,
        station: 3,
        stationTitle: 'Station 3 · Solve Alone',
        activityIndex: 2,
        title: 'Beat Click Bot (Gate 2)',
        description: 'Click Bot has upgraded its speed! Beat it over 3 intermediate rounds.',
        instruction: 'Calculate accurately using your Vedic shortcuts.',
        rule: 'Vedic shortcuts eliminate 4 out of 5 scratchpad steps.',
        type: 'miniBotDuel',
      },
    ],
    worlds: [
      {
        index: 0,
        name: 'Five-Square Fort',
        subtitle: 'Squares ending in 5 & Multiply by 11 with Carry',
        skillFocus: 'Instant powers and multi-digit 11s',
        mode: 'entry',
        techniqueIds: ['G2-T1', 'G2-T2'],
        isGuardian: false,
      },
      {
        index: 1,
        name: 'Base Bridge',
        subtitle: 'Nikhilam Below and Above 100',
        skillFocus: 'Deficits and surpluses near base 100',
        mode: 'entry',
        techniqueIds: ['G2-T3', 'G2-T4'],
        isGuardian: false,
      },
      {
        index: 2,
        name: 'Cross Canal',
        subtitle: 'Vertical and Crosswise 2×2',
        skillFocus: 'Mastering the Urdhva criss-cross algorithm',
        mode: 'crossgrid',
        techniqueIds: ['G2-T5'],
        isGuardian: false,
      },
      {
        index: 3,
        name: 'Shortcut & Percent Fair',
        subtitle: '×99, ×25, ×125, ÷25, All-from-9, 15% Blocks',
        skillFocus: 'Rapid recognition of strategic shortcuts',
        mode: 'spotter',
        techniqueIds: ['G2-T6', 'G2-T7', 'G2-T8', 'G2-T9', 'G2-T10'],
        isGuardian: false,
      },
      {
        index: 4,
        name: 'Gate Guardian 2',
        subtitle: 'High-Speed Boss Duel with Click Bot',
        skillFocus: 'All Gate 2 Vedic techniques combined',
        mode: 'boss',
        techniqueIds: ['G2-T1', 'G2-T3', 'G2-T5', 'G2-T6', 'G2-T7', 'G2-T10'],
        isGuardian: true,
      },
    ],
  },

  3: {
    id: 3,
    name: 'Master',
    tagline: 'Duplex Columns, Power Roots & Verification',
    accentColor: '#8A4FFF',
    wonder: {
      hook: '47 × 53 in your head?',
      revealSteps: [
        'Notice both are 3 away from 50: (50 − 3)(50 + 3).',
        'Difference of squares: 50² − 3².',
        '2500 − 9 = 2491!',
      ],
      wonderQuestion: 'Can balance around a middle number solve multiplications faster than a calculator?',
      dialogue: 'Symmetry is the ultimate weapon of mental mathematics!',
    },
    storySlides: [
      {
        id: 'g3-s1',
        title: 'The Grand Tournament',
        body: 'Learners and merchants gathered from across the kingdom for the Mental Math Tournament. Ira stood with Ganu in the grand arena. Click Bot buzzed with overclocked excitement.',
        quote: 'Mastery is not just speed—it is absolute certainty and joy.',
        bubble: 'In Gate 3, we master general squaring, power roots, and instant proof checks!',
        artType: 'tournament',
        image: './images/story/g3_s1.jpg',
      },
      {
        id: 'g3-s2',
        title: 'Squares, Two Ways',
        body: '“Near 100? Use Yavadunam: 103² = 106 | 09 = 10609. But for any 2-digit number like 43²? Use Dwandwa Yoga (Duplex)!” 4² | 2(4)(3) | 3² = 16 | 24 | 9 = 1849!',
        quote: 'Duplex extracts the square column by column without scratchpad paper.',
        bubble: 'Square first digit, double the product of digits, square last digit!',
        artType: 'duplex',
        image: './images/story/g3_s2.jpg',
        trailDemo: [
          { label: '43²', note: 'Duplex method' },
          { label: '4² = 16', note: 'First digit' },
          { label: '2 × 4 × 3 = 24', note: 'Middle cross (2ab)' },
          { label: '3² = 9', note: 'Last digit' },
          { label: '16 | 24 | 9 → 1849', note: 'Carry and combine' },
        ],
      },
      {
        id: 'g3-s3',
        title: 'Balance the See-Saw',
        body: 'Numbers centered around a round number balance like a see-saw: 47 × 53 is 3 below and 3 above 50. (50 − 3)(50 + 3) = 50² − 3² = 2500 − 9 = 2491. What about base 50? Anurupyena!',
        quote: 'When numbers are symmetric, the difference of squares eliminates the cross terms.',
        bubble: '50² is 2500, minus 9 is 2491. Effortless and beautiful!',
        artType: 'seeSaw',
        image: './images/story/g3_s3.jpg',
      },
      {
        id: 'g3-s4',
        title: 'Towers and Columns',
        body: 'For 3-digit multiplication like 213 × 14, pad the 14 with a leading 0 (014). Five vertical-crosswise columns calculate the entire product in your mind without writing rows of partial sums!',
        quote: 'Any size multiplication reduces to vertical and criss-cross stripes.',
        bubble: 'Pad with leading zeros to maintain uniform geometry.',
        artType: 'tower',
        image: './images/story/g3_s4.jpg',
      },
      {
        id: 'g3-s5',
        title: 'Division and Roots',
        body: '“Now the magic of roots,” said Ganu. “Any perfect square like 2209: ends in 9, so unit is 3 or 7. Between 40² (1600) and 50² (2500). 45² = 2025 < 2209, so the root is 47! And cube roots are even easier—endings are unique!”',
        quote: 'Perfect powers leave unmistakable fingerprints on their units digit.',
        bubble: '∛29791 ends in 1 → 1. 29 is between 27 and 64 → 3. The answer is 31!',
        artType: 'roots',
        image: './images/story/g3_s5.jpg',
      },
      {
        id: 'g3-s6',
        title: 'Trust, but Verify',
        body: 'Before declaring victory, a master checks their work. Navashesh: casting out nines. The digit sum of the factors must equal the digit sum of the product. Click Bot conceded with a polite bow: Ira was crowned Mental Math Champion!',
        quote: 'Digit sums give you instant proof that your mental calculation is flawless.',
        bubble: 'You have earned the title of Master! Step into the arena and prove your skill!',
        artType: 'digitSum',
        image: './images/story/g3_s6.jpg',
      },
    ],
    activities: [
      {
        id: 'g3-s1-a1',
        gate: 3,
        station: 1,
        stationTitle: 'Station 1 · Understand',
        activityIndex: 0,
        title: 'Duplex Engine',
        description: 'See how duplex columns (a², 2ab, b²) form the exact square.',
        instruction: 'Step through 43² to see the 3 duplex zones illuminate.',
        rule: 'Duplex isolates algebraic terms into compact arithmetic columns.',
        type: 'duplexEngine',
      },
      {
        id: 'g3-s1-a2',
        gate: 3,
        station: 1,
        stationTitle: 'Station 1 · Understand',
        activityIndex: 1,
        title: 'See-Saw Squares',
        description: 'Balance 47 × 53 on a see-saw centered at 50.',
        instruction: 'Move the deviation sliders to observe mid² − d² in action.',
        rule: 'Symmetric factors cancel the middle linear terms completely.',
        type: 'seeSawSquares',
      },
      {
        id: 'g3-s1-a3',
        gate: 3,
        station: 1,
        stationTitle: 'Station 1 · Understand',
        activityIndex: 2,
        title: 'Tower Crossing (3×2)',
        description: 'Pad 213 × 14 with a leading zero and visualize 5 columns.',
        instruction: 'Click through the 5 crosswise columns to see how the product accumulates.',
        rule: 'Padding with 0 preserves full algebraic generality for multi-digit products.',
        type: 'crossLines',
      },
      {
        id: 'g3-s2-a1',
        gate: 3,
        station: 2,
        stationTitle: 'Station 2 · Try It Yourself',
        activityIndex: 0,
        title: 'Chain Chef',
        description: 'Assemble multi-step mental arithmetic chains.',
        instruction: 'Combine distributive chunking and friendly pairs to solve 47×6 + 53×6.',
        rule: 'Factoring out common terms reduces multi-step problems to single-digit mental operations.',
        type: 'trailOrder',
      },
      {
        id: 'g3-s2-a2',
        gate: 3,
        station: 2,
        stationTitle: 'Station 2 · Try It Yourself',
        activityIndex: 1,
        title: 'Root Reveal',
        description: 'Deduce square and cube roots from ending digits and ranges.',
        instruction: 'Identify the candidate ending, determine the tens band, and pick the true root.',
        rule: 'Last digit specifies units; bounding powers specify tens.',
        type: 'rootReveal',
      },
      {
        id: 'g3-s2-a3',
        gate: 3,
        station: 2,
        stationTitle: 'Station 2 · Try It Yourself',
        activityIndex: 2,
        title: 'Slide Division by 9',
        description: 'Use running digit sums to compute quotient and remainder.',
        instruction: 'Slide the cumulative digit sums across the dividend.',
        rule: 'Division by 9 is simply the running cumulative sum of its digits.',
        type: 'nineMachine',
      },
      {
        id: 'g3-s3-a1',
        gate: 3,
        station: 3,
        stationTitle: 'Station 3 · Solve Alone',
        activityIndex: 0,
        title: 'Digit-Sum Detective',
        description: 'Test calculations using Navashesh (casting out nines).',
        instruction: 'Compute the single digit sums to confirm or debunk answers.',
        rule: 'If digit sum of factors ≠ digit sum of product, the answer is guaranteed wrong.',
        type: 'digitSumCheck',
      },
      {
        id: 'g3-s3-a2',
        gate: 3,
        station: 3,
        stationTitle: 'Station 3 · Solve Alone',
        activityIndex: 1,
        title: 'Estimate with Tolerance',
        description: 'Round to friendly tens and determine if an answer is in the safe band.',
        instruction: 'Compute a fast ±5% estimate before calculating the exact value.',
        rule: 'Estimation builds intuition and prevents catastrophic order-of-magnitude mistakes.',
        type: 'speedLadder',
      },
      {
        id: 'g3-s3-a3',
        gate: 3,
        station: 3,
        stationTitle: 'Station 3 · Solve Alone',
        activityIndex: 2,
        title: 'The Grand Tournament Boss Duel',
        description: 'Final championship duel against Click Bot across all mental math disciplines.',
        instruction: 'Face the ultimate 5-round challenge to claim the Master Scroll.',
        rule: 'Real mental math mastery is speed with understanding.',
        type: 'miniBotDuel',
      },
    ],
    worlds: [
      {
        index: 0,
        name: 'Duplex Dojo',
        subtitle: 'Near-Base Squares & Duplex Squaring',
        skillFocus: 'Square any 2-digit number in seconds',
        mode: 'entry',
        techniqueIds: ['G3-T1', 'G3-T2'],
        isGuardian: false,
      },
      {
        index: 1,
        name: 'Tower Crossing',
        subtitle: '3×2 & 2×2 Crosswise at Tournament Speed',
        skillFocus: 'Complex column multiplication without scratchpads',
        mode: 'crossgrid',
        techniqueIds: ['G3-T5', 'G2-T5'],
        isGuardian: false,
      },
      {
        index: 2,
        name: 'Balance Gate',
        subtitle: 'Difference of Squares, Working Base 50, Chunking',
        skillFocus: 'Symmetric multiplication and distributive grouping',
        mode: 'entry',
        techniqueIds: ['G3-T3', 'G3-T4', 'G3-T7'],
        isGuardian: false,
      },
      {
        index: 3,
        name: 'Division Den',
        subtitle: 'Slide Division, Perfect Square & Cube Roots',
        skillFocus: 'Inverse operations and instant root deduction',
        mode: 'entry',
        techniqueIds: ['G3-T6', 'G3-T8', 'G3-T9'],
        isGuardian: false,
      },
      {
        index: 4,
        name: 'Gate Guardian 3',
        subtitle: 'The Grand Master Tournament Duel',
        skillFocus: 'Chains, verification, roots, and ultimate fluency',
        mode: 'boss',
        techniqueIds: ['G3-T1', 'G3-T3', 'G3-T8', 'G3-T10', 'G3-T11', 'G3-T12'],
        isGuardian: true,
      },
    ],
  },
};

/**
 * 32 Collectible Trick Scrolls
 */
export interface TrickScroll {
  id: string;
  gate: GateId;
  name: string;
  sutraLabel?: string;
  rule: string;
  example: string;
  rarity: 'common' | 'rare' | 'legendary';
}

export const TRICK_SCROLLS: TrickScroll[] = [
  // Gate 1
  { id: 'G1-T1', gate: 1, name: 'Make 10 & 100', rule: 'Find friendly numbers that snap into round tens/hundreds.', example: '64 + 36 = 100', rarity: 'common' },
  { id: 'G1-T2', gate: 1, name: 'Left-to-Right Add', rule: 'Add the largest place values first, then add ones.', example: '47 + 38: 70 + 15 = 85', rarity: 'common' },
  { id: 'G1-T3', gate: 1, name: 'Split and Jump', rule: 'Keep first number whole, jump tens, then ones.', example: '58 + 27: 58 + 20 = 78; + 7 = 85', rarity: 'common' },
  { id: 'G1-T4', gate: 1, name: 'Round and Fix', rule: 'Round to friendly number, then subtract the fix.', example: '47 + 39 = 47 + 40 − 1 = 86', rarity: 'common' },
  { id: 'G1-T5', gate: 1, name: 'Double and Halve', rule: 'Multiplying by 5 is multiplying by 10 and halving.', example: '36 × 5 = 360 ÷ 2 = 180', rarity: 'common' },
  { id: 'G1-T6', gate: 1, name: 'The Nine Machine', rule: '×9 is ×10 minus the number itself.', example: '17 × 9 = 170 − 17 = 153', rarity: 'common' },
  { id: 'G1-T7', gate: 1, name: 'Eleven Peek', rule: 'Spread digits apart and drop their sum in the middle.', example: '23 × 11 = 2 · 5 · 3 = 253', rarity: 'common' },
  { id: 'G1-T8', gate: 1, name: 'Double & Slide (÷5)', rule: 'Dividing by 5 is doubling and dividing by 10.', example: '85 ÷ 5 = 170 ÷ 10 = 17', rarity: 'common' },
  { id: 'G1-T9', gate: 1, name: '100 Complement', rule: 'Tens from 9, last from 10: subtract without borrowing.', example: '100 − 63 = 37', rarity: 'common' },
  { id: 'G1-T10', gate: 1, name: 'Percent Anchors', rule: '50% = half, 25% = half of half, 10% = divide by 10.', example: '10% of 240 = 24', rarity: 'common' },

  // Gate 2
  { id: 'G2-T1', gate: 2, name: 'Squares Ending 5', sutraLabel: 'Ekadhikena Purvena', rule: 'Multiply tens by (tens + 1), attach 25 at the end.', example: '65² = (6 × 7) | 25 = 4225', rarity: 'rare' },
  { id: 'G2-T2', gate: 2, name: '11 with Carry', rule: 'Outer digits with middle sum; carry 1 left if sum ≥ 10.', example: '57 × 11 = 627', rarity: 'rare' },
  { id: 'G2-T3', gate: 2, name: 'Near 100 (Below)', sutraLabel: 'Nikhilam', rule: 'Cross-subtract deficits from 100, multiply deficits for 2-digit end.', example: '97 × 94 = 9118', rarity: 'rare' },
  { id: 'G2-T4', gate: 2, name: 'Near 100 (Above)', sutraLabel: 'Nikhilam', rule: 'Cross-add surpluses above 100, multiply surpluses.', example: '104 × 103 = 10712', rarity: 'rare' },
  { id: 'G2-T5', gate: 2, name: 'Vertical & Crosswise 2×2', sutraLabel: 'Urdhva-Tiryagbhyam', rule: 'Vertical right, criss-cross sum, vertical left; carry leftwards.', example: '23 × 14 = 322', rarity: 'rare' },
  { id: 'G2-T6', gate: 2, name: 'By One Less (×99)', sutraLabel: 'Ekanyunena Purvena', rule: '×99 is ×100 minus the number.', example: '47 × 99 = 4700 − 47 = 4653', rarity: 'rare' },
  { id: 'G2-T7', gate: 2, name: '×25 and ×125', rule: '×25 = ÷4 × 100; ×125 = ÷8 × 1000.', example: '36 × 25 = 900', rarity: 'rare' },
  { id: 'G2-T8', gate: 2, name: 'All from 9 Subtraction', sutraLabel: 'Nikhilam', rule: 'Subtract each digit from 9, last nonzero from 10.', example: '1000 − 467 = 533', rarity: 'rare' },
  { id: 'G2-T9', gate: 2, name: 'Division by 25/50', rule: '÷25 is ×4 ÷ 100; ÷50 is ×2 ÷ 100.', example: '350 ÷ 25 = 14', rarity: 'rare' },
  { id: 'G2-T10', gate: 2, name: '15% & 12.5% Blocks', rule: '15% = 10% + half of 10%; 12.5% = 1/8.', example: '15% of 80 = 8 + 4 = 12', rarity: 'rare' },

  // Gate 3
  { id: 'G3-T1', gate: 3, name: 'Near-Base Squares', sutraLabel: 'Yavadunam', rule: 'Add deviation to number, attach squared deviation (2 digits).', example: '103² = 10609; 97² = 9409', rarity: 'legendary' },
  { id: 'G3-T2', gate: 3, name: 'Duplex Squaring', sutraLabel: 'Dwandwa Yoga', rule: 'For ab: a² | 2ab | b²; carry leftwards.', example: '43² = 16 | 24 | 9 = 1849', rarity: 'legendary' },
  { id: 'G3-T3', gate: 3, name: 'Difference of Squares', rule: 'Balanced around mid: (mid − d)(mid + d) = mid² − d².', example: '47 × 53 = 50² − 3² = 2491', rarity: 'legendary' },
  { id: 'G3-T4', gate: 3, name: 'Working Base 50', sutraLabel: 'Anurupyena', rule: 'Use base 50 (half of 100). Cross-adjust, ×50, add deficit product.', example: '46 × 47 = 2162', rarity: 'legendary' },
  { id: 'G3-T5', gate: 3, name: '3×2 Crosswise', sutraLabel: 'Urdhva-Tiryagbhyam', rule: 'Pad with leading 0 and calculate 5 vertical-cross columns.', example: '213 × 014 = 2982', rarity: 'legendary' },
  { id: 'G3-T6', gate: 3, name: 'Slide Division by 9', sutraLabel: 'Paravartya', rule: 'Carry running cumulative digit sums to form quotient and remainder.', example: '1234 ÷ 9 = 137 R 1', rarity: 'legendary' },
  { id: 'G3-T7', gate: 3, name: 'Distributive Chunking', rule: 'Factor out common multipliers when partners sum to 100.', example: '47×6 + 53×6 = 100×6 = 600', rarity: 'legendary' },
  { id: 'G3-T8', gate: 3, name: 'Perfect Square Roots', rule: 'Last digit gives unit candidates; bounding squares give tens.', example: '√2209 = 47', rarity: 'legendary' },
  { id: 'G3-T9', gate: 3, name: 'Perfect Cube Roots', rule: 'Last digit uniquely gives unit; thousands prefix gives tens.', example: '∛29791 = 31', rarity: 'legendary' },
  { id: 'G3-T10', gate: 3, name: 'Digit-Sum Check', sutraLabel: 'Navashesh', rule: 'Cast out 9s: digit sum of factors must equal digit sum of product.', example: '213 × 14 = 2982 → 6 × 5 = 30 → 3 matches 21 → 3', rarity: 'legendary' },
  { id: 'G3-T11', gate: 3, name: 'Percent Chains', rule: 'Chain 10%, 5%, and 1% building blocks for any amount.', example: '18% of 250 = 25 + 12.5 + 7.5 = 45', rarity: 'legendary' },
  { id: 'G3-T12', gate: 3, name: 'Estimate with Tolerance', rule: 'Round to friendly tens to determine the sanity band before computing.', example: '487 × 19 ≈ 500 × 20 = 10,000', rarity: 'legendary' },
];
