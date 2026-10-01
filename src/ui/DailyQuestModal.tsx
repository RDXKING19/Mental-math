import React from 'react';
import { X, Target, Sparkles, CheckCircle2, Gift, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getDailyQuests, Quest } from '../engine/gamification';
import { playCorrect, playFanfare, playTap } from '../services/audio';

interface DailyQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  xp: number;
  streak: number;
  starsCount: number;
  scrollsCount: number;
  claimedQuestIds: string[];
  soundEnabled: boolean;
  onClaimQuest: (questId: string, xpReward: number) => void;
}

export const DailyQuestModal: React.FC<DailyQuestModalProps> = ({
  isOpen,
  onClose,
  xp,
  streak,
  starsCount,
  scrollsCount,
  claimedQuestIds,
  soundEnabled,
  onClaimQuest,
}) => {
  if (!isOpen) return null;

  const quests: Quest[] = getDailyQuests({
    xp,
    streak,
    starsCount,
    scrollsCount,
    claimedQuestIds,
  });

  const completedCount = quests.filter(q => q.completed).length;
  const claimedCount = quests.filter(q => q.claimed).length;

  const handleClaim = (quest: Quest) => {
    playFanfare(soundEnabled);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
    onClaimQuest(quest.id, quest.xpReward);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-ink/70 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-lg bg-card paper-card border-2 border-sun/40 shadow-2xl p-5 sm:p-7 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Subtle glowing ambient background effect */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-sun/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-saffron/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-ink/15 mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sun-light rounded-2xl text-sun border border-sun/40 shadow-sm">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-black text-xl sm:text-2xl text-ink">
                Daily Bazaar Quests
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-ink-soft">
                Refreshes daily · Grades 5–8 Mental Agility
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

        {/* Quest Overview Pill */}
        <div className="p-3.5 bg-paper rounded-2xl border border-ink/15 flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-display font-bold text-ink">
            <Sparkles className="w-4 h-4 text-sun" />
            <span>Progress: {completedCount} / {quests.length} Completed</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs font-black text-saffron bg-saffron-light px-3 py-1 rounded-full border border-saffron/30">
            <Flame className="w-3.5 h-3.5" />
            <span>Bonus Chest</span>
          </div>
        </div>

        {/* Quests List */}
        <div className="space-y-3 overflow-y-auto flex-1 pr-1">
          {quests.map(quest => {
            const isReadyToClaim = quest.completed && !quest.claimed;

            return (
              <div
                key={quest.id}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${
                  quest.claimed
                    ? 'bg-paper/50 border-ink/10 opacity-70'
                    : quest.completed
                    ? 'bg-sun-light/30 border-sun/60 shadow-warm'
                    : 'bg-paper border-ink/15'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="text-2xl p-2 bg-card rounded-xl border border-ink/10 shrink-0">
                    {quest.icon}
                  </span>
                  <div className="min-w-0">
                    <h4 className="font-display font-black text-sm sm:text-base text-ink truncate">
                      {quest.title}
                    </h4>
                    <p className="text-xs text-ink-soft mt-0.5 leading-snug">
                      {quest.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-2 bg-ink/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sun to-saffron rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, (quest.current / quest.target) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="font-mono text-[11px] font-bold text-ink-muted shrink-0">
                        {quest.current}/{quest.target}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Claim / Reward Button */}
                <div className="flex items-center justify-end shrink-0 sm:self-center">
                  {quest.claimed ? (
                    <span className="flex items-center gap-1 text-xs font-display font-black text-teal px-3 py-1.5 bg-teal-light rounded-xl border border-teal/30">
                      <CheckCircle2 className="w-4 h-4" /> Claimed
                    </span>
                  ) : isReadyToClaim ? (
                    <button
                      type="button"
                      onClick={() => handleClaim(quest)}
                      className="px-4 py-2 bg-gradient-to-r from-sun to-amber-500 hover:from-amber-400 hover:to-amber-600 text-ink font-display font-black text-xs rounded-xl shadow-warm hover:shadow-glow-gold flex items-center gap-1.5 transition-all cursor-pointer animate-pulse active:scale-95"
                    >
                      <Gift className="w-4 h-4" />
                      <span>Claim +{quest.xpReward} XP</span>
                    </button>
                  ) : (
                    <span className="text-xs font-mono font-black text-saffron bg-paper px-3 py-1.5 rounded-xl border border-ink/10">
                      +{quest.xpReward} XP
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-3 border-t border-ink/10 flex items-center justify-between text-xs text-ink-muted">
          <span>Complete all quests to accelerate level upgrades</span>
          <button
            type="button"
            onClick={onClose}
            className="font-display font-black text-saffron hover:underline cursor-pointer"
          >
            Back to Adventure
          </button>
        </div>
      </div>
    </div>
  );
};
