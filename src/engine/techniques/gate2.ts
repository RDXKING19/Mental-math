import { Technique, Difficulty, Distractor } from '../types';
import { pickInt } from '../rng';

export const gate2Techniques: Technique[] = [
  // G2-T1: Squares ending in 5 (Ekadhikena Purvena)
  {
    id: 'G2-T1',
    level: 2,
    name: 'Squares Ending in 5',
    sutraLabel: 'Ekadhikena Purvena',
    skill: 'pow',
    ruleOneLine: 'Multiply the tens digit by (tens + 1), then attach 25 at the end.',
    exampleStr: '65²: 6 × 7 = 42 → 4225',
    applicable: ([a]) => a % 10 === 5,
    draw: (rng, d) => {
      const maxTens = d.band === 'stretch' ? 9 : d.band === 'core' ? 7 : 4;
      const minTens = d.band === 'warmup' ? 1 : 2;
      return [pickInt(rng, minTens, maxTens) * 10 + 5];
    },
    compute: ([a]) => a * a,
    trail: ([a]) => {
      const n = Math.floor(a / 10);
      const left = n * (n + 1);
      return [
        { label: `Tens part: ${n}`, note: 'Identify the part before 5' },
        { label: `${n} × (${n} + 1) = ${n} × ${n + 1} = ${left}`, value: left, note: 'One more than the previous' },
        { label: `Attach 25: ${left}25`, value: left * 100 + 25, note: '5² is always 25 on the right' },
      ];
    },
    distractors: ([a]) => {
      const n = Math.floor(a / 10);
      const left = n * (n + 1);
      const correct = a * a;
      return [
        { value: n * n * 100 + 25, why: 'Squared n instead of multiplying n × (n + 1).' },
        { value: left * 10 + 25, why: 'Misplaced the place value for 25.' },
        { value: correct + 100, why: 'Added 1 too much to the left product.' },
      ];
    },
    prompt: ([a]) => `${a}²`,
    targetMs: () => 7000,
  },

  // G2-T2: Multiply by 11 with carry
  {
    id: 'G2-T2',
    level: 2,
    name: 'Multiply by 11 (With Carry)',
    skill: 'mul',
    ruleOneLine: 'First digit, sum of digits in middle, last digit. Carry 1 to the left if sum ≥ 10.',
    exampleStr: '57 × 11: 5 · (5+7=12) · 7 → (5+1) · 2 · 7 = 627',
    applicable: ([a, b]) => b === 11 && Math.floor(a / 10) + (a % 10) >= 10,
    draw: (rng) => {
      const d1 = pickInt(rng, 4, 9);
      const d2 = pickInt(rng, 10 - d1, 9);
      return [d1 * 10 + d2, 11];
    },
    compute: ([a, b]) => a * b,
    trail: ([a]) => {
      const d1 = Math.floor(a / 10);
      const d2 = a % 10;
      const sum = d1 + d2;
      const left = d1 + Math.floor(sum / 10);
      const mid = sum % 10;
      return [
        { label: `Digits: ${d1} and ${d2}`, note: 'Outer digits' },
        { label: `Middle sum: ${d1} + ${d2} = ${sum}`, value: sum, note: 'Sum exceeds 9, carry 1 to the left' },
        { label: `Carried: (${d1} + 1) | ${mid} | ${d2} = ${left}${mid}${d2}`, value: a * 11, note: 'Final answer' },
      ];
    },
    distractors: ([a]) => {
      const d1 = Math.floor(a / 10);
      const d2 = a % 10;
      const sum = d1 + d2;
      return [
        { value: Number(`${d1}${sum}${d2}`), why: 'Forgot to carry the 1 into the hundreds digit!' },
        { value: a * 11 - 10, why: 'Dropped the middle digit by 1.' },
        { value: (d1 + 1) * 100 + d2, why: 'Dropped the middle remainder digit.' },
      ];
    },
    prompt: ([a, b]) => `${a} × ${b}`,
    targetMs: () => 8000,
  },

  // G2-T3: Near-100 multiplication (Nikhilam below 100)
  {
    id: 'G2-T3',
    level: 2,
    name: 'Near 100 (Nikhilam Below)',
    sutraLabel: 'Nikhilam Navatashcaramam Dashatah',
    skill: 'mul',
    ruleOneLine: 'Cross-subtract the deficits from 100; multiply the deficits for the right part (2 digits).',
    exampleStr: '97 × 94: deficits 3 and 6; 97 − 6 = 91; 3 × 6 = 18 → 9118',
    applicable: ([a, b]) => a < 100 && b < 100 && 100 - a <= 15 && 100 - b <= 15,
    draw: (rng, d) => {
      const maxDef = d.band === 'warmup' ? 6 : 14;
      return [100 - pickInt(rng, 1, maxDef), 100 - pickInt(rng, 2, maxDef)];
    },
    compute: ([a, b]) => a * b,
    trail: ([a, b]) => {
      const da = 100 - a;
      const db = 100 - b;
      const left = a - db;
      const right = da * db;
      return [
        { label: `Deficits: 100 − ${a} = ${da}, 100 − ${b} = ${db}`, note: 'Gaps below 100' },
        { label: `Left part: ${a} − ${db} = ${left}`, value: left, note: 'Cross-subtract deficit' },
        { label: `Right part: ${da} × ${db} = ${String(right).padStart(2, '0')}`, value: right, note: 'Multiply the deficits (keep 2 digits)' },
        { label: `Result: ${left}${String(right).padStart(2, '0')}`, value: a * b, note: 'Combine parts' },
      ];
    },
    distractors: ([a, b]) => {
      const da = 100 - a;
      const db = 100 - b;
      const left = a - db;
      const right = da * db;
      const out: Distractor[] = [
        { value: (a + db) * 100 + right, why: 'Added the deficit instead of cross-subtracting!' },
        { value: left * 100 + (da + db), why: 'Added the deficits instead of multiplying them.' },
      ];
      if (right < 10) {
        out.push({ value: left * 10 + right, why: 'Forgot leading zero on single-digit right side (e.g. 6 becomes 06).' });
      } else {
        out.push({ value: (left - 1) * 100 + right, why: 'Subtracted an extra 1 from the left part.' });
      }
      return out;
    },
    prompt: ([a, b]) => `${a} × ${b}`,
    targetMs: () => 9000,
  },

  // G2-T4: Above-base Nikhilam
  {
    id: 'G2-T4',
    level: 2,
    name: 'Near 100 (Nikhilam Above)',
    sutraLabel: 'Nikhilam',
    skill: 'mul',
    ruleOneLine: 'Cross-add the surpluses above 100; multiply surpluses for the right part (2 digits).',
    exampleStr: '104 × 103: surpluses 4 and 3; 104 + 3 = 107; 4 × 3 = 12 → 10712',
    applicable: ([a, b]) => a > 100 && b > 100 && a - 100 <= 15 && b - 100 <= 15,
    draw: (rng, d) => {
      const maxSur = d.band === 'warmup' ? 6 : 12;
      return [100 + pickInt(rng, 1, maxSur), 100 + pickInt(rng, 2, maxSur)];
    },
    compute: ([a, b]) => a * b,
    trail: ([a, b]) => {
      const sa = a - 100;
      const sb = b - 100;
      const left = a + sb;
      const right = sa * sb;
      return [
        { label: `Surpluses: +${sa} and +${sb}`, note: 'Surpluses above 100' },
        { label: `Left part: ${a} + ${sb} = ${left}`, value: left, note: 'Cross-add surplus' },
        { label: `Right part: ${sa} × ${sb} = ${String(right).padStart(2, '0')}`, value: right, note: 'Multiply surpluses (keep 2 digits)' },
        { label: `Result: ${left}${String(right).padStart(2, '0')}`, value: a * b, note: 'Combine parts' },
      ];
    },
    distractors: ([a, b]) => {
      const sa = a - 100;
      const sb = b - 100;
      const left = a + sb;
      const right = sa * sb;
      const out: Distractor[] = [
        { value: (a - sb) * 100 + right, why: 'Subtracted the surplus instead of adding it!' },
        { value: left * 100 + (sa + sb), why: 'Added the surpluses instead of multiplying them.' },
      ];
      if (right < 10) {
        out.push({ value: left * 10 + right, why: 'Forgot leading zero on the single-digit right side.' });
      } else {
        out.push({ value: (left + 1) * 100 + right, why: 'Carried an unnecessary 1 to the left.' });
      }
      return out;
    },
    prompt: ([a, b]) => `${a} × ${b}`,
    targetMs: () => 9000,
  },

  // G2-T5: Vertical and crosswise 2x2
  {
    id: 'G2-T5',
    level: 2,
    name: 'Vertical & Crosswise 2×2',
    sutraLabel: 'Urdhva-Tiryagbhyam',
    skill: 'mul',
    ruleOneLine: 'Right column down, criss-cross sum in middle, left column down; carry leftwards.',
    exampleStr: '23 × 14: (2×1) | (2×4 + 3×1 = 11) | (3×4 = 12) → 322',
    applicable: ([a, b]) => a >= 12 && a <= 99 && b >= 12 && b <= 99,
    draw: (rng, d) => {
      if (d.band === 'warmup') {
        return [pickInt(rng, 12, 32), pickInt(rng, 12, 23)];
      }
      return [pickInt(rng, 23, 65), pickInt(rng, 14, 45)];
    },
    compute: ([a, b]) => a * b,
    trail: ([a, b]) => {
      const a1 = Math.floor(a / 10), a0 = a % 10;
      const b1 = Math.floor(b / 10), b0 = b % 10;
      const right = a0 * b0;
      const cross = a1 * b0 + a0 * b1;
      const left = a1 * b1;
      return [
        { label: `Right: ${a0} × ${b0} = ${right}`, value: right, note: 'Vertical right' },
        { label: `Cross: (${a1}×${b0}) + (${a0}×${b1}) = ${cross}`, value: cross, note: 'Criss-cross sum' },
        { label: `Left: ${a1} × ${b1} = ${left}`, value: left, note: 'Vertical left' },
        { label: `Regroup & carry → ${a * b}`, value: a * b, note: 'Combine with carries' },
      ];
    },
    distractors: ([a, b]) => {
      const correct = a * b;
      return [
        { value: correct + 10, why: 'Added an extra 1 to the cross sum carry.' },
        { value: correct - 10, why: 'Missed a carry from the right product to the middle.' },
        { value: correct + 100, why: 'Carried an extra hundred to the left.' },
      ];
    },
    prompt: ([a, b]) => `${a} × ${b}`,
    targetMs: () => 14000,
  },

  // G2-T6: By one less (Ekanyunena Purvena) × 99
  {
    id: 'G2-T6',
    level: 2,
    name: 'Multiply by 99',
    sutraLabel: 'Ekanyunena Purvena',
    skill: 'mul',
    ruleOneLine: 'Multiplying by 99 is multiplying by 100, then subtracting the number.',
    exampleStr: '47 × 99 = 4700 − 47 = 4653',
    applicable: ([a, b]) => b === 99,
    draw: (rng, d) => [pickInt(rng, 15, d.band === 'stretch' ? 88 : 55), 99],
    compute: ([a, b]) => a * b,
    trail: ([a]) => [
      { label: `${a} × 100 = ${a * 100}`, value: a * 100, note: 'Step 1: Multiply by 100' },
      { label: `${a * 100} − ${a} = ${a * 99}`, value: a * 99, note: `Step 2: Subtract ${a}` },
    ],
    distractors: ([a]) => {
      const ans = a * 99;
      return [
        { value: a * 100 - 99, why: 'Subtracted 99 instead of subtracting the number itself!' },
        { value: ans + 10, why: 'Complement subtraction slipped by 10 in the tens place.' },
        { value: a * 100, why: 'Forgot to subtract the number.' },
      ];
    },
    prompt: ([a, b]) => `${a} × ${b}`,
    targetMs: () => 9000,
  },

  // G2-T7: × 25 and × 125
  {
    id: 'G2-T7',
    level: 2,
    name: 'Multiplication by 25 & 125',
    skill: 'mul',
    ruleOneLine: '× 25 is ÷ 4 × 100; × 125 is ÷ 8 × 1000.',
    exampleStr: '36 × 25 = (36 ÷ 4) × 100 = 900',
    applicable: ([a, b]) => (b === 25 && a % 4 === 0) || (b === 125 && a % 8 === 0),
    draw: (rng, d) => {
      if (d.band === 'stretch') {
        const mult = pickInt(rng, 2, 9) * 8;
        return [mult, 125];
      }
      const mult = pickInt(rng, 3, 18) * 4;
      return [mult, 25];
    },
    compute: ([a, b]) => a * b,
    trail: ([a, b]) => {
      if (b === 25) {
        return [
          { label: `${a} ÷ 4 = ${a / 4}`, value: a / 4, note: 'Divide by 4' },
          { label: `${a / 4} × 100 = ${(a / 4) * 100}`, value: (a / 4) * 100, note: 'Multiply by 100' },
        ];
      }
      return [
        { label: `${a} ÷ 8 = ${a / 8}`, value: a / 8, note: 'Divide by 8' },
        { label: `${a / 8} × 1000 = ${(a / 8) * 1000}`, value: (a / 8) * 1000, note: 'Multiply by 1000' },
      ];
    },
    distractors: ([a, b]) => {
      const ans = a * b;
      return [
        { value: b === 25 ? (a / 2) * 100 : (a / 4) * 1000, why: 'Halved once instead of dividing by 4 or 8.' },
        { value: ans / 10, why: 'Added one fewer zero to the final product.' },
        { value: ans + 100, why: 'Division quotient was off by 1.' },
      ];
    },
    prompt: ([a, b]) => `${a} × ${b}`,
    targetMs: () => 8000,
  },

  // G2-T8: All from 9 subtraction (1000 or 10000)
  {
    id: 'G2-T8',
    level: 2,
    name: 'All from 9, Last from 10',
    sutraLabel: 'Nikhilam',
    skill: 'sub',
    ruleOneLine: 'Subtract every digit from 9, and the last nonzero digit from 10.',
    exampleStr: '1000 − 467: 9−4=5, 9−6=3, 10−7=3 → 533',
    applicable: ([a, b]) => (a === 1000 || a === 10000) && b < a,
    draw: (rng, d) => {
      const a = d.band === 'stretch' ? 10000 : 1000;
      const b = a === 1000 ? pickInt(rng, 125, 875) : pickInt(rng, 1250, 8750);
      return [a, b];
    },
    compute: ([a, b]) => a - b,
    trail: ([a, b]) => {
      const bStr = String(b);
      const steps = [];
      for (let i = 0; i < bStr.length; i++) {
        const d = parseInt(bStr[i], 10);
        const isLast = i === bStr.length - 1;
        const subFrom = isLast ? 10 : 9;
        steps.push({
          label: `${subFrom} − ${d} = ${subFrom - d}`,
          note: isLast ? 'Last digit from 10' : `Digit ${i + 1} from 9`,
        });
      }
      steps.push({ label: `Result: ${a - b}`, value: a - b, note: 'Complete without borrowing' });
      return steps;
    },
    distractors: ([a, b]) => {
      const ans = a - b;
      return [
        { value: ans + 10, why: 'Subtracted a middle digit from 10 instead of 9.' },
        { value: ans - 1, why: 'Subtracted the last digit from 9 instead of 10.' },
        { value: ans + 100, why: 'Carried an extra hundred into the result.' },
      ];
    },
    prompt: ([a, b]) => `${a} − ${b}`,
    targetMs: () => 8000,
  },

  // G2-T9: Division by 25 / 50
  {
    id: 'G2-T9',
    level: 2,
    name: 'Division by 25 & 50',
    skill: 'div',
    ruleOneLine: '÷ 25 is × 4 ÷ 100; ÷ 50 is × 2 ÷ 100.',
    exampleStr: '350 ÷ 25 = (350 × 4) ÷ 100 = 1400 ÷ 100 = 14',
    applicable: ([a, b]) => (b === 25 || b === 50) && a % b === 0,
    draw: (rng) => {
      const b = [25, 50][pickInt(rng, 0, 1)];
      const mult = pickInt(rng, 6, 28);
      return [mult * b, b];
    },
    compute: ([a, b]) => a / b,
    trail: ([a, b]) => {
      const factor = b === 25 ? 4 : 2;
      return [
        { label: `${a} × ${factor} = ${a * factor}`, value: a * factor, note: `Multiply by ${factor}` },
        { label: `${a * factor} ÷ 100 = ${(a * factor) / 100}`, value: (a * factor) / 100, note: 'Slide 2 decimal places' },
      ];
    },
    distractors: ([a, b]) => {
      const ans = a / b;
      return [
        { value: ans * 10, why: 'Divided by 10 instead of 100 after multiplying.' },
        { value: ans * 2, why: 'Multiplied by 8 instead of 4.' },
        { value: Math.max(1, ans - 2), why: 'Multiplication step was slightly off.' },
      ];
    },
    prompt: ([a, b]) => `${a} ÷ ${b}`,
    targetMs: () => 8000,
  },

  // G2-T10: Percent building blocks (15% = 10% + 5%, 12.5% = 1/8)
  {
    id: 'G2-T10',
    level: 2,
    name: 'Percent Building Blocks (15%, 12.5%)',
    skill: 'pct',
    ruleOneLine: '15% is 10% plus half of that (5%). 12.5% is 1/8 (halve three times).',
    exampleStr: '15% of 80 = 8 + 4 = 12; 12.5% of 64 = 8',
    applicable: ([p]) => p === 15 || p === 12.5,
    draw: (rng) => {
      const isFifteen = rng() > 0.4;
      if (isFifteen) {
        return [15, pickInt(rng, 4, 30) * 20];
      }
      return [12.5, pickInt(rng, 3, 15) * 8];
    },
    compute: ([p, base]) => (p * base) / 100,
    trail: ([p, base]) => {
      if (p === 15) {
        const tenPct = base / 10;
        const fivePct = tenPct / 2;
        return [
          { label: `10% of ${base} = ${tenPct}`, value: tenPct, note: 'Find 10% first' },
          { label: `5% of ${base} = ${fivePct}`, value: fivePct, note: '5% is half of 10%' },
          { label: `${tenPct} + ${fivePct} = ${tenPct + fivePct}`, value: tenPct + fivePct, note: 'Add them together' },
        ];
      }
      return [
        { label: `12.5% = 1/8`, note: 'Remember the 1/8 fraction anchor' },
        { label: `${base} ÷ 8 = ${base / 8}`, value: base / 8, note: 'Halve three times' },
      ];
    },
    distractors: ([p, base]) => {
      const ans = (p * base) / 100;
      return [
        { value: (10 * base) / 100, why: 'Found 10% but forgot to add the 5%.' },
        { value: ans * 2, why: 'Calculated 25% or 30% instead.' },
        { value: Math.max(1, ans - 4), why: 'Calculation slip when halving.' },
      ];
    },
    prompt: ([p, base]) => `${p}% of ${base}`,
    targetMs: () => 8000,
  },
];
