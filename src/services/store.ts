import { GateId } from '../engine/types';

export interface Settings {
  muted: boolean;
  soundEffects: boolean;
  calmMode: boolean;       // No timers, no heart limit, unlimited retries
  captions: boolean;
  theme: 'paper' | 'focus' | 'emerald' | 'sunset' | 'onyx' | 'cream';
  textSize: 'normal' | 'large' | 'xl';
}

export interface WorldProgress {
  stars: 0 | 1 | 2 | 3;
  bestCorrect: number;
  attempts: number;
  bestAvgMs: number | null;
}

export interface GateProgress {
  wonderSeen: boolean;
  storyIndex: number;
  simStation: 1 | 2 | 3;
  simActivity: 0 | 1 | 2;
  worlds: (WorldProgress | null)[];
  guardianPassed: boolean;
  reflection?: string;
  confidence?: 1 | 2 | 3 | 4 | 5;
}

export interface ProgressV1 {
  schema: 1;
  sessionSeed: number;
  startedAt: string;
  settings: Settings;
  xp: number;
  streak: number;
  bestStreak: number;
  fastestCorrectMs: number | null;
  activeGate: GateId;
  gates: Record<GateId, GateProgress>;
  scrolls: Record<string, { correctCount: number; earned: boolean }>;
  badges: string[];
  claimedQuestIds: string[];
  reflections: {
    teachGanu?: string;
    gateReflections: Record<number, string>;
  };
}

const STORAGE_KEY = 'quick_minds_mental_math_v1';

export function createDefaultProgress(): ProgressV1 {
  return {
    schema: 1,
    sessionSeed: Math.floor(Math.random() * 1000000),
    startedAt: new Date().toISOString(),
    settings: {
      muted: false,
      soundEffects: true,
      calmMode: false,
      captions: true,
      theme: 'cream',
      textSize: 'large',
    },
    xp: 0,
    streak: 0,
    bestStreak: 0,
    fastestCorrectMs: null,
    activeGate: 1,
    gates: {
      1: {
        wonderSeen: false,
        storyIndex: 0,
        simStation: 1,
        simActivity: 0,
        worlds: [null, null, null, null, null],
        guardianPassed: false,
      },
      2: {
        wonderSeen: false,
        storyIndex: 0,
        simStation: 1,
        simActivity: 0,
        worlds: [null, null, null, null, null],
        guardianPassed: false,
      },
      3: {
        wonderSeen: false,
        storyIndex: 0,
        simStation: 1,
        simActivity: 0,
        worlds: [null, null, null, null, null],
        guardianPassed: false,
      },
    },
    scrolls: {},
    badges: [],
    claimedQuestIds: [],
    reflections: {
      gateReflections: {},
    },
  };
}

export function loadProgress(): ProgressV1 {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultProgress();
    const parsed = JSON.parse(raw);
    if (parsed && parsed.schema === 1 && parsed.gates) {
      if (!parsed.claimedQuestIds) parsed.claimedQuestIds = [];
      if (!parsed.badges) parsed.badges = [];
      // Set Golden Dawn as default if previously set to paper or undefined
      if (!parsed.settings || parsed.settings.theme === 'paper') {
        parsed.settings = { ...(parsed.settings || {}), theme: 'cream' };
      }
      return parsed as ProgressV1;
    }
  } catch (err) {
    console.warn('Failed to load saved progress, resetting to default.', err);
  }
  return createDefaultProgress();
}

export function saveProgress(p: ProgressV1): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch (err) {
    console.warn('Failed to save progress to localStorage.', err);
  }
}

export function resetProgress(): ProgressV1 {
  const fresh = createDefaultProgress();
  saveProgress(fresh);
  return fresh;
}
