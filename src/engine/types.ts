export type GateId = 1 | 2 | 3;
export type Phase = 'wonder' | 'story' | 'simulate' | 'practice';
export type Skill = 'add' | 'sub' | 'mul' | 'div' | 'pow' | 'root' | 'pct' | 'check';

export type Rng = () => number; // returns [0, 1)

export interface Difficulty {
  level: GateId;
  band: 'warmup' | 'core' | 'stretch';
}

export interface TrailStep {
  label: string;       // e.g. "47 + 40"
  value?: number;      // running value after this step
  note?: string;       // e.g. "round 39 up to 40"
}

export type AnswerSpec =
  | { kind: 'int'; value: number }
  | { kind: 'decimal'; value: number; tolerance?: number }
  | { kind: 'quotRem'; quotient: number; remainder: number }
  | { kind: 'order'; sequence: string[] }
  | { kind: 'grid'; cells: Record<string, number> }
  | { kind: 'choice'; correct: string };

export interface Distractor {
  value: number;
  why: string; // The misconception description
}

export interface ProblemOption {
  id: string;
  text: string;
  misconception?: string;
}

export interface Problem {
  id: string;
  techniqueId: string;
  level: GateId;
  prompt: string;
  subPrompt?: string;
  operands: number[];
  answer: AnswerSpec;
  options?: ProblemOption[];
  trail: TrailStep[];
  explanation: string;
  misconceptions: Record<string, string>;
  targetMs: number;
  tags: string[];
}

export interface Technique {
  id: string;
  level: GateId;
  name: string;
  sutraLabel?: string;
  skill: Skill;
  ruleOneLine: string;
  exampleStr: string;
  applicable(operands: number[]): boolean;
  draw(rng: Rng, d: Difficulty): number[];
  compute(operands: number[]): number;
  trail(operands: number[]): TrailStep[];
  distractors(operands: number[], rng: Rng): Distractor[];
  prompt(operands: number[]): string;
  targetMs(d: Difficulty): number;
}
