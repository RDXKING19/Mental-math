import { AnswerSpec, Problem } from './types';

export interface CheckResult {
  correct: boolean;
  closeMiss?: boolean;
  matchedMisconception?: string;
  expectedValue?: string;
}

export function checkAnswer(
  userAnswer: string | number | string[] | Record<string, number>,
  problem: Problem
): CheckResult {
  const spec = problem.answer;

  switch (spec.kind) {
    case 'int': {
      const parsed = typeof userAnswer === 'number' ? userAnswer : parseInt(String(userAnswer).trim().replace(/,/g, ''), 10);
      if (isNaN(parsed)) {
        return { correct: false, expectedValue: String(spec.value) };
      }

      if (parsed === spec.value) {
        return { correct: true };
      }

      // Check if it matched a known misconception distractor
      const distractorMatch = problem.misconceptions[String(parsed)];
      const closeMiss = Math.abs(parsed - spec.value) <= 2;

      return {
        correct: false,
        closeMiss,
        matchedMisconception: distractorMatch || (closeMiss ? 'So close! You were off by just a small margin.' : undefined),
        expectedValue: String(spec.value),
      };
    }

    case 'decimal': {
      const parsed = typeof userAnswer === 'number' ? userAnswer : parseFloat(String(userAnswer).trim());
      if (isNaN(parsed)) return { correct: false, expectedValue: String(spec.value) };

      const tolerance = spec.tolerance ?? 0.05;
      const correct = Math.abs(parsed - spec.value) <= tolerance;
      return {
        correct,
        expectedValue: String(spec.value),
      };
    }

    case 'choice': {
      const choiceId = String(userAnswer).trim();
      const isCorrect = choiceId === spec.correct;
      const matchedMisconception = !isCorrect ? problem.misconceptions[choiceId] : undefined;
      return {
        correct: isCorrect,
        matchedMisconception,
        expectedValue: spec.correct,
      };
    }

    case 'order': {
      if (!Array.isArray(userAnswer)) return { correct: false };
      const isCorrect =
        userAnswer.length === spec.sequence.length &&
        userAnswer.every((val, i) => val === spec.sequence[i]);
      return { correct: isCorrect };
    }

    case 'grid': {
      if (typeof userAnswer !== 'object' || userAnswer === null) return { correct: false };
      const userGrid = userAnswer as Record<string, number>;
      const keys = Object.keys(spec.cells);
      const isCorrect = keys.every(k => userGrid[k] === spec.cells[k]);
      return { correct: isCorrect };
    }

    default:
      return { correct: false };
  }
}
