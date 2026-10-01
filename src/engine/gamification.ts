// Gamification Engine: Levels, Quests, and Achievements
// Designed for Grades 5-8 with engaging progression, clear milestones, and Duolingo-style rewards.

export interface PlayerLevelInfo {
  level: number;
  title: string;
  minXp: number;
  nextXp: number;
  progressPct: number;
  badgeIcon: string;
}

export const LEVEL_TIERS: { level: number; title: string; minXp: number; icon: string }[] = [
  { level: 1, title: 'Bazaar Novice', minXp: 0, icon: '🌱' },
  { level: 2, title: 'Spark Apprentice', minXp: 150, icon: '⚡' },
  { level: 3, title: 'Mental Speedster', minXp: 400, icon: '🌪️' },
  { level: 4, title: 'Vedic Alchemist', minXp: 800, icon: '🔮' },
  { level: 5, title: 'Lightning Calculator', minXp: 1400, icon: '⚔️' },
  { level: 6, title: 'Grand Math Sage', minXp: 2200, icon: '👑' },
  { level: 7, title: 'Bazaar Legend', minXp: 3200, icon: '🌌' },
];

export function getPlayerLevel(xp: number): PlayerLevelInfo {
  let currentTier = LEVEL_TIERS[0];
  let nextTier = LEVEL_TIERS[1];

  for (let i = 0; i < LEVEL_TIERS.length; i++) {
    if (xp >= LEVEL_TIERS[i].minXp) {
      currentTier = LEVEL_TIERS[i];
      nextTier = LEVEL_TIERS[i + 1] || {
        level: currentTier.level + 1,
        title: 'Mythic Master',
        minXp: currentTier.minXp + 1500,
        icon: '✨',
      };
    } else {
      break;
    }
  }

  const range = nextTier.minXp - currentTier.minXp;
  const currentProgress = xp - currentTier.minXp;
  const progressPct = Math.min(100, Math.max(0, Math.round((currentProgress / range) * 100)));

  return {
    level: currentTier.level,
    title: currentTier.title,
    minXp: currentTier.minXp,
    nextXp: nextTier.minXp,
    progressPct,
    badgeIcon: currentTier.icon,
  };
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  xpReward: number;
  completed: boolean;
  claimed: boolean;
  icon: string;
}

export function getDailyQuests(progress: {
  xp: number;
  streak: number;
  scrollsCount: number;
  starsCount: number;
  claimedQuestIds?: string[];
}): Quest[] {
  const claimed = progress.claimedQuestIds || [];

  return [
    {
      id: 'quest_spark_practice',
      title: 'Bazaar Warmup',
      description: 'Collect at least 2 Stars in any practice world',
      target: 2,
      current: Math.min(2, progress.starsCount),
      xpReward: 60,
      completed: progress.starsCount >= 2,
      claimed: claimed.includes('quest_spark_practice'),
      icon: '⭐',
    },
    {
      id: 'quest_streak_builder',
      title: 'Flame Keeper',
      description: 'Build a winning streak of 3 correct answers',
      target: 3,
      current: Math.min(3, progress.streak),
      xpReward: 80,
      completed: progress.streak >= 3,
      claimed: claimed.includes('quest_streak_builder'),
      icon: '🔥',
    },
    {
      id: 'quest_scroll_explorer',
      title: 'Scroll Hunter',
      description: 'Master or unlock at least 1 Trick Scroll',
      target: 1,
      current: Math.min(1, progress.scrollsCount),
      xpReward: 100,
      completed: progress.scrollsCount >= 1,
      claimed: claimed.includes('quest_scroll_explorer'),
      icon: '📜',
    },
  ];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'speed' | 'streak' | 'mastery' | 'explore';
  icon: string;
  rewardXp: number;
  isUnlocked: boolean;
  progressText: string;
}

