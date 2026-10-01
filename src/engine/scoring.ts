export interface AttemptResult {
  correct: boolean;
  ms: number;
  hintUsed: boolean;
  retried: boolean;
}

/**
 * Calculates XP earned for an attempt based on accuracy, speed, hints, and streak.
 */
export function calculateXp(
  result: AttemptResult,
  calmMode: boolean,
  targetMs: number,
  streak: number
): number {
  if (!result.correct) return 0;

  let xp = result.retried ? 5 : 10;

  // Speed bonus only in non-calm mode when under target time without retry
  if (!calmMode && result.ms <= targetMs && !result.retried) {
    xp += 5;
  }

  // Hint deduction
  if (result.hintUsed) {
    xp = Math.max(1, xp - 3);
  }

  // Streak multiplier: 1.5x from a streak of 5
  if (streak >= 5) {
    xp = Math.round(xp * 1.5);
  }

  return Math.max(1, xp);
}

/**
 * Determines star rating from correct answers out of 10.
 * 3★ ≥ 8, 2★ ≥ 6, 1★ ≥ 4
 */
export function calculateStars(correctCount: number): 0 | 1 | 2 | 3 {
  if (correctCount >= 8) return 3;
  if (correctCount >= 6) return 2;
  if (correctCount >= 4) return 1;
  return 0;
}

/**
 * Determines whether a boss duel / guardian pass threshold was met (≥ 7 / 10).
 */
export function isGuardianPassed(correctCount: number): boolean {
  return correctCount >= 7;
}
