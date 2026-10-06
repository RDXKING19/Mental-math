import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, RotateCcw, CheckCircle, Volume2 } from 'lucide-react';
import { playStep, playCorrect, speakNarration, stopNarration } from '../services/audio';

interface CrossGridVisualProps {
  a?: number; // e.g. 23
  b?: number; // e.g. 14
  soundEnabled?: boolean;
  onComplete?: () => void;
  className?: string;
}

export const CrossGridVisual: React.FC<CrossGridVisualProps> = ({
  a = 23,
  b = 14,
  soundEnabled = true,
  onComplete,
  className = '',
}) => {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0); // 0=start, 1=right vertical, 2=crosswise, 3=left vertical + carry

  const aTens = Math.floor(a / 10);
  const aOnes = a % 10;
  const bTens = Math.floor(b / 10);
  const bOnes = b % 10;

  const right = aOnes * bOnes; // 12
  const cross = aTens * bOnes + aOnes * bTens; // 8 + 3 = 11
  const left = aTens * bTens; // 2
  const answer = a * b; // 322

  // Stop narration on unmount
  useEffect(() => {
    return () => {
      stopNarration();
    };
  }, []);

  const handleNext = () => {
    if (step === 0) {
      playStep(soundEnabled);
      setStep(1);
      speakNarration(
        `Step 1: Multiply the right units vertically. ${aOnes} times ${bOnes} equals ${right}.`,
        !soundEnabled
      );
    } else if (step === 1) {
      playStep(soundEnabled);
      setStep(2);
      speakNarration(
        `Step 2: Cross-multiply and sum. (${aTens} times ${bOnes}) plus (${aOnes} times ${bTens}) equals ${cross}.`,
        !soundEnabled
      );
    } else if (step === 2) {
      playCorrect(soundEnabled);
      setStep(3);
      speakNarration(
        `Step 3: Multiply left tens: ${aTens} times ${bTens} equals ${left}. Regrouping carries gives final answer ${answer}! Solved!`,
        !soundEnabled
      );
      onComplete?.();
    }
  };

  const handleReset = () => {
    stopNarration();
    playStep(soundEnabled);
    setStep(0);
  };

  const handleGuideMe = () => {
    speakNarration(
      'Welcome to Urdhva Tiryagbhyam, the vertical and crosswise multiplication method! Step 1: Multiply the right units digits vertically. Step 2: Cross-multiply and sum the products. Step 3: Multiply the left tens digits vertically. Then combine with carries to write the answer in one single line!',
      !soundEnabled
    );
  };

  return (
    <div className={`p-5 sm:p-7 bg-card paper-card border-2 border-ink/15 shadow-warm ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <span className="font-display font-black text-xs sm:text-sm uppercase tracking-wider text-teal flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-saffron" /> Urdhva-Tiryagbhyam (Vertical & Crosswise)
          </span>
          <h3 className="font-mono font-black text-2xl sm:text-3xl text-ink mt-0.5">
            {a} × {b}
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-ink-soft">
            Multiply 2-digit numbers in one mental line: Right · Cross · Left!
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Guide Me voice narration */}
          <button
            type="button"
            onClick={handleGuideMe}
            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-full font-display font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
            title="Listen to how Vertical & Crosswise works"
          >
            <Volume2 className="w-4 h-4 text-amber-600" />
            <span>Guide Me</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-2.5 text-ink-muted hover:text-ink hover:bg-paper rounded-2xl border border-ink/10 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            title="Reset Visualizer"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Visual Criss-Cross Display */}
      <div className="relative w-full h-52 sm:h-56 bg-paper rounded-2xl p-4 border border-ink/10 flex items-center justify-center select-none">
        <svg viewBox="0 0 260 150" className="w-full h-full overflow-visible">
          {/* Digits of a */}
          <rect x="50" y="20" width="46" height="42" rx="10" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          <text x="73" y="49" textAnchor="middle" fill="#0F172A" className="font-mono text-2xl sm:text-3xl font-black">
            {aTens}
          </text>

          <rect x="160" y="20" width="46" height="42" rx="10" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          <text x="183" y="49" textAnchor="middle" fill="#0F172A" className="font-mono text-2xl sm:text-3xl font-black">
            {aOnes}
          </text>

          {/* Digits of b */}
          <rect x="50" y="90" width="46" height="42" rx="10" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          <text x="73" y="119" textAnchor="middle" fill="#0F172A" className="font-mono text-2xl sm:text-3xl font-black">
            {bTens}
          </text>

          <rect x="160" y="90" width="46" height="42" rx="10" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          <text x="183" y="119" textAnchor="middle" fill="#0F172A" className="font-mono text-2xl sm:text-3xl font-black">
            {bOnes}
          </text>

          {/* Step 1: Right Vertical Line */}
          {step >= 1 && (
            <line
              x1="183"
              y1="64"
              x2="183"
              y2="88"
              stroke="#F59E0B"
              strokeWidth="5"
              strokeLinecap="round"
              className="animate-in fade-in duration-300"
            />
          )}

          {/* Step 2: Crosswise Lines */}
          {step >= 2 && (
            <g className="animate-in fade-in duration-300">
              <line x1="85" y1="64" x2="170" y2="88" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
              <line x1="170" y1="64" x2="85" y2="88" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
            </g>
          )}

          {/* Step 3: Left Vertical Line */}
          {step >= 3 && (
            <line
              x1="73"
              y1="64"
              x2="73"
              y2="88"
              stroke="#6366F1"
              strokeWidth="5"
              strokeLinecap="round"
              className="animate-in fade-in duration-300"
            />
          )}
        </svg>
      </div>

      {/* Step Working Cards */}
      <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-2.5">
        {/* Left Column */}
        <div
          className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all ${
            step >= 3 ? 'bg-indigo-50/80 border-indigo-300 shadow-sm' : 'bg-paper/50 border-ink/10 opacity-60'
          }`}
        >
          <span className="text-[10px] sm:text-xs uppercase font-extrabold text-indigo-700 block">
            3. Left Vert
          </span>
          <div className="font-mono text-xs sm:text-base font-black text-ink mt-0.5">
            {aTens} × {bTens} = {left}
          </div>
        </div>

        {/* Crosswise Column */}
        <div
          className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all ${
            step >= 2 ? 'bg-emerald-50/80 border-emerald-300 shadow-sm' : 'bg-paper/50 border-ink/10 opacity-60'
          }`}
        >
          <span className="text-[10px] sm:text-xs uppercase font-extrabold text-emerald-700 block">
            2. Criss-Cross
          </span>
          <div className="font-mono text-[9px] sm:text-xs md:text-sm font-black text-ink mt-0.5 break-words">
            ({aTens}×{bOnes}) + ({aOnes}×{bTens}) = {cross}
          </div>
        </div>

        {/* Right Column */}
        <div
          className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all ${
            step >= 1 ? 'bg-amber-50/80 border-amber-300 shadow-sm' : 'bg-paper/50 border-ink/10 opacity-60'
          }`}
        >
          <span className="text-[10px] sm:text-xs uppercase font-extrabold text-amber-700 block">
            1. Right Vert
          </span>
          <div className="font-mono text-xs sm:text-base font-black text-ink mt-0.5">
            {aOnes} × {bOnes} = {right}
          </div>
        </div>
      </div>

      {/* Step 3 Carry Accumulation Banner */}
      {step >= 3 && (
        <div className="mt-4 p-4 bg-teal-light rounded-2xl border-2 border-teal/40 flex items-center justify-between animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-teal shrink-0" />
            <div>
              <span className="font-display font-black text-xs sm:text-sm uppercase tracking-wider text-teal block">
                Regrouping Carries to Finish
              </span>
              <p className="font-mono text-xs sm:text-sm text-ink-soft font-semibold">
                Right: {right} (write 2, carry 1) → Middle: {cross} + 1 = 12 (write 2, carry 1) → Left: {left} + 1 = 3
              </p>
              <div className="font-mono text-2xl sm:text-3xl font-black text-teal mt-0.5">
                Answer = {answer}
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-card rounded-xl border border-teal/20 text-teal text-xs font-black">
            <CheckCircle className="w-4 h-4" /> Solved!
          </div>
        </div>
      )}

      {/* Step Advance Button */}
      {step < 3 && (
        <button
          type="button"
          onClick={handleNext}
          className="w-full mt-4 py-4 bg-saffron hover:bg-saffron-hover text-white font-display font-black text-base sm:text-lg rounded-2xl shadow-warm flex items-center justify-center gap-2.5 transition-all active:scale-98 cursor-pointer drop-shadow-sm"
        >
          <span>
            {step === 0
              ? 'Calculate Right Column'
              : step === 1
              ? 'Calculate Crosswise Sum'
              : 'Calculate Left Column & Carry'}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
