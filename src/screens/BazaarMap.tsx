import React from 'react';
import {
  Lock,
  CheckCircle2,
  Star,
  Sparkles,
  ArrowRight,
  Shield,
  BookOpen,
  Award,
} from 'lucide-react';
import { GateId, Phase } from '../engine/types';
import { GATES } from '../content/gatesData';
import { ProgressV1 } from '../services/store';

interface BazaarMapProps {
  progress: ProgressV1;
  onSelectGate: (gate: GateId, phase?: Phase) => void;
  onOpenTrickBook: () => void;
  onOpenQuickCheck: () => void;
  onNavigateReflect: () => void;
}

export const BazaarMap: React.FC<BazaarMapProps> = ({
  progress,
  onSelectGate,
  onOpenTrickBook,
  onOpenQuickCheck,
  onNavigateReflect,
}) => {
  const isGate2Unlocked =
    progress.gates[1].guardianPassed ||
    progress.gates[2].wonderSeen ||
    progress.gates[2].guardianPassed;

  const isGate3Unlocked =
    progress.gates[2].guardianPassed ||
    progress.gates[3].wonderSeen ||
    progress.gates[3].guardianPassed;

  const gateStatuses: Record<GateId, { unlocked: boolean; stars: number; guardianPassed: boolean }> = {
    1: {
      unlocked: true,
      stars: progress.gates[1].worlds.reduce((acc, w) => acc + (w?.stars || 0), 0),
      guardianPassed: progress.gates[1].guardianPassed,
    },
    2: {
      unlocked: isGate2Unlocked,
      stars: progress.gates[2].worlds.reduce((acc, w) => acc + (w?.stars || 0), 0),
      guardianPassed: progress.gates[2].guardianPassed,
    },
    3: {
      unlocked: isGate3Unlocked,
      stars: progress.gates[3].worlds.reduce((acc, w) => acc + (w?.stars || 0), 0),
      guardianPassed: progress.gates[3].guardianPassed,
    },
  };

  const totalStars = Object.values(gateStatuses).reduce((acc, s) => acc + s.stars, 0);
  const earnedScrolls = Object.values(progress.scrolls).filter(s => s.earned).length;

  const gateImages: Record<GateId, string> = {
    1: './images/gate1_spark.jpg',
    2: './images/gate2_flow.jpg',
    3: './images/gate3_master.jpg',
  };

  return (
    <div className="min-h-full p-4 sm:p-8 max-w-5xl mx-auto flex flex-col justify-between overflow-y-auto">
      {/* Top Street Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-ink/10">
        <div>
          <span className="font-display font-extrabold text-xs sm:text-sm uppercase tracking-wider text-saffron flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-saffron" /> Grand Calculation Bazaar
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-ink mt-0.5">
            Choose Your Market Gate
          </h2>
          <p className="text-sm sm:text-base text-ink-soft font-normal">
            Progress through the 3 Gates, conquer the Guardian bosses, and master mental math.
          </p>
        </div>

        {/* Bazaar Stats Pill */}
        <div className="flex items-center gap-3 bg-card px-5 py-3 rounded-2xl border-2 border-ink/15 shadow-sm shrink-0">
          <div className="flex items-center gap-2 pr-3.5 border-r border-ink/10">
            <Star className="w-5 h-5 fill-sun text-sun" />
            <span className="font-mono text-base font-black text-ink">{totalStars}/45</span>
          </div>
          <button
            type="button"
            onClick={onOpenTrickBook}
            className="flex items-center gap-2 text-xs sm:text-sm font-display font-black text-ink hover:text-saffron transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-saffron" />
            <span>{earnedScrolls}/32 Scrolls</span>
          </button>
        </div>
      </div>

      {/* Market Stalls (3 Gates Grid) */}
      <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(gateNum => {
          const gId = gateNum as GateId;
          const gateData = GATES[gId];
          const status = gateStatuses[gId];
          const isUnlocked = status.unlocked;

          return (
            <div
              key={gId}
              className={`relative paper-card-interactive flex flex-col justify-between p-5 sm:p-6 transition-all duration-300 group ${
                isUnlocked ? 'bg-card shadow-warm-lg' : 'bg-card/60 opacity-80'
              }`}
            >
              {/* Gate Visual Artwork Banner */}
              <div className="relative w-full h-40 sm:h-48 rounded-2xl overflow-hidden mb-4 border-2 border-ink/10 shadow-sm">
                <img
                  src={gateImages[gId]}
                  alt={gateData.name}
                  className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                    !isUnlocked ? 'grayscale-[0.6] contrast-[0.9]' : ''
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex items-end justify-between p-3.5">
                  <span
                    className="font-mono text-xs font-black px-3 py-1 rounded-full uppercase text-white shadow-md border border-white/20"
                    style={{ backgroundColor: isUnlocked ? gateData.accentColor : '#64748B' }}
                  >
                    Gate {gId}
                  </span>

                  <div className="flex items-center gap-1">
                    {status.guardianPassed ? (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500 text-white rounded-full text-xs font-black shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                      </span>
                    ) : !isUnlocked ? (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 bg-slate-800 text-slate-200 rounded-full text-xs font-bold border border-white/20">
                        <Lock className="w-3.5 h-3.5" /> Locked
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 bg-amber-400 text-amber-950 font-black rounded-full text-xs shadow-sm">
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1 mb-5 flex-1">
                <h3 className="font-display font-black text-2xl sm:text-3xl text-ink">
                  {gateData.name}
                </h3>
                <p className="font-body text-xs sm:text-sm text-ink-muted italic">
                  {gateData.tagline}
                </p>
                <div className="flex items-center gap-2 pt-2.5">
                  <Star className="w-5 h-5 fill-sun text-sun" />
                  <span className="font-mono text-base font-black text-ink">
                    {status.stars} / 15 Stars
                  </span>
                </div>
              </div>

              {/* Phase Quick Links or Lock Notice */}
              {isUnlocked ? (
                <div className="space-y-2.5 pt-4 border-t-2 border-ink/10">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectGate(gId, 'wonder')}
                      className="px-2.5 py-2 bg-paper hover:bg-paper-subtle text-ink text-xs sm:text-sm font-display font-bold rounded-xl border border-ink/15 transition-colors"
                    >
                      1. Wonder
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectGate(gId, 'story')}
                      className="px-2.5 py-2 bg-paper hover:bg-paper-subtle text-ink text-xs sm:text-sm font-display font-bold rounded-xl border border-ink/15 transition-colors"
                    >
                      2. Story
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectGate(gId, 'simulate')}
                      className="px-2.5 py-2 bg-paper hover:bg-paper-subtle text-ink text-xs sm:text-sm font-display font-bold rounded-xl border border-ink/15 transition-colors"
                    >
                      3. Simulate
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectGate(gId, 'practice')}
                      className="px-2.5 py-2 bg-paper hover:bg-paper-subtle text-ink text-xs sm:text-sm font-display font-bold rounded-xl border border-ink/15 transition-colors flex items-center justify-center gap-1"
                    >
                      <span>4. Practice</span>
                      <Shield className="w-3.5 h-3.5 text-saffron" />
                    </button>
                  </div>

                  {/* Primary Enter CTA */}
                  <button
                    type="button"
                    onClick={() => onSelectGate(gId)}
                    className="w-full mt-2 py-3.5 bg-gradient-to-r from-ink to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-display font-black text-base sm:text-lg rounded-2xl shadow-warm flex items-center justify-center gap-2.5 transition-all active:scale-95"
                  >
                    <span>Enter Gate {gId}</span>
                    <ArrowRight className="w-5 h-5 text-saffron" />
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t-2 border-ink/10 text-center space-y-2">
                  <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                    {gId === 2
                      ? 'Defeat Gate 1 Guardian (Click Bot) to unlock Flow.'
                      : 'Defeat Gate 2 Guardian to unlock Master.'}
                  </p>
                  <button
                    type="button"
                    onClick={onOpenQuickCheck}
                    className="text-xs sm:text-sm text-saffron hover:underline font-display font-black block mx-auto"
                  >
                    Take Quick Check to unlock early
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Hub Actions: Final Reflect & Certificate link */}
      <div className="p-6 bg-card paper-card border-2 border-ink/15 shadow-warm-lg flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-master-light text-master rounded-2xl shrink-0">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-display font-black text-base sm:text-lg text-ink">
              Final Reflection & Mental Math Certificate
            </h4>
            <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
              Teach Ganu, view your 15-world stars report, and claim your verified diploma.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onNavigateReflect}
          className="px-6 py-3.5 bg-paper hover:bg-paper-subtle border-2 border-ink/20 text-ink font-display font-black text-sm sm:text-base rounded-2xl shadow-sm flex items-center gap-2.5 transition-all shrink-0 active:scale-95"
        >
          <span>Open Reflect Phase</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
