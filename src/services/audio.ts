/**
 * Audio System - Audio has been removed as requested.
 * All sound and speech narration functions are safe no-ops to ensure 0 audio output.
 */

export function playTap(_enabled = false): void {
  // Audio removed as requested
}

export function playStep(_enabled = false): void {
  // Audio removed as requested
}

export function playCorrect(_enabled = false): void {
  // Audio removed as requested
}

export function playTryAgain(_enabled = false): void {
  // Audio removed as requested
}

export function playFanfare(_enabled = false): void {
  // Audio removed as requested
}

export function playStreak(_enabled = false): void {
  // Audio removed as requested
}

export function playTick(_enabled = false): void {
  // Audio removed as requested
}

export function speakNarration(
  _text: string,
  _muted = true,
  onEnd?: () => void
): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  if (onEnd) onEnd();
}

export function stopNarration(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