export function getAchievements(progress: {
  xp: number;
  streak: number;
  bestStreak: number;
  starsCount: number;
  scrollsCount: number;
  fastestMs: number | null;
  gateGuardianBeaten: boolean;
}): Achievement[] {
  return [
    {
      id: 'ach_first_step',
      title: 'First Flame',
      description: 'Earn your very first Star in the Grand Bazaar',
      category: 'explore',
      icon: '🌟',
      rewardXp: 50,
      isUnlocked: progress.starsCount >= 1,
      progressText: `${Math.min(1, progress.starsCount)} / 1 Star`,
    },
    {
      id: 'ach_streak_five',
      title: 'Rapid Comet',
      description: 'Reach an unstoppable streak of 5 correct calculations',
      category: 'streak',
      icon: '⚡',
      rewardXp: 100,
      isUnlocked: progress.bestStreak >= 5,
      progressText: `${Math.min(5, progress.bestStreak)} / 5 Streak`,
    },
    {
      id: 'ach_speed_demon',
      title: 'Lightning Mind',
      description: 'Answer a calculation correctly in under 4 seconds',
      category: 'speed',
      icon: '⏱️',
      rewardXp: 120,
      isUnlocked: progress.fastestMs !== null && progress.fastestMs <= 4000,
      progressText: progress.fastestMs ? `${(progress.fastestMs / 1000).toFixed(1)}s record` : 'Pending',
    },
    {
      id: 'ach_guardian_slayer',
      title: 'Bot Buster',
      description: 'Defeat Click Bot in the Gate 1 Guardian Duel',
      category: 'mastery',
      icon: '🤖',
      rewardXp: 150,
      isUnlocked: progress.gateGuardianBeaten,
      progressText: progress.gateGuardianBeaten ? 'Guardian Defeated' : 'Gate 1 Guardian pending',
    },
    {
      id: 'ach_scroll_collector',
      title: 'Scroll Collector',
      description: 'Collect and master 5 Vedic calculation scrolls',
      category: 'explore',
      icon: '📜',
      rewardXp: 200,
      isUnlocked: progress.scrollsCount >= 5,
      progressText: `${Math.min(5, progress.scrollsCount)} / 5 Scrolls`,
    },
    {
      id: 'ach_master_ten_stars',
      title: 'Constellation Master',
      description: 'Earn 10 stars across different worlds in the bazaar',
      category: 'mastery',
      icon: '👑',
      rewardXp: 250,
      isUnlocked: progress.starsCount >= 10,
      progressText: `${Math.min(10, progress.starsCount)} / 10 Stars`,
    },
  ];
}

export const GANU_MENTOR_TIPS = [
  {
    title: 'Instant 11 Multiplication',
    body: 'To multiply any 2-digit number by 11, add its digits and sandwich them in the middle! For 45 × 11: 4 + 5 = 9, so 495! If they sum above 9, simply carry 1 left.',
    formula: 'ab × 11 = a | (a + b) | b',
    grade: 'Grades 5–6',
  },
  {
    title: 'Squaring Numbers Ending in 5',
    body: 'Vedic Sutra "Ekadhikena Purvena": multiply the tens digit by (tens + 1), then write 25! For 65²: 6 × 7 = 42, attach 25 ➔ 4,225!',
    formula: '65² = (6 × 7) | 25 = 4,225',
    grade: 'Grades 5–7',
  },
  {
    title: 'Near-100 Base Multiplication',
    body: 'Nikhilam rule: For 96 × 93, their deficiencies from 100 are -4 and -7. Cross-subtract: 96 - 7 = 89. Multiply deficiencies: -4 × -7 = 28. Result = 8,928!',
    formula: '96 × 93 = (96 − 7) | (4 × 7) = 8,928',
    grade: 'Grades 6–8',
  },
  {
    title: 'Rapid 15% Tip / Discount',
    body: 'To compute 15% without paper: find 10% first (slide decimal 1 left), take half of that for 5%, then add them together! 15% of $80 = $8 + $4 = $12.',
    formula: '15% = 10% + half(10%)',
    grade: 'Grades 5–8',
  },
  {
    title: 'Difference of Squares Shortcut',
    body: 'Notice symmetric products! 48 × 52 is (50 − 2)(50 + 2) = 50² − 2² = 2,500 − 4 = 2,496. Zero carryover, lightning fast!',
    formula: '(a − b)(a + b) = a² − b²',
    grade: 'Grades 7–8',
  },
  {
    title: 'The Duplex Squaring Secret',
    body: 'For 32², the Duplex of 3 is 9, Duplex of 32 is 2×3×2 = 12, Duplex of 2 is 4. Assemble with carries: 9 | 12 | 4 = 1,024!',
    formula: 'D(ab) = 2ab, D(a) = a²',
    grade: 'Grades 7–8',
  },
];
