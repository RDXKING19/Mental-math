import React from 'react';
import {
  Lock,
  Star,
  Shield,
  Play,
  ArrowRight,
  Bot,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { GateId } from '../../engine/types';
import { GATES } from '../../content/gatesData';
import { GateProgress } from '../../services/store';

interface PracticeSelectScreenProps {
  gate: GateId;
  gateProgress: GateProgress;
  onSelectWorld: (worldIndex: number) => void;
  onBackToMap: () => void;
}

export const PracticeSelectScreen: React.FC<PracticeSelectScreenProps> = ({
  gate,
  gateProgress,
  onSelectWorld,
  onBackToMap,
}) => {
  const gateData = GATES[gate];
  const worlds = gateData.worlds;

  const gateImages: Record<GateId, string> = {
    1: './images/gate1_spark.jpg',
    2: './images/gate2_flow.jpg',
    3: './images/gate3_master.jpg',
  };

  return (
    <div className="h-full max-w-5xl mx-auto p-4 sm:p-8 flex flex-col justify-between overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b-2 border-ink/10">
        <div>
          <span className="font-display font-black text-xs sm:text-sm uppercase tracking-wider text-saffron flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-saffron" /> Phase 4 · Practice Arena
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-ink mt-0.5">
            Gate {gate} Worlds: {gateData.name}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-ink-soft">
            Earn at least 1★ (4/10 correct) to unlock the next world. Beat the Guardian to advance!
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToMap}
          className="px-4 py-2 bg-paper hover:bg-paper-subtle border border-ink/15 rounded-2xl font-display font-bold text-xs sm:text-sm text-ink transition-all cursor-pointer"
        >
          Bazaar Map
        </button>
      </div>

      {/* Gate Artwork Banner */}
      <div className="relative w-full h-32 sm:h-44 rounded-2xl overflow-hidden my-3 border-2 border-ink/10 shadow-sm shrink-0">
        <img
          src={gateImages[gate]}
          alt={`Gate ${gate}: ${gateData.name}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end justify-between p-4">
          <span className="font-display font-black text-base sm:text-xl text-white drop-shadow-md">
            {gateData.tagline}
          </span>
          <span className="px-3 py-1 bg-amber-400 text-ink font-display font-black text-xs uppercase tracking-wider rounded-full shadow-md">
            5 Worlds
          </span>
        </div>
      </div>

      {/* 5 Worlds Grid */}
      <div className="my-auto py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {worlds.map((world, idx) => {
          const worldProg = gateProgress.worlds[idx];
          const stars = worldProg?.stars || 0;

          // Unlock logic: World 0 is always unlocked. World n is unlocked if world n-1 has >= 1 star.
          const isUnlocked =
            idx === 0 ||
            (gateProgress.worlds[idx - 1] && (gateProgress.worlds[idx - 1]?.stars || 0) >= 1);

          return (
            <div
              key={idx}
              className={`paper-card-interactive p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 ${
                world.isGuardian
                  ? 'sm:col-span-2 lg:col-span-2 bg-gradient-to-br from-card via-amber-500/10 to-saffron-light/40 border-2 border-saffron shadow-warm-lg'
                  : 'bg-card shadow-warm'
              } ${!isUnlocked ? 'opacity-60 bg-paper/50' : ''}`}
            >
              <div>
                <div className="flex items-start justify-between mb-2.5">
                  <span
                    className={`font-mono text-xs font-black px-2.5 py-1 rounded-full uppercase ${
                      world.isGuardian
                        ? 'bg-saffron text-white font-black drop-shadow-xs'
                        : 'bg-paper text-ink-muted'
                    }`}
                  >
                    {world.isGuardian ? 'Gate Guardian Duel' : `World ${idx + 1}`}
                  </span>

                  {/* Stars Display */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map(s => (
                      <Star
                        key={s}
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          s <= stars ? 'fill-sun text-sun' : 'text-ink/15'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  {world.isGuardian && (
                    <img
                      src="./images/click_bot.jpg"
                      alt="ClickBot"
                      className="w-12 h-12 rounded-xl object-cover border-2 border-saffron shadow-sm shrink-0"
                    />
                  )}
                  <div>
                    <h3 className="font-display font-black text-lg sm:text-xl text-ink">
                      {world.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-ink-soft mb-2">
                      {world.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-ink-muted">
                  <Zap className="w-3.5 h-3.5 text-saffron" />
                  <span>Mode: <strong className="text-ink uppercase">{world.mode}</strong></span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-ink/10 flex items-center justify-between">
                {isUnlocked ? (
                  <button
                    type="button"
                    onClick={() => onSelectWorld(idx)}
                    className={`w-full py-2.5 rounded-xl font-display font-bold text-sm shadow-warm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                      world.isGuardian
                        ? 'bg-saffron hover:bg-saffron-hover text-white font-black'
                        : 'bg-ink hover:bg-ink-soft text-white'
                    }`}
                  >
                    <span>{stars > 0 ? 'Replay World' : 'Play World'}</span>
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                ) : (
                  <div className="w-full py-2 text-center text-xs text-ink-muted font-display font-medium flex items-center justify-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Need 1★ in World {idx}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Summary Banner */}
      <div className="p-4 bg-card paper-card border border-ink/15 shadow-sm flex items-center justify-between text-xs text-ink-soft">
        <span className="flex items-center gap-1.5 font-medium">
          <Shield className="w-4 h-4 text-teal" />
          Passing the Gate Guardian (≥7/10) unlocks the next Gate!
        </span>
        <span className="font-mono font-bold text-ink">
          Total Gate Stars: {gateProgress.worlds.reduce((acc, w) => acc + (w?.stars || 0), 0)} / 15
        </span>
      </div>
    </div>
  );
};
