import React, { useState } from 'react';
import {
  Sparkles,
  Star,
  Zap,
  BookOpen,
  Award,
  Send,
  CheckCircle2,
  ArrowRight,
  Brain,
} from 'lucide-react';
import { ProgressV1 } from '../services/store';
import { TRICK_SCROLLS } from '../content/gatesData';
import { MascotGanu } from '../ui/MascotGanu';
import { playCorrect, playTap } from '../services/audio';

interface ReflectScreenProps {
  progress: ProgressV1;
  onSaveReflection: (teachText: string) => void;
  onFinishReflect: () => void;
  onBackToMap: () => void;
  soundEnabled?: boolean;
}

export const ReflectScreen: React.FC<ReflectScreenProps> = ({
  progress,
  onSaveReflection,
  onFinishReflect,
  onBackToMap,
  soundEnabled = true,
}) => {
  const [teachText, setTeachText] = useState(progress.reflections.teachGanu || '');
  const [ganuResponse, setGanuResponse] = useState<string | null>(
    progress.reflections.teachGanu
      ? 'Thank you for teaching me! Your explanation proves true mathematical understanding.'
      : null
  );

  // Confidence sliders (1-5)
  const [confidences, setConfidences] = useState<{ 1: number; 2: number; 3: number }>({
    1: 4,
    2: 4,
    3: 3,
  });

  // Match the trick mini-challenge
  const [matches, setMatches] = useState<Record<number, string>>({});

  const totalStars = [1, 2, 3].reduce((acc, g) => {
    return acc + progress.gates[g as 1 | 2 | 3].worlds.reduce((wAcc, w) => wAcc + (w?.stars || 0), 0);
  }, 0);

  const earnedScrolls = Object.values(progress.scrolls).filter(s => s.earned).length;

  const handleTeachSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (teachText.trim().length < 15) return;
    playCorrect(soundEnabled);
    onSaveReflection(teachText);
    setGanuResponse(
      `"Aha! Brilliant explanation of ${
        teachText.toLowerCase().includes('nikhilam')
          ? 'Nikhilam deficits'
          : teachText.toLowerCase().includes('5')
          ? 'squares ending in 5'
          : 'mental calculation'
      }! You truly understand how the gears turn."`
    );
  };

  const handleConfidenceChange = (gate: 1 | 2 | 3, val: number) => {
    playTap(soundEnabled);
    setConfidences(prev => ({ ...prev, [gate]: val }));
  };

  const matchingQuestions = [
    { id: 1, problem: '47 × 99', answer: 'Ekanyunena (×100 − n)', options: ['Nikhilam', 'Ekanyunena (×100 − n)', 'Duplex'] },
    { id: 2, problem: '65²', answer: 'Ekadhikena (n × (n+1) | 25)', options: ['Ekadhikena (n × (n+1) | 25)', 'Divide by 5', 'Split and Jump'] },
    { id: 3, problem: '47 × 53', answer: 'Difference of Squares (50² − 3²)', options: ['Difference of Squares (50² − 3²)', 'Eleven Peek', 'All from 9'] },
  ];

  return (
    <div className="h-full max-w-4xl mx-auto p-4 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-ink/10">
        <div>
          <span className="font-display font-black text-xs sm:text-sm uppercase tracking-wider text-teal flex items-center gap-2">
            <Brain className="w-5 h-5 text-saffron" /> Phase 5 · Master Reflection
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-ink mt-0.5">
            Your Mental Math Scoreboard
          </h2>
        </div>

        <button
          type="button"
          onClick={onBackToMap}
          className="px-4 py-2 bg-paper hover:bg-paper-subtle border border-ink/15 rounded-2xl font-display font-bold text-xs sm:text-sm text-ink transition-all cursor-pointer"
        >
          Bazaar Map
        </button>
      </div>

      {/* 1. Scoreboard Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 bg-card paper-card border-2 border-ink/15 shadow-sm text-center">
          <Sparkles className="w-6 h-6 mx-auto text-saffron mb-1.5" />
          <span className="text-xs uppercase font-extrabold text-ink-muted">Total XP</span>
          <div className="font-mono text-3xl sm:text-4xl font-black text-ink mt-1">{progress.xp}</div>
        </div>

        <div className="p-4 sm:p-5 bg-card paper-card border-2 border-ink/15 shadow-sm text-center">
          <Star className="w-6 h-6 mx-auto text-sun fill-sun mb-1.5" />
          <span className="text-xs uppercase font-extrabold text-ink-muted">Stars Earned</span>
          <div className="font-mono text-3xl sm:text-4xl font-black text-sun mt-1">{totalStars}/45</div>
        </div>

        <div className="p-4 sm:p-5 bg-card paper-card border-2 border-ink/15 shadow-sm text-center">
          <Zap className="w-6 h-6 mx-auto text-coral mb-1.5" />
          <span className="text-xs uppercase font-extrabold text-ink-muted">Best Streak</span>
          <div className="font-mono text-3xl sm:text-4xl font-black text-ink mt-1">{progress.bestStreak}</div>
        </div>

        <div className="p-4 sm:p-5 bg-card paper-card border-2 border-ink/15 shadow-sm text-center">
          <BookOpen className="w-6 h-6 mx-auto text-teal mb-1.5" />
          <span className="text-xs uppercase font-extrabold text-ink-muted">Tricks Mastered</span>
          <div className="font-mono text-3xl sm:text-4xl font-black text-teal mt-1">{earnedScrolls}/32</div>
        </div>
      </div>

      {/* 2. 15-Cell World Stars Matrix */}
      <div className="p-5 sm:p-7 bg-card paper-card border-2 border-ink/15 shadow-warm">
        <h4 className="font-display font-black text-base sm:text-lg text-ink mb-3.5">
          15-World Mastery Progress Matrix
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map(gNum => {
            const g = gNum as 1 | 2 | 3;
            const gData = progress.gates[g];
            return (
              <div key={g} className="p-4 bg-paper rounded-2xl border border-ink/10 space-y-2.5">
                <span className="font-display font-black text-xs sm:text-sm text-ink block">
                  Gate {g} ({g === 1 ? 'Spark' : g === 2 ? 'Flow' : 'Master'})
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {[0, 1, 2, 3, 4].map(wIdx => {
                    const stars = gData.worlds[wIdx]?.stars || 0;
                    return (
                      <div
                        key={wIdx}
                        className="h-11 sm:h-12 bg-card rounded-xl border border-ink/10 flex flex-col items-center justify-center shadow-xs"
                        title={`Gate ${g} World ${wIdx + 1}: ${stars} Stars`}
                      >
                        <span className="text-[10px] font-mono text-ink-muted font-bold">W{wIdx + 1}</span>
                        <div className="flex items-center text-xs font-black text-sun">
                          {stars > 0 ? `${stars}★` : '—'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Teach Ganu Section */}
      <div className="p-5 sm:p-7 bg-card paper-card border-2 border-ink/15 shadow-warm space-y-4">
        <div className="flex items-start gap-4">
          <MascotGanu
            mood="happy"
            size="md"
            speech={ganuResponse || "Explain one trick you mastered to me, with a real example! Teaching others is the ultimate proof of genuine mastery."}
          />
        </div>

        <form onSubmit={handleTeachSubmit} className="space-y-3">
          <textarea
            value={teachText}
            onChange={e => setTeachText(e.target.value)}
            placeholder="For example: 'To square 65, I multiply the tens 6 by (6+1)=7 to get 42, then attach 25 at the end to get 4225!'"
            rows={3}
            className="w-full p-4 bg-paper rounded-2xl border-2 border-ink/20 text-base sm:text-lg text-ink font-body focus:outline-none focus:border-saffron"
          />

          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-ink-muted">
              {teachText.length} characters (minimum 15)
            </span>

            <button
              type="submit"
              disabled={teachText.trim().length < 15}
              className="px-5 py-2.5 bg-saffron hover:bg-saffron-hover text-white font-display font-black text-xs sm:text-sm rounded-2xl shadow-warm flex items-center gap-2 transition-all disabled:opacity-40 cursor-pointer drop-shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Share with Ganu</span>
            </button>
          </div>
        </form>
      </div>

      {/* 4. Match the Trick Mini Challenge */}
      <div className="p-5 sm:p-7 bg-card paper-card border-2 border-ink/15 shadow-warm space-y-3.5">
        <h4 className="font-display font-black text-base sm:text-lg text-ink">
          Strategy Match: Which trick fits best?
        </h4>

        <div className="space-y-2.5">
          {matchingQuestions.map(q => {
            const chosen = matches[q.id];

            return (
              <div
                key={q.id}
                className="p-3.5 sm:p-4 bg-paper rounded-2xl border border-ink/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <span className="font-mono text-lg sm:text-xl font-black text-ink min-w-[90px]">
                  {q.problem}
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  {q.options.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setMatches(prev => ({ ...prev, [q.id]: opt }))}
                      className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-display font-bold transition-all border cursor-pointer ${
                        chosen === opt
                          ? opt === q.answer
                            ? 'bg-teal text-white border-teal shadow-warm font-black'
                            : 'bg-coral text-white border-coral font-black'
                          : 'bg-card text-ink border-ink/15 hover:bg-paper'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Confidence Sliders */}
      <div className="p-5 sm:p-7 bg-card paper-card border-2 border-ink/15 shadow-warm space-y-4">
        <h4 className="font-display font-black text-base sm:text-lg text-ink">
          Confidence Self-Assessment
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map(gNum => {
            const g = gNum as 1 | 2 | 3;
            const currentRating = confidences[g];
            return (
              <div key={g} className="p-4 bg-paper rounded-2xl border border-ink/10 space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm font-display font-black text-ink">
                  <span>Gate {g}: {g === 1 ? 'Spark' : g === 2 ? 'Flow' : 'Master'}</span>
                  <span className="font-mono text-saffron font-black text-sm">{currentRating}/5 ★</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map(starNum => (
                    <button
                      key={starNum}
                      type="button"
                      onClick={() => handleConfidenceChange(g, starNum)}
                      className="p-1 hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          starNum <= currentRating ? 'fill-sun text-sun' : 'text-ink/15'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA to Celebration */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onFinishReflect}
          className="w-full py-4.5 bg-saffron hover:bg-saffron-hover text-white font-display font-black text-lg sm:text-xl rounded-2xl shadow-warm flex items-center justify-center gap-3 transition-all active:scale-98 cursor-pointer drop-shadow-sm"
        >
          <span>Claim Mental Math Certificate</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

