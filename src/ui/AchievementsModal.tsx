

import React from 'react';
import { X, Award, Sparkles, Lock, CheckCircle2 } from 'lucide-react';
import { getAchievements, Achievement } from '../engine/gamification';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  xp: number;
  streak: number;
  bestStreak: number;
  starsCount: number;
  scrollsCount: number;
  fastestMs: number | null;
  gateGuardianBeaten: boolean;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  xp,
  streak,
  bestStreak,
  starsCount,
  scrollsCount,
  fastestMs,
  gateGuardianBeaten,
}) => {
  if (!isOpen) return null;

  const achievements: Achievement[] = getAchievements({
    xp,
    streak,
    bestStreak,
    starsCount,
    scrollsCount,
    fastestMs,
    gateGuardianBeaten,
  });

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-ink/75 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-2xl bg-card paper-card border-2 border-master/40 shadow-2xl p-5 sm:p-7 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Glowing backdrop rune */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-master/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-ink/15 mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-master-light rounded-2xl text-master border border-master/40 shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-black text-xl sm:text-2xl text-ink">
                Bazaar Trophies & Badges
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-ink-soft">
                {unlockedCount} of {achievements.length} Badges Claimed
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-ink-muted hover:text-ink hover:bg-paper rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grid of Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 overflow-y-auto flex-1 pr-1">
          {achievements.map(ach => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${ach.isUnlocked
                  ? 'bg-paper border-sun/50 shadow-warm'
                  : 'bg-paper/40 border-ink/10 opacity-60'
                }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border ${ach.isUnlocked
                    ? 'bg-gradient-to-br from-sun/20 to-saffron/20 border-sun/50 shadow-sm'
                    : 'bg-paper border-ink/10'
                  }`}
              >
                {ach.isUnlocked ? ach.icon : <Lock className="w-5 h-5 text-ink-muted" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1.5">
                  <h4 className="font-display font-black text-sm text-ink truncate">
                    {ach.title}
                  </h4>
                  <span className="font-mono text-[10px] font-bold text-saffron bg-saffron-light px-2 py-0.5 rounded-full shrink-0">
                    +{ach.rewardXp} XP
                  </span>
                </div>

                <p className="text-xs text-ink-soft mt-0.5 leading-snug">
                  {ach.description}
                </p>

                <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-ink-muted font-bold truncate">
                    {ach.progressText}
                  </span>
                  {ach.isUnlocked && (
                    <span className="text-teal font-black flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-3 border-t border-ink/10 flex items-center justify-between text-xs text-ink-muted">
          <span>Earn badges by mastering shortcuts and testing mental agility</span>
          <button
            type="button"
            onClick={onClose}
            className="font-display font-black text-saffron hover:underline cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
