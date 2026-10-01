import React, { useState } from 'react';
import { ArrowRight, Sparkles, Scale, RotateCcw, CheckCircle } from 'lucide-react';
import { playStep, playCorrect } from '../services/audio';

interface BaseBalanceProps {
  a?: number; // e.g. 97
  b?: number; // e.g. 94
  soundEnabled?: boolean;
  onComplete?: () => void;
  className?: string;
}

export const BaseBalance: React.FC<BaseBalanceProps> = ({
  a = 97,
  b = 94,
  soundEnabled = true,
  onComplete,
  className = '',
}) => {
  const [step, setStep] = useState<0 | 1 | 2>(0);

  const da = 100 - a; // 3
  const db = 100 - b; // 6
  const leftPart = a - db; // 91
  const rightPart = da * db; // 18
  const answer = a * b; // 9118

  const handleNextStep = () => {
    if (step === 0) {
      playStep(soundEnabled);
      setStep(1);
    } else if (step === 1) {
      playCorrect(soundEnabled);
      setStep(2);
      onComplete?.();
    }
  };

  const handleReset = () => {
    playStep(soundEnabled);
    setStep(0);
  };

  // Rotation angles for scale beam:
  // Step 0: tilted (unsolved)
  // Step 1: slight tilt
  // Step 2: perfectly balanced (0 deg)
  const beamAngle = step === 0 ? -5 : step === 1 ? -2 : 0;

  return (
    <div className={`p-5 sm:p-7 bg-card paper-card border-2 border-ink/15 shadow-warm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="font-display font-black text-xs sm:text-sm uppercase tracking-wider text-teal flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-teal" /> Nikhilam Base Balance (Base 100)
          </span>
          <h3 className="font-mono font-black text-2xl sm:text-3xl text-ink mt-0.5">
            {a} × {b}
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-ink-soft">
            Both numbers are close to 100! Weigh their deficits to calculate in seconds.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="p-2.5 text-ink-muted hover:text-ink hover:bg-paper rounded-2xl border border-ink/10 transition-all flex items-center gap-1.5 text-xs font-bold"
          title="Reset Balance"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* SVG Balance Scale Display with Physics Tilt */}
      <div className="relative w-full h-56 sm:h-64 bg-paper rounded-2xl p-4 border border-ink/10 flex items-center justify-center overflow-visible select-none">
        <svg viewBox="0 0 420 180" className="w-full h-full overflow-visible">
          {/* Central Fulcrum Stand */}
          <polygon points="210,95 185,160 235,160" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          <circle cx="210" cy="95" r="8" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
          
          {/* Base 100 Fulcrum Plaque */}
          <rect x="175" y="145" width="70" height="22" rx="6" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
          <text x="210" y="160" textAnchor="middle" fill="#92400E" className="font-mono font-black text-xs sm:text-sm">
            BASE 100
          </text>

          {/* Rotating Beam and Pans */}
          <g
            transform={`rotate(${beamAngle}, 210, 95)`}
            className="transition-transform duration-500 ease-out"
          >
            {/* Balance Beam */}
            <line x1="60" y1="95" x2="360" y2="95" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />

            {/* Left Pan: Number a */}
            <g transform="translate(90, 95)">
              <line x1="0" y1="0" x2="0" y2="35" stroke="#64748B" strokeWidth="2.5" />
              <ellipse cx="0" cy="40" rx="42" ry="10" fill="#CBD5E1" stroke="#334155" strokeWidth="2" />
              {/* Number a Box */}
              <rect x="-30" y="3" width="60" height="34" rx="8" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
              <text x="0" y="26" textAnchor="middle" fill="#0F172A" className="font-mono font-black text-lg sm:text-xl">
                {a}
              </text>
              {/* Deficit Badge Above */}
              <rect x="-24" y="-36" width="48" height="24" rx="6" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5" />
              <text x="0" y="-20" textAnchor="middle" fill="#B91C1C" className="font-mono font-black text-xs sm:text-sm">
                −{da}
              </text>
            </g>

            {/* Right Pan: Number b */}
            <g transform="translate(330, 95)">
              <line x1="0" y1="0" x2="0" y2="35" stroke="#64748B" strokeWidth="2.5" />
              <ellipse cx="0" cy="40" rx="42" ry="10" fill="#CBD5E1" stroke="#334155" strokeWidth="2" />
              {/* Number b Box */}
              <rect x="-30" y="3" width="60" height="34" rx="8" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
              <text x="0" y="26" textAnchor="middle" fill="#0F172A" className="font-mono font-black text-lg sm:text-xl">
                {b}
              </text>
              {/* Deficit Badge Above */}
              <rect x="-24" y="-36" width="48" height="24" rx="6" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5" />
              <text x="0" y="-20" textAnchor="middle" fill="#B91C1C" className="font-mono font-black text-xs sm:text-sm">
                −{db}
              </text>
            </g>
          </g>

          {/* Cross-subtraction Arc Guide (Step >= 1) */}
          {step >= 1 && (
            <g className="animate-in fade-in zoom-in duration-300">
              <path
                d="M 120 70 Q 210 20 300 70"
                fill="none"
                stroke="#059669"
                strokeWidth="3.5"
                strokeDasharray="6 3"
              />
              <rect x="170" y="16" width="80" height="24" rx="6" fill="#D1FAE5" stroke="#059669" strokeWidth="1.5" />
              <text x="210" y="32" textAnchor="middle" fill="#047857" className="font-mono font-black text-xs sm:text-sm">
                {a} − {db} = {leftPart}
              </text>
            </g>
          )}

          {/* Balanced Seal (Step 2) */}
          {step === 2 && (
            <g className="animate-in zoom-in duration-300">
              <circle cx="210" cy="95" r="16" fill="#10B981" stroke="#FFFFFF" strokeWidth="3" />
              <text x="210" y="100" textAnchor="middle" fill="#FFFFFF" className="font-black text-xs">
                ✓
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Step Progress & Walkthrough Cards */}
      <div className="mt-5 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Left Part: Cross-subtract */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              step >= 1
                ? 'bg-emerald-50/80 border-emerald-300 shadow-sm'
                : 'bg-paper/50 border-ink/10 opacity-70'
            }`}
          >
            <span className="text-xs uppercase font-extrabold text-emerald-800 block">
              1. Cross-Subtract Deficit (Left Part)
            </span>
            <div className="font-mono text-xl sm:text-2xl font-black text-ink mt-0.5">
              {step >= 1 ? `${a} − ${db} = ${leftPart}` : `${a} − ${db} = ?`}
            </div>
            <span className="text-xs sm:text-sm font-semibold text-ink-soft">
              Or ({b} − {da} = {leftPart}) — both give the same number!
            </span>
          </div>

          {/* Right Part: Multiply Deficits */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              step >= 2
                ? 'bg-amber-50/80 border-amber-300 shadow-sm'
                : 'bg-paper/50 border-ink/10 opacity-70'
            }`}
          >
            <span className="text-xs uppercase font-extrabold text-amber-800 block">
              2. Multiply Deficits (Right Part)
            </span>
            <div className="font-mono text-xl sm:text-2xl font-black text-ink mt-0.5">
              {step >= 2 ? `${da} × ${db} = ${rightPart}` : `${da} × ${db} = ?`}
            </div>
            <span className="text-xs sm:text-sm font-semibold text-ink-soft">
              Always 2 digits for Base 100: ({String(rightPart).padStart(2, '0')})
            </span>
          </div>
        </div>

        {/* Final Concatenated Result */}
        {step >= 2 && (
          <div className="p-4 bg-teal-light rounded-2xl border-2 border-teal/40 flex items-center justify-between animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-teal shrink-0" />
              <div>
                <span className="font-display font-black text-xs sm:text-sm uppercase tracking-wider text-teal block">
                  Final Combined Product
                </span>
                <div className="font-mono text-3xl sm:text-4xl font-black text-ink mt-0.5">
                  <span className="text-teal font-extrabold">{leftPart}</span>
                  <span className="text-saffron font-extrabold">{String(rightPart).padStart(2, '0')}</span>
                  <span className="text-ink-soft text-base sm:text-lg font-bold ml-2.5">
                    (= {answer})
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-card rounded-xl border border-teal/20 text-teal text-xs font-black">
              <CheckCircle className="w-4 h-4" /> Balanced!
            </div>
          </div>
        )}

        {/* Interactive Action Button */}
        {step < 2 && (
          <button
            type="button"
            onClick={handleNextStep}
            className="w-full py-4 bg-teal hover:bg-teal-hover text-white font-display font-black text-base sm:text-lg rounded-2xl shadow-warm flex items-center justify-center gap-2.5 transition-all active:scale-98 cursor-pointer"
          >
            <span>
              {step === 0
                ? 'Step 1: Cross-Subtract for Left Part'
                : 'Step 2: Multiply Deficits for Right Part'}
            </span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

