import { Technique, Difficulty, Distractor } from '../types';
import { pickInt } from '../rng';

export const gate3Techniques: Technique[] = [
  // G3-T1: Near-base squares (Yavadunam)
  {
    id: 'G3-T1',
    level: 3,
    name: 'Near-Base Squares',
    sutraLabel: 'Yavadunam',
    skill: 'pow',
    ruleOneLine: 'Deviation d from 100: (100 ± 2d) on left, d² on right (2 digits).',
    exampleStr: '103² = (103+3) | 3² = 10609; 97² = (97−3) | 3² = 9409',
    applicable: ([a]) => Math.abs(100 - a) <= 12,
    draw: (rng, d) => {
      const isAbove = rng() > 0.5;
      const dev = pickInt(rng, 1, d.band === 'stretch' ? 12 : 7);
      return [isAbove ? 100 + dev : 100 - dev];
    },
    compute: ([a]) => a * a,
    trail: ([a]) => {
      const dev = a - 100;
      const left = a + dev;
      const right = dev * dev;
      const rightStr = String(right).padStart(2, '0');
      return [
        { label: `Deviation from 100: ${dev >= 0 ? '+' : ''}${dev}`, note: 'Distance from base 100' },
        { label: `Left part: ${a} ${dev >= 0 ? '+' : '−'} ${Math.abs(dev)} = ${left}`, value: left, note: 'Adjust by deviation' },
        { label: `Right part: (${Math.abs(dev)})² = ${rightStr}`, value: right, note: 'Square the deviation (keep 2 digits)' },
        { label: `Combined: ${left}${rightStr}`, value: a * a, note: 'Final square' },
      ];
    },
    distractors: ([a]) => {
      const dev = a - 100;
      const left = a + dev;
      const right = dev * dev;
      return [
        { value: left * 100 + Math.abs(dev) * 2, why: 'Doubled the deviation instead of squaring it.' },
        { value: (a - dev) * 100 + right, why: 'Subtracted deviation when above base (or vice-versa).' },
        { value: right < 10 ? left * 10 + right : (left + 1) * 100 + right, why: 'Right side 2-digit alignment error.' },
      ];
    },
    prompt: ([a]) => `${a}²`,
    targetMs: () => 8000,
  },

  // G3-T2: Duplex squaring (Dwandwa Yoga) for 2-digit numbers
  {
    id: 'G3-T2',
    level: 3,
    name: 'Duplex Squaring',
    sutraLabel: 'Dwandwa Yoga',
    skill: 'pow',
    ruleOneLine: 'For ab: a² | 2ab | b²; carry leftwards.',
    exampleStr: '43²: 4² | 2(4)(3) | 3² → 16 | 24 | 9 → 1849',
    applicable: ([a]) => a >= 21 && a <= 99,
    draw: (rng, d) => [pickInt(rng, 23, d.band === 'stretch' ? 89 : 59)],
    compute: ([a]) => a * a,
    trail: ([a]) => {
      const t = Math.floor(a / 10);
      const u = a % 10;
      const l = t * t;
      const m = 2 * t * u;
      const r = u * u;
      return [
        { label: `Tens²: ${t}² = ${l}`, value: l, note: 'Duplex of first digit' },
        { label: `Cross: 2 × ${t} × ${u} = ${m}`, value: m, note: 'Duplex of both digits (2ab)' },
        { label: `Units²: ${u}² = ${r}`, value: r, note: 'Duplex of last digit' },
        { label: `Combine & Carry: ${a * a}`, value: a * a, note: 'Add carries from right to left' },
      ];
    },
    distractors: ([a]) => {
      const t = Math.floor(a / 10);
      const u = a % 10;
      return [
        { value: (t * t) * 100 + (u * u), why: 'Forgot the middle cross term 2ab completely!' },
        { value: a * a + 100, why: 'Carried 1 extra into the hundreds place.' },
        { value: a * a - 20, why: 'Cross term multiplication had a small slip.' },
      ];
    },
    prompt: ([a]) => `${a}²`,
    targetMs: () => 12000,
  },

  // G3-T3: Difference of squares (a - d)(a + d) = a² - d²
  {
    id: 'G3-T3',
    level: 3,
    name: 'Difference of Squares',
    skill: 'mul',
    ruleOneLine: 'Find the middle number: (mid − d)(mid + d) = mid² − d².',
    exampleStr: '47 × 53 = 50² − 3² = 2500 − 9 = 2491',
    applicable: ([a, b]) => (a + b) % 2 === 0 && Math.abs(a - b) <= 12,
    draw: (rng, d) => {
      const mid = pickInt(rng, 3, 8) * 10; // 30, 40, 50, 60, 70, 80
      const diff = pickInt(rng, 1, d.band === 'stretch' ? 6 : 4);
      return [mid - diff, mid + diff];
    },
    compute: ([a, b]) => a * b,
    trail: ([a, b]) => {
      const mid = (a + b) / 2;
      const d = Math.abs(a - mid);
      return [
        { label: `Center is ${mid} (deviation ${d})`, note: `Balanced around ${mid}` },
        { label: `${mid}² = ${mid * mid}`, value: mid * mid, note: 'Square the center base' },
        { label: `${d}² = ${d * d}`, value: d * d, note: 'Square the deviation' },
        { label: `${mid * mid} − ${d * d} = ${mid * mid - d * d}`, value: a * b, note: 'Subtract the difference' },
      ];
    },
    distractors: ([a, b]) => {
      const mid = (a + b) / 2;
      const d = Math.abs(a - mid);
      return [
        { value: mid * mid + d * d, why: 'Added the squared deviation instead of subtracting it!' },
        { value: mid * mid - d, why: 'Subtracted d instead of d².' },
        { value: a * b - 10, why: 'Complement subtraction slip on the final digits.' },
      ];
    },
    prompt: ([a, b]) => `${a} × ${b}`,
    targetMs: () => 9000,
  },

  // G3-T4: Working base (Anurupyena) near 50
  {
    id: 'G3-T4',
    level: 3,
    name: 'Working Base (Near 50)',
    sutraLabel: 'Anurupyena',
    skill: 'mul',
    ruleOneLine: 'Use base 50 (100 ÷ 2). Cross-adjust deficits, multiply by 50 (or halve and × 100), add deficit product.',
    exampleStr: '46 × 47: deficits 4, 3; 46 − 3 = 43; 43 × 50 = 2150; + 12 = 2162',
    applicable: ([a, b]) => Math.abs(50 - a) <= 8 && Math.abs(50 - b) <= 8,
    draw: (rng) => [50 - pickInt(rng, 1, 6), 50 - pickInt(rng, 1, 6)],
    compute: ([a, b]) => a * b,
    trail: ([a, b]) => {
      const da = 50 - a, db = 50 - b;
      const cross = a - db;
      const basePart = cross * 50;
      const prod = da * db;
      return [
        { label: `Base 50: deficits ${da} and ${db}`, note: 'Distance from 50' },
        { label: `Cross: ${a} − ${db} = ${cross}`, value: cross, note: 'Cross-adjust' },
        { label: `${cross} × 50 = ${basePart}`, value: basePart, note: 'Scale by working base' },
        { label: `${basePart} + (${da} × ${db}) = ${basePart + prod}`, value: a * b, note: 'Add product of deficits' },
      ];
    },
    distractors: ([a, b]) => {
      const ans = a * b;
      return [
        { value: ans - 50, why: 'Subtracted 1 too many from the cross-term before multiplying by 50.' },
        { value: ans + 10, why: 'Calculation slip when adding the deficit product.' },
        { value: ans - 100, why: 'Lost a hundred in the base scaling step.' },
      ];
    },
    prompt: ([a, b]) => `${a} × ${b}`,
    targetMs: () => 14000,
  },

  // G3-T5: 3x2 Vertical and crosswise
  {
    id: 'G3-T5',
    level: 3,
    name: '3×2 Vertical & Crosswise',
    sutraLabel: 'Urdhva-Tiryagbhyam',
    skill: 'mul',
    ruleOneLine: 'Pad 2-digit number with leading 0 to make 3×3, then calculate 5 columns.',
    exampleStr: '213 × 14: treat as 213 × 014 → 2982',
    applicable: ([a, b]) => a >= 100 && a <= 350 && b >= 11 && b <= 29,
    draw: (rng) => [pickInt(rng, 112, 245), pickInt(rng, 12, 23)],
    compute: ([a, b]) => a * b,
    trail: ([a, b]) => [
      { label: `Pad: ${a} × 0${b}`, note: 'Make equal 3-digit lengths' },
      { label: `Multiply column by column`, note: 'Right, 2-cross, 3-cross, 2-cross, left' },
      { label: `Sum & carry → ${a * b}`, value: a * b, note: 'Accumulate with carries' },
    ],
    distractors: ([a, b]) => {
      const correct = a * b;
      return [
        { value: correct + 100, why: 'Carried an extra 1 into the hundreds column.' },
        { value: correct - 10, why: 'Missed a tens column carry.' },
        { value: correct + 200, why: 'Added 2 in the leading cross product.' },
      ];
    },
    prompt: ([a, b]) => `${a} × ${b}`,
    targetMs: () => 16000,
  },

  // G3-T6: Division by 9 slide method
  {
    id: 'G3-T6',
    level: 3,
    name: 'Slide Division by 9',
    sutraLabel: 'Paravartya Yojayet',
    skill: 'div',
    ruleOneLine: 'Carry running digit sums to form quotient; last sum is remainder.',
    exampleStr: '123 ÷ 9: 1, (1+2)=3, remainder 1+2+3=6 → 13 R 6',
    applicable: ([a, b]) => b === 9,
    draw: (rng) => {
      // Pick numbers where sum of digits is clean
      const q = pickInt(rng, 14, 55);
      const r = pickInt(rng, 1, 7);
      return [q * 9 + r, 9];
    },
    compute: ([a]) => Math.floor(a / 9),
    trail: ([a]) => {
      const q = Math.floor(a / 9);
      const r = a % 9;
      return [
        { label: `Running sums along digits of ${a}`, note: 'Slide sums from left to right' },
        { label: `Quotient: ${q}, Remainder: ${r}`, value: q, note: 'Quotient with remainder' },
      ];
    },
    distractors: ([a]) => {
      const q = Math.floor(a / 9);
      return [
        { value: q + 1, why: 'Over-estimated quotient without checking remainder.' },
        { value: q - 1, why: 'Under-estimated quotient by 1.' },
        { value: q + 10, why: 'Misplaced decimal place.' },
      ];
    },
    prompt: ([a, b]) => `${a} ÷ ${b} (Quotient)`,
    targetMs: () => 10000,
  },

  // G3-T7: Distributive chunking (Grouping)
  {
    id: 'G3-T7',
    level: 3,
    name: 'Distributive Chunking',
    skill: 'mul',
    ruleOneLine: 'Factor out the common multiplier when terms sum to a round base.',
    exampleStr: '47 × 6 + 53 × 6 = (47 + 53) × 6 = 100 × 6 = 600',
    applicable: () => true,
    draw: (rng) => {
      const factor = pickInt(rng, 4, 9);
      const a = pickInt(rng, 23, 77);
      const b = 100 - a;
      return [a, factor, b];
    },
    compute: ([a, factor, b]) => (a + b) * factor,
    trail: ([a, factor, b]) => [
      { label: `Notice common factor ${factor}`, note: 'Both parts are multiplied by the same number' },
      { label: `(${a} + ${b}) × ${factor}`, value: 100 * factor, note: 'Combine the friends of 100' },
      { label: `100 × ${factor} = ${100 * factor}`, value: 100 * factor, note: 'Instant multiplication' },
    ],
    distractors: ([, factor]) => [
      { value: 90 * factor, why: 'Calculated sum of terms as 90 instead of 100.' },
      { value: 100 * (factor - 1), why: 'Subtracted 1 from the factor.' },
      { value: 1000 * factor, why: 'Added an extra zero.' },
    ],
    prompt: ([a, factor, b]) => `${a} × ${factor} + ${b} × ${factor}`,
    targetMs: () => 7000,
  },

  // G3-T8: Perfect-square roots
  {
    id: 'G3-T8',
    level: 3,
    name: 'Perfect Square Roots',
    skill: 'root',
    ruleOneLine: 'Last digit gives unit candidates; tens range gives the first digit. Test with 5-ending square.',
    exampleStr: '√2209: ends in 9 → 3 or 7; between 40² (1600) and 50² (2500) → 43 or 47; 45² = 2025 < 2209 → 47',
    applicable: ([a]) => Number.isInteger(Math.sqrt(a)),
    draw: (rng, d) => {
      const root = pickInt(rng, 21, d.band === 'stretch' ? 95 : 65);
      return [root * root];
    },
    compute: ([a]) => Math.round(Math.sqrt(a)),
    trail: ([a]) => {
      const root = Math.round(Math.sqrt(a));
      const tens = Math.floor(root / 10);
      const unit = root % 10;
      return [
        { label: `Last digit is ${a % 10} → Unit is ${unit} or ${10 - unit}`, note: 'Last digit rule' },
        { label: `${tens * 10}² < ${a} < ${(tens + 1) * 10}²`, note: `Tens digit is ${tens}` },
        { label: `Test with ${tens}5²: ${(tens * (tens + 1)) * 100 + 25} → Root is ${root}`, value: root, note: 'Decide candidate' },
      ];
    },
    distractors: ([a]) => {
      const root = Math.round(Math.sqrt(a));
      const tens = Math.floor(root / 10);
      const unit = root % 10;
      const otherCandidate = tens * 10 + (10 - unit);
      return [
        { value: otherCandidate, why: 'Picked the wrong companion unit candidate.' },
        { value: root + 10, why: 'Tens digit range was 10 too high.' },
        { value: root - 2, why: 'Arithmetic slip on the candidate square.' },
      ];
    },
    prompt: ([a]) => `√${a}`,
    targetMs: () => 10000,
  },

  // G3-T9: Perfect-cube roots
  {
    id: 'G3-T9',
    level: 3,
    name: 'Perfect Cube Roots',
    skill: 'root',
    ruleOneLine: 'Last digit uniquely gives unit digit; number before thousands gives tens digit.',
    exampleStr: '∛29791: ends in 1 → unit is 1; 29 is between 3³ (27) and 4³ (64) → tens is 3 → 31',
    applicable: ([a]) => Number.isInteger(Math.round(Math.cbrt(a))),
    draw: (rng, d) => {
      const root = pickInt(rng, 12, d.band === 'stretch' ? 75 : 45);
      return [root * root * root];
    },
    compute: ([a]) => Math.round(Math.cbrt(a)),
    trail: ([a]) => {
      const root = Math.round(Math.cbrt(a));
      const tens = Math.floor(root / 10);
      const unit = root % 10;
      return [
        { label: `Ending ${a % 10} maps uniquely to unit digit ${unit}`, note: 'Cube endings are 1-to-1' },
        { label: `Leading thousands part gives tens digit ${tens}`, note: 'Check range of cubes' },
        { label: `Root = ${root}`, value: root, note: 'Exact integer cube root' },
      ];
    },
    distractors: ([a]) => {
      const root = Math.round(Math.cbrt(a));
      return [
        { value: root + 10, why: 'Tens digit range was off by 1.' },
        { value: root - 10, why: 'Tens digit underestimated by 1.' },
        { value: (Math.floor(root / 10) * 10) + ((root % 10 + 3) % 10), why: 'Unit digit lookup mapping slip.' },
      ];
    },
    prompt: ([a]) => `∛${a}`,
    targetMs: () => 10000,
  },

  // G3-T10: Digit-sum check (Navashesh)
  {
    id: 'G3-T10',
    level: 3,
    name: 'Digit-Sum Check (Navashesh)',
    sutraLabel: 'Navashesh',
    skill: 'check',
    ruleOneLine: 'Cast out 9s: sum digits until single digit. Digit sum of product must match product of digit sums.',
    exampleStr: '213 × 14 = 2982: (2+1+3=6) × (1+4=5) = 30 → 3; 2+9+8+2 = 21 → 3. Valid!',
    applicable: () => true,
    draw: (rng) => {
      const a = pickInt(rng, 112, 345);
      const b = pickInt(rng, 12, 35);
      return [a, b];
    },
    compute: ([a, b]) => {
      const digitSum = (n: number): number => {
        let sum = n;
        while (sum > 9) {
          sum = String(sum).split('').reduce((acc, c) => acc + parseInt(c, 10), 0);
        }
        return sum;
      };
      return digitSum(digitSum(a) * digitSum(b));
    },
    trail: ([a, b]) => {
      const digitSum = (n: number): number => {
        let sum = n;
        while (sum > 9) sum = String(sum).split('').reduce((acc, c) => acc + parseInt(c, 10), 0);
        return sum;
      };
      const da = digitSum(a), db = digitSum(b);
      const target = digitSum(da * db);
      return [
        { label: `Digit sum of ${a} = ${da}`, note: 'Sum digits (cast out 9s)' },
        { label: `Digit sum of ${b} = ${db}`, note: 'Sum digits' },
        { label: `${da} × ${db} = ${da * db} → Digit sum is ${target}`, value: target, note: 'Expected final digit sum' },
      ];
    },
    distractors: (operands) => {
      const digitSum = (n: number): number => {
        let sum = n;
        while (sum > 9) sum = String(sum).split('').reduce((acc, c) => acc + parseInt(c, 10), 0);
        return sum;
      };
      const correct = digitSum(digitSum(operands[0]) * digitSum(operands[1]));
      return [
        { value: (correct % 9) + 1, why: 'Added 1 too many during digit accumulation.' },
        { value: correct === 1 ? 8 : correct - 1, why: 'Digit sum reduced incorrectly.' },
        { value: 9, why: 'Assumed casting out nines always ends in 9.' },
      ];
    },
    prompt: ([a, b]) => `Digit Sum of (${a} × ${b})`,
    targetMs: () => 8000,
  },

  // G3-T11: Percent chains & fraction bridge
  {
    id: 'G3-T11',
    level: 3,
    name: 'Percent Chains',
    skill: 'pct',
    ruleOneLine: 'Deconstruct complex percentages into sums of friendly anchors: 18% = 10% + 5% + 3×1%.',
    exampleStr: '18% of 250: 10% = 25, 5% = 12.5, 3% = 7.5 → 25 + 12.5 + 7.5 = 45',
    applicable: () => true,
    draw: (rng) => {
      const p = [18, 35, 45, 65][pickInt(rng, 0, 3)];
      const base = pickInt(rng, 4, 20) * 50; // multiple of 50
      return [p, base];
    },
    compute: ([p, base]) => Math.round((p * base) / 100),
    trail: ([p, base]) => [
      { label: `10% of ${base} = ${base / 10}`, note: 'Anchor 10%' },
      { label: `Deconstruct ${p}% into convenient anchors`, note: 'Combine building blocks' },
      { label: `Result = ${Math.round((p * base) / 100)}`, value: Math.round((p * base) / 100), note: 'Sum of components' },
    ],
    distractors: ([p, base]) => {
      const correct = Math.round((p * base) / 100);
      return [
        { value: correct + 10, why: 'Added an extra 10% block.' },
        { value: correct - (base / 10), why: 'Missed one of the 10% chunks.' },
        { value: Math.round(((p + 5) * base) / 100), why: 'Miscalculated the 5% block addition.' },
      ];
    },
    prompt: ([p, base]) => `${p}% of ${base}`,
    targetMs: () => 10000,
  },

  // G3-T12: Estimate with tolerance
  {
    id: 'G3-T12',
    level: 3,
    name: 'Estimate with Tolerance',
    skill: 'check',
    ruleOneLine: 'Round both operands to the nearest ten or hundred to find the sensible target range.',
    exampleStr: '487 × 19 ≈ 500 × 20 = 10,000 (Exact: 9253)',
    applicable: () => true,
    draw: (rng) => [pickInt(rng, 185, 895), pickInt(rng, 18, 59)],
    compute: ([a, b]) => {
      const roundA = Math.round(a / 10) * 10;
      const roundB = Math.round(b / 10) * 10;
      return roundA * roundB;
    },
    trail: ([a, b]) => {
      const roundA = Math.round(a / 10) * 10;
      const roundB = Math.round(b / 10) * 10;
      return [
        { label: `Round ${a} ≈ ${roundA}`, note: 'Round to nearest 10' },
        { label: `Round ${b} ≈ ${roundB}`, note: 'Round to nearest 10' },
        { label: `${roundA} × ${roundB} = ${roundA * roundB}`, value: roundA * roundB, note: 'Estimate anchor' },
      ];
    },
    distractors: ([a, b]) => {
      const roundA = Math.round(a / 10) * 10;
      const roundB = Math.round(b / 10) * 10;
      const est = roundA * roundB;
      return [
        { value: est / 10, why: 'Estimated product had one too few zeros.' },
        { value: est * 10, why: 'Estimated product had one too many zeros.' },
        { value: est + 1000, why: 'Rounded in the wrong direction.' },
      ];
    },
    prompt: ([a, b]) => `Quick Estimate of ${a} × ${b}`,
    targetMs: () => 6000,
  },
];
