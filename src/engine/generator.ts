import { Problem, Technique, Difficulty, ProblemOption, GateId } from './types';
import { Rng, shuffle } from './rng';
import { gate1Techniques } from './techniques/gate1';
import { gate2Techniques } from './techniques/gate2';
import { gate3Techniques } from './techniques/gate3';

export const allTechniques: Technique[] = [
  ...gate1Techniques,
  ...gate2Techniques,
  ...gate3Techniques,
];

export const techniqueMap: Record<string, Technique> = Object.fromEntries(
  allTechniques.map(t => [t.id, t])
);

export function getTechnique(id: string): Technique | undefined {
  return techniqueMap[id];
}

/**
 * Generates a single verifiable Problem instance.
 */
export function generateProblem(
  technique: Technique,
  difficulty: Difficulty,
  rng: Rng
): Problem {
  let operands: number[] = [];
  let attempts = 0;

  do {
    operands = technique.draw(rng, difficulty);
    attempts++;
  } while (!technique.applicable(operands) && attempts < 50);

  const answerVal = technique.compute(operands);
  const trail = technique.trail(operands);
  const distractorsList = technique.distractors(operands, rng);

  // Filter unique distractors that are not equal to the true answer and not negative
  const validDistractors: { value: number; why: string }[] = [];
  const seenValues = new Set<number>([answerVal]);

  for (const d of distractorsList) {
    if (!seenValues.has(d.value) && d.value > 0) {
      seenValues.add(d.value);
      validDistractors.push(d);
    }
  }

  // If fewer than 3 distractors, generate deterministic close slips
  const offsets = [1, -1, 10, -10, 2, -2];
  let offsetIdx = 0;
  while (validDistractors.length < 3 && offsetIdx < offsets.length) {
    const candidate = answerVal + offsets[offsetIdx];
    if (candidate > 0 && !seenValues.has(candidate)) {
      seenValues.add(candidate);
      validDistractors.push({
        value: candidate,
        why: 'Small arithmetic calculation slip.',
      });
    }
    offsetIdx++;
  }

  // Build options
  const correctOption: ProblemOption = {
    id: `opt-${answerVal}`,
    text: String(answerVal),
  };

  const distractorOptions: ProblemOption[] = validDistractors.slice(0, 3).map(d => ({
    id: `opt-${d.value}`,
    text: String(d.value),
    misconception: d.why,
  }));

  const allOptions = shuffle(rng, [correctOption, ...distractorOptions]);

  const misconceptions: Record<string, string> = {};
  for (const d of validDistractors) {
    misconceptions[String(d.value)] = d.why;
    misconceptions[`opt-${d.value}`] = d.why;
  }

  const id = `${technique.id}-${operands.join('x')}-${difficulty.band}`;

  return {
    id,
    techniqueId: technique.id,
    level: technique.level,
    prompt: technique.prompt(operands),
    operands,
    answer: { kind: 'int', value: answerVal },
    options: allOptions,
    trail,
    explanation: technique.ruleOneLine,
    misconceptions,
    targetMs: technique.targetMs(difficulty),
    tags: [technique.skill, `gate-${technique.level}`],
  };
}

/**
 * World techniques mapping for each Gate:
 * Gate 1: 5 Worlds
 * Gate 2: 5 Worlds
 * Gate 3: 5 Worlds
 */
export const worldTechniqueMapping: Record<GateId, string[][]> = {
  1: [
    ['G1-T1', 'G1-T2'],          // W1: Make-Ten Market
    ['G1-T3', 'G1-T4'],          // W2: Jump Lane
    ['G1-T5', 'G1-T8'],          // W3: Double & Halve Stall
    ['G1-T6', 'G1-T7', 'G1-T9'], // W4: Nine & Eleven Alley
    ['G1-T1', 'G1-T2', 'G1-T4', 'G1-T5', 'G1-T7', 'G1-T10'], // W5: Guardian 1 (Mixed Boss Duel)
  ],
  2: [
    ['G2-T1', 'G2-T2'],          // W1: Five-Square Fort
    ['G2-T3', 'G2-T4'],          // W2: Base Bridge
    ['G2-T5'],                   // W3: Cross Canal
    ['G2-T6', 'G2-T7', 'G2-T8', 'G2-T9', 'G2-T10'], // W4: Shortcut & Percent Fair
    ['G2-T1', 'G2-T3', 'G2-T5', 'G2-T6', 'G2-T7', 'G2-T10'], // W5: Guardian 2 (Mixed Boss Duel)
  ],
  3: [
    ['G3-T1', 'G3-T2'],          // W1: Duplex Dojo
    ['G3-T5', 'G2-T5'],          // W2: Tower Crossing
    ['G3-T3', 'G3-T4', 'G3-T7'], // W3: Balance Gate
    ['G3-T6', 'G3-T8', 'G3-T9'], // W4: Division Den
    ['G3-T1', 'G3-T3', 'G3-T8', 'G3-T10', 'G3-T11', 'G3-T12'], // W5: Guardian 3 (Grand Tournament)
  ],
};

/**
 * Generates a full 10-question set for a world:
 * 3 warmup, 5 core, 2 stretch
 */
export function generateWorldQuestions(
  gate: GateId,
  worldIndex: number,
  rng: Rng
): Problem[] {
  const techIds = worldTechniqueMapping[gate]?.[worldIndex] || ['G1-T1'];
  const bands: ('warmup' | 'core' | 'stretch')[] = [
    'warmup', 'warmup', 'warmup',
    'core', 'core', 'core', 'core', 'core',
    'stretch', 'stretch',
  ];

  const problems: Problem[] = [];
  const seenIds = new Set<string>();

  for (let i = 0; i < 10; i++) {
    const band = bands[i];
    const techId = techIds[i % techIds.length];
    const technique = getTechnique(techId) || gate1Techniques[0];

    let p: Problem;
    let retries = 0;
    do {
      p = generateProblem(technique, { level: gate, band }, rng);
      retries++;
    } while (seenIds.has(p.id) && retries < 15);

    seenIds.add(p.id);
    problems.push(p);
  }

  return problems;
}
