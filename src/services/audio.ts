/**
 * Audio System for Mental Math Bazaar
 * 
 * Provides:
 * 1. Rich, responsive, latency-free Web Audio API sound effects (taps, steps, correct chimes, streaks, fanfare)
 * 2. Natural speech synthesis narration powered by ElevenLabs AI with caching & browser fallback
 */

import {
  elevenLabsService,
  NarrationState,
  NarrationStatus,
  ELEVENLABS_VOICES,
  DEFAULT_VOICE_ID,
} from './elevenlabs';

export { ELEVENLABS_VOICES, DEFAULT_VOICE_ID };
export type { NarrationState, NarrationStatus };

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// -------------------------------------------------------------
// Sound Effects (Web Audio API)
// -------------------------------------------------------------

export function playTap(enabled = true): void {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.04);
  } catch (err) {
    console.debug('Tap SFX error:', err);
  }
}

export function playStep(enabled = true): void {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.06); // E5

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  } catch (err) {
    console.debug('Step SFX error:', err);
  }
}

export function playCorrect(enabled = true): void {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const startTime = ctx.currentTime;

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + index * 0.07);

      const noteStart = startTime + index * 0.07;
      const noteEnd = noteStart + 0.28;

      gain.gain.setValueAtTime(0, noteStart);
      gain.gain.linearRampToValueAtTime(0.18, noteStart + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteEnd);
    });
  } catch (err) {
    console.debug('Correct SFX error:', err);
  }
}

export function playTryAgain(enabled = true): void {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const notes = [440, 392]; // A4, G4
    const startTime = ctx.currentTime;

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime + index * 0.12);

      const noteStart = startTime + index * 0.12;
      const noteEnd = noteStart + 0.22;

      gain.gain.setValueAtTime(0.12, noteStart);
      gain.gain.exponentialRampToValueAtTime(0.001, noteEnd);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteEnd);
    });
  } catch (err) {
    console.debug('TryAgain SFX error:', err);
  }
}

export function playStreak(enabled = true): void {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const notes = [587.33, 739.99, 880.0, 1174.66, 1479.98]; // D5, F#5, A5, D6, F#6
    const startTime = ctx.currentTime;

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = index % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, startTime + index * 0.05);

      const noteStart = startTime + index * 0.05;
      const noteEnd = noteStart + 0.3;

      gain.gain.setValueAtTime(0, noteStart);
      gain.gain.linearRampToValueAtTime(0.15, noteStart + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteEnd);
    });
  } catch (err) {
    console.debug('Streak SFX error:', err);
  }
}

export function playFanfare(enabled = true): void {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const arpeggio = [
      { freq: 392.0, time: 0.0, dur: 0.14 },
      { freq: 523.25, time: 0.14, dur: 0.14 },
      { freq: 659.25, time: 0.28, dur: 0.14 },
      { freq: 783.99, time: 0.42, dur: 0.55 },
      { freq: 1046.5, time: 0.56, dur: 0.75 },
    ];

    const startTime = ctx.currentTime;

    arpeggio.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime + time);

      const noteStart = startTime + time;
      const noteEnd = noteStart + dur;

      gain.gain.setValueAtTime(0.01, noteStart);
      gain.gain.linearRampToValueAtTime(0.2, noteStart + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteEnd);
    });
  } catch (err) {
    console.debug('Fanfare SFX error:', err);
  }
}

export function playTick(enabled = true): void {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.02);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.02);
  } catch (err) {
    console.debug('Tick SFX error:', err);
  }
}

// -------------------------------------------------------------
// Voice Narration (ElevenLabs + Web Speech Fallback)
// -------------------------------------------------------------

export function speakNarration(
  text: string,
  muted = false,
  onEnd?: () => void,
  voiceId?: string
): void {
  if (muted) {
    if (onEnd) onEnd();
    return;
  }

  elevenLabsService.speak(text, {
    isMuted: muted,
    voiceId,
    onEnd,
  });
}

export function stopNarration(): void {
  elevenLabsService.stop();
}

export function pauseNarration(): void {
  elevenLabsService.pause();
}

export function resumeNarration(): void {
  elevenLabsService.resume();
}

export function isNarrating(): boolean {
  return elevenLabsService.isNarrating();
}

export function subscribeNarration(listener: (state: NarrationState) => void): () => void {
  return elevenLabsService.subscribe(listener);
}

export function setNarrationVoice(voiceId: string): void {
  elevenLabsService.setVoice(voiceId);
}

export function setElevenLabsKey(apiKey: string): void {
  elevenLabsService.setApiKey(apiKey);
}
