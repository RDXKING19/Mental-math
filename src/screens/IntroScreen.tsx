import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Brain,
  Zap,
  Bot,
  HeartHandshake,
  Target,
  Award,
  Clock,
  CheckCircle2,
  Lock,
  RotateCcw,
} from 'lucide-react';
import { MascotGanu } from '../ui/MascotGanu';
import { getPlayerLevel } from '../engine/gamification';

interface IntroScreenProps {
  onBegin: () => void;
  onOpenQuickCheck: () => void;
  calmMode: boolean;
  onToggleCalm: () => void;
  xp?: number;
  streak?: number;
  stars?: number;
  scrollCount?: number;
  onOpenDailyQuests?: () => void;
  onOpenAchievements?: () => void;
  onSelectGate?: (gate: 1 | 2 | 3) => void;
  onAddXp?: (amount: number) => void;
  onIncrementStreak?: () => void;
}

interface BrainSpark {
  id: string;
  question: string;
  options: number[];
  answer: number;
  trickName: string;
  explanation: string;
}

const BRAIN_SPARKS: BrainSpark[] = [
  {
    id: '1',
    question: '43 × 11 = ?',
    options: [473, 463, 483, 533],
    answer: 473,
    trickName: 'Instant 11s',
    explanation: 'Split 4 and 3. Add them (4 + 3 = 7) and sandwich 7 in the middle: 473!',
  },
  {
    id: '2',
    question: '35² = ?',
    options: [1225, 1125, 1250, 1325],
    answer: 1225,
    trickName: 'Ends in 5 Squaring',
    explanation: 'Multiply tens digit 3 by next number 4 (3 × 4 = 12), then attach 25: 1225!',
  },
  {
    id: '3',
    question: '96 × 94 = ?',
    options: [9024, 8924, 9124, 9034],
    answer: 9024,
    trickName: 'Nikhilam Near 100',
    explanation: 'Deficiencies from 100 are -4 and -6. (96 - 6 = 90), (-4 × -6 = 24) ➔ 9024!',
  },
  {
    id: '4',
    question: '15% of $80 = ?',
    options: [12, 10, 14, 16],
    answer: 12,
    trickName: '10% + 5% Split',
    explanation: '10% of 80 is 8. Half of that (5%) is 4. Add them: 8 + 4 = 12!',
  },
  {
    id: '5',
    question: '75 + 48 = ?',
    options: [123, 121, 125, 133],
    answer: 123,
    trickName: 'Round & Fix',
    explanation: 'Round 48 up to 50: 75 + 50 = 125. Fix the extra 2: 125 - 2 = 123!',
  },
  {
    id: '6',
    question: '65² = ?',
    options: [4225, 4125, 4250, 4325],
    answer: 4225,
    trickName: 'Ends in 5 Squaring',
    explanation: 'Multiply tens digit 6 by next number 7 (6 × 7 = 42), then attach 25: 4225!',
  },
];

