import { Technique, Difficulty, Distractor } from '../types';
import { pickInt } from '../rng';

export const gate1Techniques: Technique[] = [
  // G1-T1: Make 10 / 100
  {
    id: 'G1-T1',
    level: 1,
    name: 'Make 10 & 100',
    skill: 'add',
    ruleOneLine: 'Find the "friendly number" that completes the round ten or hundred.',
    exampleStr: '64 + 36 = 100',
    applicable: ([a, b]) => a + b === 10 || a + b === 100 || (a + b) % 10 === 0,
    draw: (rng, d) => {
      if (d.band === 'warmup') {
        const a = pickInt(rng, 1, 9);
        return [a, 10 - a];
      }
      const a = pickInt(rng, 11, 89);
      return [a, 100 - a];
    },
    compute: ([a, b]) => a + b,
    trail: ([a, b]) => [
      { label: `Target: 100`, note: 'Look for the friend to 100' },
      { label: `${a} needs ${100 - a}`, value: 100, note: 'Units sum to 10, tens sum to 9' },
    ],
    distractors: ([a, b]) => {
      const target = a + b;
      return [
        { value: target - 10, why: 'Forgot to add the extra 10 formed by the ones digits.' },
        { value: target + 10, why: 'Added an extra ten after regrouping.' },
        { value: target - 2, why: 'Miscalculated the complementary ones pair.' },
      ];
    },
    prompt: ([a, b]) => `${a} + ${b}`,
    targetMs: (d) => (d.band === 'warmup' ? 6000 : 8000),
  },

  // G1-T2: Left-to-right add
  {
    id: 'G1-T2',
    level: 1,
    name: 'Left-to-Right Add',
    skill: 'add',
    ruleOneLine: 'Add the largest place values first (tens), then add the ones.',
    exampleStr: '47 + 38: 40 + 30 = 70; 7 + 8 = 15; 70 + 15 = 85',
    applicable: ([a, b]) => a >= 10 && b >= 10,
    draw: (rng, d) => {
      const maxTens = d.band === 'stretch' ? 89 : 59;
      return [pickInt(rng, 24, maxTens), pickInt(rng, 18, 48)];
    },
    compute: ([a, b]) => a + b,
    trail: ([a, b]) => {
      const aTens = Math.floor(a / 10) * 10;
      const bTens = Math.floor(b / 10) * 10;
      const sumTens = aTens + bTens;
      const aOnes = a % 10;
      const bOnes = b % 10;
      const sumOnes = aOnes + bOnes;
      return [
        { label: `${aTens} + ${bTens} = ${sumTens}`, value: sumTens, note: 'Add the tens first' },
        { label: `${aOnes} + ${bOnes} = ${sumOnes}`, value: sumOnes, note: 'Add the ones next' },
        { label: `${sumTens} + ${sumOnes} = ${sumTens + sumOnes}`, value: sumTens + sumOnes, note: 'Combine tens and ones' },
      ];
    },
    distractors: ([a, b]) => {
      const ans = a + b;
      return [
        { value: ans - 10, why: 'Forgot to carry the ten from the sum of the ones.' },
        { value: ans + 10, why: 'Added the carry ten twice.' },
        { value: ans - 1, why: 'Small arithmetic slip in the ones digits.' },
      ];
    },
    prompt: ([a, b]) => `${a} + ${b}`,
    targetMs: (d) => (d.band === 'warmup' ? 8000 : 10000),
  },

  // G1-T3: Split and jump
  {
    id: 'G1-T3',
    level: 1,
    name: 'Split and Jump',
    skill: 'add',
    ruleOneLine: 'Keep the first number whole, jump the tens of the second, then jump the ones.',
    exampleStr: '58 + 27: 58 + 20 = 78; 78 + 7 = 85',
    applicable: ([a, b]) => a >= 15 && b >= 12,
    draw: (rng, d) => [pickInt(rng, 35, 68), pickInt(rng, 15, 39)],
    compute: ([a, b]) => a + b,
    trail: ([a, b]) => {
      const tens = Math.floor(b / 10) * 10;
      const ones = b % 10;
      const intermediate = a + tens;
      return [
        { label: `Start at ${a}`, value: a, note: 'Keep first number whole' },
        { label: `+ ${tens} = ${intermediate}`, value: intermediate, note: 'Big jump (tens)' },
        { label: `+ ${ones} = ${intermediate + ones}`, value: intermediate + ones, note: 'Small jump (ones)' },
      ];
    },
    distractors: ([a, b]) => {
      const ans = a + b;
      return [
        { value: ans - 10, why: 'Did not jump the full tens count.' },
        { value: ans + (b % 10), why: 'Jumped the ones twice.' },
        { value: ans - 2, why: 'Counted the ones hop incorrectly.' },
      ];
    },
    prompt: ([a, b]) => `${a} + ${b}`,
    targetMs: () => 9000,
  },

  // G1-T4: Round and fix
  {
    id: 'G1-T4',
    level: 1,
    name: 'Round and Fix',
    skill: 'add',
    ruleOneLine: 'Round to a friendly round number (+1 or +2), then subtract the fix.',
    exampleStr: '47 + 39 = 47 + 40 − 1 = 86',
    applicable: ([a, b]) => b % 10 >= 7 || b % 10 <= 2,
    draw: (rng, d) => {
      const a = pickInt(rng, 25, 75);
      const tens = pickInt(rng, 2, 5) * 10;
      const b = tens - pickInt(rng, 1, 2); // ends in 8 or 9
      return [a, b];
    },
    compute: ([a, b]) => a + b,
    trail: ([a, b]) => {
      const rounded = Math.round(b / 10) * 10;
      const diff = rounded - b;
      return [
        { label: `Round ${b} up to ${rounded}`, note: `Friendly multiple of 10` },
        { label: `${a} + ${rounded} = ${a + rounded}`, value: a + rounded, note: 'Quick addition' },
        { label: `${a + rounded} − ${diff} = ${a + b}`, value: a + b, note: `Fix: subtract the extra ${diff}` },
      ];
    },
    distractors: ([a, b]) => {
      const ans = a + b;
      const rounded = Math.round(b / 10) * 10;
      const diff = rounded - b;
      return [
        { value: a + rounded + diff, why: 'Added the fix adjustment instead of subtracting it!' },
        { value: a + rounded, why: 'Forgot to apply the final adjustment fix.' },
        { value: ans - 10, why: 'Subtracted a whole ten instead of the small adjustment.' },
      ];
    },
    prompt: ([a, b]) => `${a} + ${b}`,
    targetMs: () => 8000,
  },

  // G1-T5: Double and halve (e.g. × 5 = × 10 ÷ 2)
  {
    id: 'G1-T5',
    level: 1,
    name: 'Double & Halve',
    skill: 'mul',
    ruleOneLine: 'Multiplying by 5 is the same as multiplying by 10 then halving.',
    exampleStr: '36 × 5 = 360 ÷ 2 = 180',
    applicable: ([a, b]) => b === 5 && a % 2 === 0,
    draw: (rng, d) => {
      const evenNum = pickInt(rng, 8, d.band === 'stretch' ? 48 : 28) * 2;
      return [evenNum, 5];
    },
    compute: ([a, b]) => a * b,
    trail: ([a]) => [
      { label: `${a} × 10 = ${a * 10}`, value: a * 10, note: 'Step 1: Multiply by 10 (add a zero)' },
      { label: `Halve ${a * 10} = ${(a * 10) / 2}`, value: (a * 10) / 2, note: 'Step 2: Cut in half' },
    ],
    distractors: ([a]) => {
      const ans = a * 5;
      return [
        { value: a * 10, why: 'Multiplied by 10 but forgot to divide by 2.' },
        { value: Math.floor(ans / 2), why: 'Halved twice instead of once.' },
        { value: ans + 10, why: 'Miscalculated the half of the tens place.' },
      ];
    },
    prompt: ([a, b]) => `${a} × ${b}`,
    targetMs: () => 7000,
  },

  // G1-T6: Nine-machine (× 9 = × 10 − n)
  {
    id: 'G1-T6',
    level: 1,
    name: 'The Nine Machine',
    skill: 'mul',
    ruleOneLine: 'Multiplying by 9 is multiplying by 10, minus the original number.',
    exampleStr: '17 × 9 = 170 − 17 = 153',
    applicable: ([a, b]) => b === 9,
    draw: (rng, d) => [pickInt(rng, 12, d.band === 'stretch' ? 45 : 25), 9],
    compute: ([a, b]) => a * b,
    trail: ([a]) => [
      { label: `${a} × 10 = ${a * 10}`, value: a * 10, note: 'Multiply by 10' },
      { label: `${a * 10} − ${a} = ${a * 9}`, value: a * 9, note: `Take away one ${a}` },
    ],
    distractors: ([a]) => {
      const ans = a * 9;
      return [
        { value: a * 10 - 9, why: 'Subtracted 9 instead of subtracting the number itself!' },
        { value: a * 10, why: 'Multiplied by 10 but forgot to take away the number.' },
        { value: ans + 10, why: 'Subtracted 10 less than needed.' },
      ];
    },
    prompt: ([a, b]) => `${a} × ${b}`,
    targetMs: () => 8000,
  },

  // G1-T7: Eleven peek (2-digit sum < 10 for Gate 1)
  {
    id: 'G1-T7',
    level: 1,
    name: 'Eleven Peek',
    skill: 'mul',
    ruleOneLine: 'Split the two digits and put their sum right in the middle.',
    exampleStr: '23 × 11 → 2 · (2+3=5) · 3 = 253',
    applicable: ([a, b]) => b === 11 && Math.floor(a / 10) + (a % 10) < 10,
    draw: (rng) => {
      // Pick digits whose sum is < 10
      const d1 = pickInt(rng, 1, 5);
      const d2 = pickInt(rng, 1, 9 - d1);
      return [d1 * 10 + d2, 11];
    },
    compute: ([a, b]) => a * b,
    trail: ([a]) => {
      const d1 = Math.floor(a / 10);
      const d2 = a % 10;
      const sum = d1 + d2;
      return [
        { label: `First: ${d1}, Last: ${d2}`, note: 'Peeking digits' },
        { label: `Middle: ${d1} + ${d2} = ${sum}`, value: sum, note: 'Sum goes in the center' },
        { label: `Result: ${d1}${sum}${d2}`, value: a * 11, note: 'Join them together' },
      ];
    },
    distractors: ([a]) => {
      const d1 = Math.floor(a / 10);
      const d2 = a % 10;
      const ans = a * 11;
      return [
        { value: Number(`${d1}${d2}${d2}`), why: 'Repeated the last digit instead of summing.' },
        { value: a * 10, why: 'Multiplied by 10 instead of 11.' },
        { value: ans + 10, why: 'Added an extra ten to the middle.' },
      ];
    },
    prompt: ([a, b]) => `${a} × ${b}`,
    targetMs: () => 6000,
  },

  // G1-T8: Halving division (÷ 5 = × 2 ÷ 10)
  {
    id: 'G1-T8',
    level: 1,
    name: 'Division by 5 (Double & Slide)',
    skill: 'div',
    ruleOneLine: 'Dividing by 5 is doubling the number, then dividing by 10.',
    exampleStr: '85 ÷ 5 = 170 ÷ 10 = 17',
    applicable: ([a, b]) => b === 5 && a % 5 === 0,
    draw: (rng, d) => [pickInt(rng, 5, d.band === 'stretch' ? 35 : 20) * 5, 5],
    compute: ([a, b]) => a / b,
    trail: ([a]) => [
      { label: `${a} × 2 = ${a * 2}`, value: a * 2, note: 'Step 1: Double the number' },
      { label: `${a * 2} ÷ 10 = ${(a * 2) / 10}`, value: (a * 2) / 10, note: 'Step 2: Divide by 10 (slide decimal point)' },
    ],
    distractors: ([a]) => {
      const ans = a / 5;
      return [
        { value: a * 2, why: 'Doubled the number but forgot to divide by 10.' },
        { value: Math.floor(ans / 2), why: 'Divided by 10 and halved again.' },
        { value: ans + 2, why: 'Double calculation was slightly inaccurate.' },
      ];
    },
    prompt: ([a, b]) => `${a} ÷ ${b}`,
    targetMs: () => 7000,
  },

  // G1-T9: Complement subtraction (All from 9, last from 10 to 100)
  {
    id: 'G1-T9',
    level: 1,
    name: '100 Subtraction (Complement)',
    skill: 'sub',
    ruleOneLine: 'To subtract from 100: tens from 9, ones from 10. No borrowing!',
    exampleStr: '100 − 63: 9 − 6 = 3, 10 − 3 = 7 → 37',
    applicable: ([a, b]) => a === 100 && b > 10 && b < 100,
    draw: (rng, d) => [100, pickInt(rng, 13, 89)],
    compute: ([a, b]) => a - b,
    trail: ([, b]) => {
      const tens = Math.floor(b / 10);
      const ones = b % 10;
      const resTens = 9 - tens;
      const resOnes = 10 - ones;
      return [
        { label: `Tens from 9: 9 − ${tens} = ${resTens}`, value: resTens, note: 'First digit from 9' },
        { label: `Last from 10: 10 − ${ones} = ${resOnes}`, value: resOnes, note: 'Last digit from 10' },
        { label: `Result: ${resTens}${resOnes}`, value: 100 - b, note: 'No borrow needed!' },
      ];
    },
    distractors: ([, b]) => {
      const ans = 100 - b;
      return [
        { value: ans + 10, why: 'Subtracted tens from 10 instead of 9 (the borrow trap).' },
        { value: ans - 1, why: 'Took last from 9 instead of last from 10.' },
        { value: ans - 10, why: 'Subtracted an extra ten unnecessarily.' },
      ];
    },
    prompt: ([a, b]) => `${a} − ${b}`,
    targetMs: () => 7000,
  },

  // G1-T10: Percent anchors (10%, 25%, 50%)
  {
    id: 'G1-T10',
    level: 1,
    name: 'Percent Anchors',
    skill: 'pct',
    ruleOneLine: '50% is half, 25% is half of half, and 10% is dividing by 10.',
    exampleStr: '10% of 240 = 24; 25% of 80 = 20',
    applicable: ([p]) => p === 10 || p === 25 || p === 50,
    draw: (rng) => {
      const p = [10, 25, 50][pickInt(rng, 0, 2)];
      const base = p === 25 ? pickInt(rng, 4, 25) * 4 : pickInt(rng, 4, 30) * 10;
      return [p, base];
    },
    compute: ([p, base]) => (p * base) / 100,
    trail: ([p, base]) => {
      if (p === 10) return [{ label: `${base} ÷ 10 = ${base / 10}`, value: base / 10, note: '10% means divide by 10' }];
      if (p === 50) return [{ label: `${base} ÷ 2 = ${base / 2}`, value: base / 2, note: '50% is simply cutting in half' }];
      return [
        { label: `${base} ÷ 2 = ${base / 2}`, value: base / 2, note: 'Half (50%)' },
        { label: `${base / 2} ÷ 2 = ${base / 4}`, value: base / 4, note: 'Half again (25%)' },
      ];
    },
    distractors: ([p, base]) => {
      const ans = (p * base) / 100;
      return [
        { value: ans * 2, why: 'Calculated 100% instead of 50%, or 50% instead of 25%.' },
        { value: Math.floor(ans / 2), why: 'Halved one extra time.' },
        { value: ans + 10, why: 'Decimal shift misaligned by 10.' },
      ];
    },
    prompt: ([p, base]) => `${p}% of ${base}`,
    targetMs: () => 7000,
  },
];
