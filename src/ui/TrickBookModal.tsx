import React, { useState } from 'react';
import { X, BookOpen, Star, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { TRICK_SCROLLS, TrickScroll } from '../content/gatesData';
import { GateId } from '../engine/types';

interface TrickBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedScrolls: Record<string, { correctCount: number; earned: boolean }>;
}

export const TrickBookModal: React.FC<TrickBookModalProps> = ({
  isOpen,
  onClose,
  unlockedScrolls,
}) => {
  const [selectedGate, setSelectedGate] = useState<GateId | 'all'>('all');
  const [activeScroll, setActiveScroll] = useState<TrickScroll | null>(TRICK_SCROLLS[0]);

  if (!isOpen) return null;

  const filteredScrolls = TRICK_SCROLLS.filter(s =>
    selectedGate === 'all' ? true : s.gate === selectedGate
  );

  const earnedCount = TRICK_SCROLLS.filter(s => unlockedScrolls[s.id]?.earned).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-paper paper-card border-2 border-ink/20 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-card border-b border-ink/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-saffron-light rounded-2xl text-saffron border border-saffron/30">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-display font-black text-xl sm:text-2xl text-ink">
                The Master Trick Book
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-ink-soft">
                {earnedCount} of {TRICK_SCROLLS.length} scrolls mastered in Practice
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 text-ink-muted hover:text-ink hover:bg-paper rounded-2xl transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-6 py-3 bg-paper-subtle/80 border-b border-ink/10 flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setSelectedGate('all')}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-display font-bold transition-all cursor-pointer ${
              selectedGate === 'all'
                ? 'bg-ink text-white shadow-warm font-black'
                : 'bg-card/90 text-ink-soft hover:bg-card border border-ink/10'
            }`}
          >
            All Tricks ({TRICK_SCROLLS.length})
          </button>
          {[1, 2, 3].map(g => (
            <button
              key={g}
              type="button"
              onClick={() => setSelectedGate(g as GateId)}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-display font-bold transition-all cursor-pointer ${
                selectedGate === g
                  ? 'bg-saffron text-white shadow-warm font-black drop-shadow-xs'
                  : 'bg-card/90 text-ink-soft hover:bg-card border border-ink/10'
              }`}
            >
              Gate {g} ({g === 1 ? 'Spark' : g === 2 ? 'Flow' : 'Master'})
            </button>
          ))}
        </div>

        {/* Content Body: Left List, Right Detail */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
          {/* Scroll List */}
          <div className="w-full md:w-1/2 p-4 overflow-y-auto space-y-2.5 border-b md:border-b-0 md:border-r border-ink/10">
            {filteredScrolls.map(scroll => {
              const status = unlockedScrolls[scroll.id];
              const isEarned = status?.earned;
              const isSelected = activeScroll?.id === scroll.id;

              return (
                <button
                  key={scroll.id}
                  type="button"
                  onClick={() => setActiveScroll(scroll)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-card border-2 border-saffron shadow-warm scale-[1.01]'
                      : 'bg-card/70 hover:bg-card border-ink/10'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isEarned
                          ? 'bg-teal-light text-teal'
                          : 'bg-paper-subtle text-ink-muted'
                      }`}
                    >
                      {isEarned ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-ink-muted font-bold">
                          {scroll.id}
                        </span>
                        {scroll.sutraLabel && (
                          <span className="text-xs text-teal font-semibold italic truncate">
                            ({scroll.sutraLabel})
                          </span>
                        )}
                      </div>
                      <div className="font-display font-bold text-sm sm:text-base text-ink truncate mt-0.5">
                        {scroll.name}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-black uppercase shrink-0 ${
                      scroll.rarity === 'legendary'
                        ? 'bg-master-light text-master'
                        : scroll.rarity === 'rare'
                        ? 'bg-teal-light text-teal'
                        : 'bg-saffron-light text-saffron-dark'
                    }`}
                  >
                    {scroll.rarity}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Scroll Detail View */}
          <div className="flex-1 p-6 sm:p-8 overflow-y-auto bg-card flex flex-col justify-between">
            {activeScroll ? (
              <div className="space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs sm:text-sm font-bold text-saffron uppercase tracking-wider">
                      Gate {activeScroll.gate} · {activeScroll.id}
                    </span>
                    <h3 className="font-display font-black text-2xl sm:text-3xl text-ink mt-0.5">
                      {activeScroll.name}
                    </h3>
                    {activeScroll.sutraLabel && (
                      <p className="font-display text-sm sm:text-base text-teal font-bold italic mt-0.5">
                        Sutra: {activeScroll.sutraLabel}
                      </p>
                    )}
                  </div>

                  <div className="p-3 bg-paper rounded-2xl border border-ink/10">
                    <Sparkles className="w-6 h-6 text-saffron" />
                  </div>
                </div>

                {/* Status Callout */}
                <div
                  className={`p-4 rounded-2xl border-2 flex items-center gap-3 ${
                    unlockedScrolls[activeScroll.id]?.earned
                      ? 'bg-teal-light text-teal-hover border-teal/40'
                      : 'bg-paper-subtle text-ink-soft border-ink/10'
                  }`}
                >
                  {unlockedScrolls[activeScroll.id]?.earned ? (
                    <>
                      <CheckCircle2 className="w-6 h-6 shrink-0 text-teal" />
                      <span className="text-sm font-bold">
                        Mastered! You solved questions with this trick 3+ times.
                      </span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-6 h-6 shrink-0 text-ink-muted" />
                      <span className="text-sm font-semibold">
                        Solve 3 practice questions using this shortcut to unlock its Master Scroll!
                      </span>
                    </>
                  )}
                </div>

                {/* Rule in One Line */}
                <div className="p-5 bg-paper rounded-2xl border border-ink/10 space-y-1.5">
                  <h4 className="font-display font-black text-xs sm:text-sm uppercase tracking-wider text-ink-muted">
                    The Rule in One Line
                  </h4>
                  <p className="font-body text-base sm:text-lg text-ink font-bold leading-relaxed">
                    {activeScroll.rule}
                  </p>
                </div>

                {/* Verified Example */}
                <div className="p-5 bg-paper-subtle rounded-2xl border border-ink/10 space-y-1.5">
                  <h4 className="font-display font-black text-xs sm:text-sm uppercase tracking-wider text-ink-muted">
                    Verified Example
                  </h4>
                  <p className="font-mono text-lg sm:text-xl text-ink font-black leading-relaxed">
                    {activeScroll.example}
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-ink-muted text-base font-semibold">
                Select a scroll to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