export const IntroScreen: React.FC<IntroScreenProps> = ({
  onBegin,
  onOpenQuickCheck,
  calmMode,
  onToggleCalm,
  xp = 0,
  streak = 0,
  stars = 0,
  scrollCount = 0,
  onOpenDailyQuests,
  onOpenAchievements,
  onSelectGate,
  onAddXp,
  onIncrementStreak,
}) => {
  const levelInfo = getPlayerLevel(xp);

  // Interactive Daily Brain Spark mini-game state
  const [sparkIndex, setSparkIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentSpark = BRAIN_SPARKS[sparkIndex];

  const handleSelectAnswer = (option: number) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);

    if (option === currentSpark.answer) {
      setIsCorrect(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#D97706', '#EA580C', '#059669', '#7C3AED'],
      });
      onAddXp?.(30);
      onIncrementStreak?.();
    } else {
      setIsCorrect(false);
    }
  };

  const handleNextSpark = () => {
    setSparkIndex((sparkIndex + 1) % BRAIN_SPARKS.length);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  return (
    <div className="relative min-h-full flex flex-col justify-between p-3 sm:p-8 max-w-6xl mx-auto overflow-y-auto space-y-6">
      {/* Top Header Gamification Strip: Grade Band, Badges Links, Calm Mode */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-100 text-amber-950 border-2 border-amber-400 rounded-full font-display font-black text-xs sm:text-sm shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" /> Grades 5–8 · Quick Minds Mental Math
          </span>

          {/* Quick Badges Link */}
          {onOpenAchievements && (
            <button
              type="button"
              onClick={onOpenAchievements}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-paper text-ink rounded-full border border-ink/20 text-xs font-display font-black transition-all cursor-pointer shadow-xs active:scale-95"
              title="View Badges & Trophies"
            >
              <Award className="w-3.5 h-3.5 text-purple-700" />
              <span>Trophies</span>
            </button>
          )}

          {/* Quick Daily Quests Link */}
          {onOpenDailyQuests && (
            <button
              type="button"
              onClick={onOpenDailyQuests}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-paper text-ink rounded-full border border-ink/20 text-xs font-display font-black transition-all cursor-pointer shadow-xs active:scale-95"
              title="View Daily Quests"
            >
              <Target className="w-3.5 h-3.5 text-amber-700" />
              <span>Daily Quests</span>
            </button>
          )}
        </div>

        {/* Calm Mode Toggle Button */}
        <button
          type="button"
          onClick={onToggleCalm}
          className={`flex items-center justify-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-display font-black border-2 transition-all cursor-pointer self-start sm:self-auto shadow-xs active:scale-95 ${
            calmMode
              ? 'bg-emerald-100 text-emerald-950 border-emerald-500'
              : 'bg-white text-ink-muted border-ink/20 hover:text-ink'
          }`}
          title="Calm Mode removes timers, hearts, and speed pressure"
        >
          <HeartHandshake className="w-4 h-4 text-emerald-700" />
          <span>Calm Mode: {calmMode ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Player Gamification Progress Banner (Duolingo Style) */}
      <div className="p-4 sm:p-5 bg-white paper-card border-2 border-amber-400/80 shadow-warm rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Level Info */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl shadow-xs border-2 border-amber-400 shrink-0">
            {levelInfo.badgeIcon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-sm sm:text-base text-ink">
                Level {levelInfo.level}: {levelInfo.title}
              </span>
              <span className="font-mono text-xs font-black text-amber-950 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-400">
                {xp} XP
              </span>
            </div>
            <p className="text-xs text-ink-soft font-semibold">
              {levelInfo.nextXp - xp > 0
                ? `${levelInfo.nextXp - xp} XP to Level ${levelInfo.level + 1}`
                : 'Max Master Rank Achieved!'}
            </p>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="flex-1 max-w-sm space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-ink-muted">
            <span>Tier Mastery Progress</span>
            <span>{levelInfo.progressPct}%</span>
          </div>
          <div className="h-3 w-full bg-paper rounded-full overflow-hidden border border-ink/15">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${levelInfo.progressPct}%` }}
            />
          </div>
        </div>

        {/* Quick Stats: Stars & Streak */}
        <div className="flex items-center gap-2.5 shrink-0">
          {streak >= 2 && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 border-2 border-orange-500 rounded-xl text-orange-950 font-mono text-xs sm:text-sm font-black shadow-xs animate-pulse"
              title={`${streak} answers in a row!`}
            >
              <span>🔥</span>
              <span>{streak} Streak</span>
            </div>
          )}

          <div
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 border-2 border-amber-400 rounded-xl text-amber-950 font-mono text-xs sm:text-sm font-black shadow-xs"
            title="Total Stars Collected across the Bazaar"
          >
            <span className="text-amber-600">⭐</span>
            <span>{stars}/45</span>
          </div>

          <div
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-ink/20 rounded-xl text-ink font-mono text-xs sm:text-sm font-black shadow-xs"
            title="Mastered Vedic Trick Scrolls"
          >
            <span>📜</span>
            <span>{scrollCount}/32</span>
          </div>
        </div>
      </div>

      {/* Hero Cinematic Stage (No fixed height cutoffs, clear high-contrast text) */}
      <div className="relative w-full rounded-3xl overflow-hidden shadow-warm-lg border-2 border-amber-400 group min-h-[22rem] sm:min-h-[25rem] flex flex-col justify-end">
        {/* Background Image */}
        <img
          src="./images/hero_bazaar.jpg"
          alt="Mental Math Bazaar with Ganu the Owl and Ira"
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />

        {/* Gradient Overlay for crisp contrast */}
        <div className="relative z-10 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20 p-5 sm:p-9 flex flex-col justify-end">
          <div className="max-w-3xl space-y-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-500 text-white font-display font-black text-xs uppercase tracking-wider rounded-full shadow-md w-fit">
              <Sparkles className="w-3.5 h-3.5" /> Welcome to the Grand Bazaar
            </span>

            <h1 className="text-white font-display font-black text-3xl sm:text-5xl drop-shadow-lg leading-tight">
              Quick Minds: <span className="text-amber-300">Mental Math</span>
            </h1>

            <p className="text-amber-100 font-medium text-sm sm:text-base md:text-lg max-w-2xl drop-shadow leading-relaxed">
              Master visual thought trails, Vedic calculation shortcuts, and mental agility. Compute squares, powers, roots, and lightning arithmetic in seconds without scratchpads!
            </p>

            {/* Hero Action CTA Group */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onBegin}
                className="shimmer-btn-effect px-7 py-3.5 sm:py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-display font-black text-base sm:text-lg rounded-2xl shadow-warm-lg border-2 border-amber-300 flex items-center gap-2.5 transition-all active:scale-95 cursor-pointer"
              >
                <span>⚡ Enter Grand Bazaar</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {onOpenDailyQuests && (
                <button
                  type="button"
                  onClick={onOpenDailyQuests}
                  className="px-5 py-3.5 sm:py-4 bg-white hover:bg-amber-50 text-slate-900 font-display font-black text-sm sm:text-base rounded-2xl border-2 border-amber-400 shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <Target className="w-4 h-4 text-amber-700" />
                  <span>Daily Quests</span>
                </button>
              )}

              <button
                type="button"
                onClick={onOpenQuickCheck}
                className="px-5 py-3.5 sm:py-4 bg-white/95 hover:bg-white text-slate-900 font-display font-black text-sm sm:text-base rounded-2xl border-2 border-slate-300 shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>Placement Test (3 min)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive "Daily Brain Spark" Live Challenge Widget */}
      <div className="p-5 sm:p-6 bg-white paper-card border-2 border-amber-400 shadow-warm rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ink/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-black">
              <Zap className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h4 className="font-display font-black text-base sm:text-lg text-ink flex items-center gap-2">
                <span>Daily Brain Spark Challenge</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-950 border border-amber-400">
                  +30 XP Bounty
                </span>
              </h4>
              <p className="text-xs text-ink-soft font-semibold">
                Can you crack this Vedic mental arithmetic problem in your head right now?
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNextSpark}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-paper hover:bg-amber-100 text-ink font-display font-black text-xs rounded-xl border border-ink/15 transition-all self-start sm:self-auto cursor-pointer shadow-xs active:scale-95"
            title="Try another quick problem"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
            <span>Next Spark</span>
          </button>
        </div>

        {/* Challenge Question & Options */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-amber-800 uppercase tracking-wider block">
              Vedic Shortcut: {currentSpark.trickName}
            </span>
            <div className="text-3xl sm:text-4xl font-mono font-black text-ink tracking-wide">
              {currentSpark.question}
            </div>
          </div>

          {/* Answer Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {currentSpark.options.map(opt => {
              const isSelected = selectedAnswer === opt;
              let btnStyle = 'bg-paper hover:bg-amber-100 border-ink/20 text-ink hover:border-amber-400';

              if (isAnswered) {
                if (opt === currentSpark.answer) {
                  btnStyle = 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-105 font-black';
                } else if (isSelected) {
                  btnStyle = 'bg-red-600 text-white border-red-700 opacity-90 font-black';
                } else {
                  btnStyle = 'bg-paper/50 border-ink/10 text-ink-muted opacity-40';
                }
              }

              return (
                <button
                  key={opt}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectAnswer(opt)}
                  className={`px-4 py-3 rounded-xl border-2 font-mono font-black text-base sm:text-lg transition-all cursor-pointer shadow-xs ${btnStyle} ${
                    !isAnswered ? 'active:scale-95' : ''
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Thought Trail Feedback */}
        {isAnswered && (
          <div
            className={`p-4 rounded-xl border-2 transition-all flex items-start gap-3 animate-in fade-in ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                : 'bg-red-50 border-red-300 text-red-950'
            }`}
          >
            <div className="text-xl shrink-0 mt-0.5">
              {isCorrect ? '✨' : '💡'}
            </div>
            <div className="space-y-1">
              <span className="font-display font-black text-sm block">
                {isCorrect ? 'Spectacular Calculation!' : 'Almost! Here is the Vedic Secret:'}
              </span>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                {currentSpark.explanation}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mascot Owl Mentor Section: Polished Card with Secret Tricks Cycler */}
      <div className="p-4 sm:p-6 bg-white paper-card border-2 border-amber-400 shadow-warm">
        <MascotGanu
          size="md"
          mood="happy"
          speech="Ready to out-think a calculator? Tap me anytime for a secret Vedic shortcut, or pick a Gate below to begin!"
        />
      </div>

      {/* 3 Skill Module Cards (The 3 Gates - Grades 5 to 8 Progression) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-black text-lg sm:text-xl text-ink flex items-center gap-2">
            <Brain className="w-5 h-5 text-amber-700" />
            <span>Skill Modules & Progression Path (Grades 5–8)</span>
          </h3>
          <span className="text-xs font-mono font-bold text-ink-muted hidden sm:inline">
            15 Procedural Worlds · 3 Boss Battles
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Module 1: Gate 1 Spark */}
          <div className="paper-card-interactive p-5 sm:p-6 bg-white flex flex-col justify-between rounded-2xl border-2 border-orange-300 hover:border-orange-500 space-y-4 shadow-warm">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-xs font-display font-black bg-orange-100 text-orange-950 border border-orange-400 uppercase tracking-wider">
                  Novice · ★☆☆
                </span>
                <span className="text-xs font-mono font-bold text-ink-muted flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> ~15 min
                </span>
              </div>

              <div>
                <h4 className="font-display font-black text-xl sm:text-2xl text-ink">
                  Gate 1 · Spark
                </h4>
                <span className="text-xs font-black text-emerald-800 block mt-0.5">
                  Grades 5–6 Foundations & Agility
                </span>
                <p className="text-xs text-ink-soft font-medium mt-1 leading-relaxed">
                  Make-10/100, round & fix, halving & doubling, ×9/11 peek, and 10/25/50% anchors.
                </p>
              </div>

              <div className="p-3 bg-paper rounded-xl border border-ink/10 space-y-1">
                <div className="flex items-center justify-between text-xs font-mono font-black">
                  <span className="text-ink-muted">Reward Bounty</span>
                  <span className="text-amber-800 font-black">+450 XP · 15★</span>
                </div>
                <div className="text-[11px] text-emerald-800 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Unlocked from start
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => (onSelectGate ? onSelectGate(1) : onBegin())}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-display font-black text-sm rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <span>Explore Gate 1</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Module 2: Gate 2 Flow */}
          <div className="paper-card-interactive p-5 sm:p-6 bg-white flex flex-col justify-between rounded-2xl border-2 border-emerald-300 hover:border-emerald-500 space-y-4 shadow-warm">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-xs font-display font-black bg-emerald-100 text-emerald-950 border border-emerald-400 uppercase tracking-wider">
                  Adept · ★★☆
                </span>
                <span className="text-xs font-mono font-bold text-ink-muted flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> ~20 min
                </span>
              </div>

              <div>
                <h4 className="font-display font-black text-xl sm:text-2xl text-ink">
                  Gate 2 · Flow
                </h4>
                <span className="text-xs font-black text-emerald-800 block mt-0.5">
                  Grades 6–7 Vedic & Base Shortcuts
                </span>
                <p className="text-xs text-ink-soft font-medium mt-1 leading-relaxed">
                  Ending in 5 squaring, Nikhilam near 100, 2×2 Urdhva cross, ×99, and ÷25 split.
                </p>
              </div>

              <div className="p-3 bg-paper rounded-xl border border-ink/10 space-y-1">
                <div className="flex items-center justify-between text-xs font-mono font-black">
                  <span className="text-ink-muted">Reward Bounty</span>
                  <span className="text-amber-800 font-black">+650 XP · 15★</span>
                </div>
                <div className="text-[11px] text-ink-muted font-bold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-amber-700" /> Requires Gate 1 Guardian
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => (onSelectGate ? onSelectGate(2) : onBegin())}
              className="w-full py-3 bg-paper hover:bg-amber-100 text-ink font-display font-black text-sm rounded-xl border border-ink/20 shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <span>Explore Gate 2</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Module 3: Gate 3 Master */}
          <div className="paper-card-interactive p-5 sm:p-6 bg-white flex flex-col justify-between rounded-2xl border-2 border-purple-300 hover:border-purple-500 space-y-4 shadow-warm">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-xs font-display font-black bg-purple-100 text-purple-950 border border-purple-400 uppercase tracking-wider">
                  Master · ★★★
                </span>
                <span className="text-xs font-mono font-bold text-ink-muted flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> ~25 min
                </span>
              </div>

              <div>
                <h4 className="font-display font-black text-xl sm:text-2xl text-ink">
                  Gate 3 · Master
                </h4>
                <span className="text-xs font-black text-purple-800 block mt-0.5">
                  Grades 7–8 Duplex, Roots & Proofs
                </span>
                <p className="text-xs text-ink-soft font-medium mt-1 leading-relaxed">
                  Duplex squaring, see-saw algebraic balance, 3×2 cross, square roots, and digit-sum checks.
                </p>
              </div>

              <div className="p-3 bg-paper rounded-xl border border-ink/10 space-y-1">
                <div className="flex items-center justify-between text-xs font-mono font-black">
                  <span className="text-ink-muted">Reward Bounty</span>
                  <span className="text-amber-800 font-black">+900 XP · 15★</span>
                </div>
                <div className="text-[11px] text-ink-muted font-bold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-purple-700" /> Requires Gate 2 Guardian
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => (onSelectGate ? onSelectGate(3) : onBegin())}
              className="w-full py-3 bg-paper hover:bg-amber-100 text-ink font-display font-black text-sm rounded-xl border border-ink/20 shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <span>Explore Gate 3</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Feature Pillars: Why Quick Minds Works */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-4 bg-white paper-card border-2 border-ink/15 shadow-xs flex items-start gap-3">
          <div className="p-2.5 bg-orange-100 text-orange-800 rounded-xl shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-display font-black text-sm sm:text-base text-ink">32 Vedic Trick Scrolls</h5>
            <p className="text-xs text-ink-soft font-medium mt-0.5 leading-snug">
              Collect ancient and modern calculation formulas verified with clear algebraic reasoning.
            </p>
          </div>
        </div>

        <div className="p-4 bg-white paper-card border-2 border-ink/15 shadow-xs flex items-start gap-3">
          <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-display font-black text-sm sm:text-base text-ink">Visual Thought Trails</h5>
            <p className="text-xs text-ink-soft font-medium mt-0.5 leading-snug">
              Manipulatives like Bead Rail, Balance Scale, and Number Hopper reveal how numbers link.
            </p>
          </div>
        </div>

        <div className="p-4 bg-white paper-card border-2 border-ink/15 shadow-xs flex items-start gap-3">
          <div className="p-2.5 bg-purple-100 text-purple-800 rounded-xl shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-display font-black text-sm sm:text-base text-ink">Click Bot Guardian Battles</h5>
            <p className="text-xs text-ink-soft font-medium mt-0.5 leading-snug">
              Prove mental calculation outpaces machine keystrokes in exciting boss encounters!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
