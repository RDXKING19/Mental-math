import React, { useState, useEffect } from 'react';
import { ArrowRight, RotateCcw, CheckCircle, Sparkles, Volume2 } from 'lucide-react';
import { playStep, playCorrect, speakNarration, stopNarration } from '../services/audio';

interface NumberLineHopperProps {
  start?: number;
  hopTens?: number;
  hopOnes?: number;
  soundEnabled?: boolean;
  onComplete?: () => void;
  className?: string;
}

export const NumberLineHopper: React.FC<NumberLineHopperProps> = ({
  start = 58,
  hopTens = 20,
  hopOnes = 7,
  soundEnabled = true,
  onComplete,
  className = '',
}) => {
  const [stage, setStage] = useState<0 | 1 | 2>(0); // 0 = start, 1 = tens hopped, 2 = ones hopped
  const [isJumping, setIsJumping] = useState(false);

  const mid = start + hopTens;
  const target = start + hopTens + hopOnes;

  // Hopper avatar position X coordinate on the SVG axis
  const hopperPositions = [80, 260, 420];

  // Stop narration on unmount
  useEffect(() => {
    return () => {
      stopNarration();
    };
  }, []);

  const handleHopTens = () => {
    if (stage !== 0) return;
    setIsJumping(true);
    playStep(soundEnabled);
    setTimeout(() => {
      setStage(1);
      setIsJumping(false);
      speakNarration(
        `Hopped plus ${hopTens}! ${start} plus ${hopTens} equals ${mid}. Now hop the ones!`,
        !soundEnabled
      );
    }, 350);
  };

  const handleHopOnes = () => {
    if (stage !== 1) return;
    setIsJumping(true);
    playCorrect(soundEnabled);
    setTimeout(() => {
      setStage(2);
      setIsJumping(false);
      speakNarration(
        `Hopped plus ${hopOnes}! ${mid} plus ${hopOnes} equals ${target}. Target reached!`,
        !soundEnabled
      );
      onComplete?.();
    }, 350);
  };

  const handleReset = () => {
    stopNarration();
    playStep(soundEnabled);
    setStage(0);
    setIsJumping(false);
  };

  const handleGuideMe = () => {
    speakNarration(
      'Welcome to the Number Line Hopper! Mental math is easier when you jump in friendly chunks. First, click Jump Tens to make a big forward leap of friendly tens. Then click Jump Ones to make the final quick hop to your answer!',
      !soundEnabled
    );
  };

  return (
    <div className={`p-5 sm:p-7 bg-card paper-card border-2 border-ink/15 shadow-warm ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <span className="font-display font-black text-xs sm:text-sm uppercase tracking-wider text-teal flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-saffron" /> Number Line Hopper
          </span>
          <h3 className="font-mono font-black text-2xl sm:text-3xl text-ink mt-0.5">
            {start} + {hopTens + hopOnes}
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-ink-soft">
            Jump in friendly chunks: first big tens (+{hopTens}), then quick ones (+{hopOnes})!
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Guide Me voice narration */}
          <button
            type="button"
            onClick={handleGuideMe}
            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-full font-display font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
            title="Listen to how Number Line Hopper works"
          >
            <Volume2 className="w-4 h-4 text-amber-600" />
            <span>Guide Me</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-2.5 text-ink-muted hover:text-ink hover:bg-paper rounded-2xl border border-ink/10 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            title="Reset Hops"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* SVG Interactive Line with Hopper */}
      <div className="relative w-full h-52 sm:h-56 bg-paper rounded-2xl p-4 border border-ink/10 flex flex-col justify-end overflow-visible select-none">
        <svg viewBox="0 0 500 135" className="w-full h-full overflow-visible">
          {/* Main Axis Line */}
          <line x1="30" y1="95" x2="470" y2="95" stroke="#1F2A5A" strokeWidth="4" strokeLinecap="round" />

          {/* Tick 1: Start (80) */}
          <line x1="80" y1="80" x2="80" y2="110" stroke="#1F2A5A" strokeWidth="3.5" strokeLinecap="round" />
          <text x="80" y="128" textAnchor="middle" fill="#1F2A5A" className="font-mono text-base sm:text-lg font-black">
            {start}
          </text>
          <circle
            cx="80"
            cy="95"
            r="7"
            fill="#F59E0B"
            className="cursor-pointer hover:scale-125 transition-transform"
            onClick={stage === 0 ? handleHopTens : undefined}
          />

          {/* Hop 1 Arch: + Tens */}
          {stage >= 1 && (
            <g className="animate-in fade-in zoom-in duration-300">
              <path
                d="M 80 90 Q 170 12 260 90"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="4.5"
                strokeDasharray="7 4"
              />
              <rect x="135" y="14" width="70" height="26" rx="8" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
              <text x="170" y="32" textAnchor="middle" fill="#B45309" className="font-mono font-black text-sm sm:text-base">
                +{hopTens}
              </text>
            </g>
          )}

          {/* Tick 2: Mid (260) */}
          <line x1="260" y1="80" x2="260" y2="110" stroke="#1F2A5A" strokeWidth="3.5" strokeLinecap="round" />
          <text
            x="260"
            y="128"
            textAnchor="middle"
            fill={stage >= 1 ? '#059669' : '#828EAA'}
            className="font-mono text-base sm:text-lg font-black"
          >
            {stage >= 1 ? mid : '?'}
          </text>
          <circle
            cx="260"
            cy="95"
            r="7"
            fill={stage >= 1 ? '#059669' : '#CBD5E1'}
            className={stage === 1 ? 'cursor-pointer hover:scale-125 transition-transform animate-pulse' : ''}
            onClick={stage === 1 ? handleHopOnes : undefined}
          />

          {/* Hop 2 Arch: + Ones */}
          {stage >= 2 && (
            <g className="animate-in fade-in zoom-in duration-300">
              <path
                d="M 260 90 Q 340 30 420 90"
                fill="none"
                stroke="#059669"
                strokeWidth="4.5"
                strokeDasharray="5 3"
              />
              <rect x="312" y="24" width="56" height="24" rx="8" fill="#D1FAE5" stroke="#059669" strokeWidth="1.5" />
              <text x="340" y="41" textAnchor="middle" fill="#047857" className="font-mono font-black text-sm sm:text-base">
                +{hopOnes}
              </text>
            </g>
          )}

          {/* Tick 3: Destination Target (420) */}
          <line x1="420" y1="80" x2="420" y2="110" stroke="#1F2A5A" strokeWidth="3.5" strokeLinecap="round" />
          <text
            x="420"
            y="128"
            textAnchor="middle"
            fill={stage >= 2 ? '#059669' : '#828EAA'}
            className="font-mono text-base sm:text-lg font-black"
          >
            {stage >= 2 ? target : '?'}
          </text>
          <circle
            cx="420"
            cy="95"
            r={stage >= 2 ? 9 : 7}
            fill={stage >= 2 ? '#059669' : '#CBD5E1'}
          />

          {/* Animated Hopper Character */}
          <g
            transform={`translate(${hopperPositions[stage]}, ${isJumping ? 30 : 70})`}
            className="transition-all duration-300 ease-out"
          >
            {/* Cute Frog/Hopper Marker */}
            <circle cx="0" cy="0" r="14" fill="#10B981" stroke="#065F46" strokeWidth="2.5" />
            <circle cx="-4" cy="-3" r="3" fill="#FFFFFF" />
            <circle cx="-4" cy="-3" r="1.5" fill="#065F46" />
            <circle cx="4" cy="-3" r="3" fill="#FFFFFF" />
            <circle cx="4" cy="-3" r="1.5" fill="#065F46" />
            {/* Smile */}
            <path d="M -5 4 Q 0 8 5 4" fill="none" stroke="#065F46" strokeWidth="1.5" strokeLinecap="round" />
            {/* Crown / Sparkle */}
            <polygon points="0,-18 -4,-12 4,-12" fill="#F59E0B" />
          </g>
        </svg>
      </div>

      {/* Step Breakdown Cards */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div
          className={`p-3.5 rounded-2xl border transition-all ${
            stage >= 1
              ? 'bg-amber-50/80 border-amber-300 shadow-sm'
              : 'bg-paper/50 border-ink/10 opacity-70'
          }`}
        >
          <span className="text-xs uppercase font-extrabold text-amber-700 block">
            Step 1 · Tens Jump (+{hopTens})
          </span>
          <div className="font-mono text-lg sm:text-xl font-black text-ink mt-0.5">
            {start} + {hopTens} = {stage >= 1 ? mid : '?'}
          </div>
        </div>

        <div
          className={`p-3.5 rounded-2xl border transition-all ${
            stage >= 2
              ? 'bg-emerald-50/80 border-emerald-300 shadow-sm'
              : 'bg-paper/50 border-ink/10 opacity-70'
          }`}
        >
          <span className="text-xs uppercase font-extrabold text-emerald-700 block">
            Step 2 · Ones Jump (+{hopOnes})
          </span>
          <div className="font-mono text-lg sm:text-xl font-black text-ink mt-0.5">
            {stage >= 1 ? mid : 'Mid'} + {hopOnes} = {stage >= 2 ? target : '?'}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {stage === 0 && (
          <button
            type="button"
            onClick={handleHopTens}
            className="w-full sm:w-auto px-7 py-3.5 bg-saffron hover:bg-saffron-hover text-white font-display font-black text-base sm:text-lg rounded-2xl shadow-warm flex items-center justify-center gap-2.5 transition-all active:scale-95 cursor-pointer drop-shadow-sm"
          >
            <span>Jump Tens (+{hopTens})</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}

        {stage === 1 && (
          <button
            type="button"
            onClick={handleHopOnes}
            className="w-full sm:w-auto px-7 py-3.5 bg-teal hover:bg-teal-hover text-white font-display font-black text-base sm:text-lg rounded-2xl shadow-warm flex items-center justify-center gap-2.5 transition-all active:scale-95 animate-pulse cursor-pointer"
          >
            <span>Jump Ones (+{hopOnes})</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}

        {stage === 2 && (
          <div className="p-4 bg-teal-light rounded-2xl border border-teal/30 flex items-center justify-center gap-3 text-teal font-display font-black text-base sm:text-lg animate-in zoom-in-95 duration-200">
            <CheckCircle className="w-6 h-6 text-teal shrink-0" />
            <span>Success! Hopper reached {target}!</span>
          </div>
        )}
      </div>
    </div>
  );
};
