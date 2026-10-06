import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, RotateCcw, Play, Volume2 } from 'lucide-react';
import { playStep, playCorrect, speakNarration, stopNarration } from '../services/audio';

interface BeadRailProps {
  initialValue?: number;
  targetValue?: number;
  onTargetReached?: () => void;
  className?: string;
  soundEnabled?: boolean;
}

export const BeadRail: React.FC<BeadRailProps> = ({
  initialValue = 47,
  targetValue = 85,
  onTargetReached,
  className = '',
  soundEnabled = true,
}) => {
  // Representation: Tens and Ones
  const [tensUpper, setTensUpper] = useState(false);
  const [tensLower, setTensLower] = useState(4); // 40
  const [onesUpper, setOnesUpper] = useState(true); // 5
  const [onesLower, setOnesLower] = useState(2); // 2 -> 47

  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Stop narration and clear demo timeouts on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(t => clearTimeout(t));
      stopNarration();
    };
  }, []);

  const currentValue =
    (tensUpper ? 50 : 0) +
    tensLower * 10 +
    (onesUpper ? 5 : 0) +
    onesLower;

  const handleToggleTensUpper = () => {
    playStep(soundEnabled);
    const nextVal = !tensUpper;
    setTensUpper(nextVal);
    checkTarget(nextVal, tensLower, onesUpper, onesLower);
  };

  const handleSetTensLower = (count: number) => {
    playStep(soundEnabled);
    setTensLower(count);
    checkTarget(tensUpper, count, onesUpper, onesLower);
  };

  const handleToggleOnesUpper = () => {
    playStep(soundEnabled);
    const nextVal = !onesUpper;
    setOnesUpper(nextVal);
    checkTarget(tensUpper, tensLower, nextVal, onesLower);
  };

  const handleSetOnesLower = (count: number) => {
    playStep(soundEnabled);
    setOnesLower(count);
    checkTarget(tensUpper, tensLower, onesUpper, count);
  };

  const checkTarget = (tu: boolean, tl: number, ou: boolean, ol: number) => {
    const val = (tu ? 50 : 0) + tl * 10 + (ou ? 5 : 0) + ol;
    if (val === targetValue) {
      playCorrect(soundEnabled);
      speakNarration(`Target ${targetValue} reached! Excellent abacus calculation!`, !soundEnabled);
      onTargetReached?.();
    }
  };

  const handleReset = () => {
    timersRef.current.forEach(t => clearTimeout(t));
    timersRef.current = [];
    stopNarration();
    playStep(soundEnabled);
    setTensUpper(false);
    setTensLower(4);
    setOnesUpper(true);
    setOnesLower(2);
    setIsDemoRunning(false);
  };

  const handleGuideMe = () => {
    speakNarration(
      'Welcome to the Soroban Abacus! The upper deck beads are Heaven beads, each worth 5. The lower deck beads are Earth beads, each worth 1. Beads only count when you push them toward the center beam! Try clicking beads to match the goal, or click Regroup Demo to see regrouping in action.',
      !soundEnabled
    );
  };

  const handleAutoSolve = () => {
    timersRef.current.forEach(t => clearTimeout(t));
    timersRef.current = [];
    setIsDemoRunning(true);
    playStep(soundEnabled);

    speakNarration(
      'Step 1: Adding 30 to the tens column. Push down 50 and two tens.',
      !soundEnabled
    );

    // Step 1: Add 30 to tens (50 + 20 = 70)
    const t1 = setTimeout(() => {
      setTensUpper(true);
      setTensLower(2);
      playStep(soundEnabled);
    }, 900);

    // Step 2: Add 8 to ones (5+2 = 7; 7+8 = 15 -> regroups 10 ones into 1 ten, leaving 5 -> 85)
    const t2 = setTimeout(() => {
      setTensUpper(true);
      setTensLower(3); // 50 + 30 = 80
      setOnesUpper(true);
      setOnesLower(0); // 5 -> Total 85!
      playCorrect(soundEnabled);
      setIsDemoRunning(false);
      speakNarration(
        'Step 2: Ten ones regroup into one ten! Reached goal 85!',
        !soundEnabled
      );
      onTargetReached?.();
    }, 2800);

    timersRef.current = [t1, t2];
  };

  const isMatched = currentValue === targetValue;

  return (
    <div className={`p-4 sm:p-6 bg-card paper-card border-2 border-ink/15 shadow-warm ${className}`}>
      {/* Abacus Display Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <span className="font-display font-extrabold text-xs sm:text-sm uppercase tracking-wider text-saffron flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-saffron" /> Interactive Soroban Abacus
          </span>
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-4xl sm:text-5xl font-black text-ink">
              {currentValue}
            </span>
            {targetValue && (
              <span className="text-xs sm:text-sm font-semibold text-ink-soft">
                (Goal: <strong className="font-mono text-saffron font-black text-base">{targetValue}</strong>)
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Guide Me Narration Button */}
          <button
            type="button"
            onClick={handleGuideMe}
            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-full font-display font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
            title="Listen to how the abacus works"
          >
            <Volume2 className="w-4 h-4 text-amber-600" />
            <span>Guide Me</span>
          </button>

          {isMatched ? (
            <span className="px-3.5 py-1.5 bg-teal-light text-teal border border-teal/40 rounded-full font-display font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-sm animate-bounce">
              <Sparkles className="w-4 h-4" /> Target Reached!
            </span>
          ) : (
            <button
              type="button"
              onClick={handleAutoSolve}
              disabled={isDemoRunning}
              className="px-3.5 py-1.5 bg-saffron-light hover:bg-saffron text-ink hover:text-white border border-saffron/40 rounded-full font-display font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-40 cursor-pointer"
              title="Show Animated Regrouping Demo"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Regroup Demo</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="p-2 text-ink-muted hover:text-ink hover:bg-paper rounded-xl transition-all border border-ink/10 cursor-pointer"
            title="Reset Beads"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* SVG Abacus Frame (High polish, 3D tactile wood frame) */}
      <div className="relative w-full max-w-sm mx-auto h-72 bg-[#E2C7A7] rounded-3xl p-4 border-4 border-[#78461E] shadow-2xl select-none">
        {/* Beam separator */}
        <div className="absolute top-24 left-4 right-4 h-3.5 bg-[#4A2609] rounded shadow-md z-10 flex items-center justify-around px-8">
          <div className="w-2.5 h-2.5 rounded-full bg-white/90 shadow-sm" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/90 shadow-sm" />
        </div>

        {/* Rods Container */}
        <div className="h-full flex justify-around px-6">
          {/* TENS COLUMN */}
          <div className="relative w-16 h-full flex flex-col items-center">
            {/* Wooden Rod - starts cleanly below header badge so it NEVER intersects the label text */}
            <div className="absolute top-7 bottom-1 w-2 bg-[#5A3816] z-0 rounded-sm" />

            {/* Column Label Plaque with solid background for zero overlap */}
            <div className="z-20 px-2.5 py-0.5 mb-1 rounded-md bg-[#F4DFC8] border border-[#78461E]/40 shadow-xs flex items-center justify-center">
              <span className="text-[11px] font-mono font-black tracking-wider text-[#4A2609]">
                TENS
              </span>
            </div>

            {/* Upper Deck (Heaven Bead, value 50) */}
            <div className="h-16 w-full flex items-center justify-center z-10">
              <button
                type="button"
                onClick={handleToggleTensUpper}
                className={`w-14 h-7 rounded-full border-2 border-[#542B09] transition-all transform duration-150 shadow-md cursor-pointer ${
                  tensUpper
                    ? 'translate-y-2 bg-[#FF9F1C] bead-shadow scale-105'
                    : '-translate-y-2 bg-[#D17E10]'
                }`}
                title="Tens Heaven Bead (50)"
              />
            </div>

            {/* Spacer for Beam */}
            <div className="h-6" />

            {/* Lower Deck (4 Earth Beads, 10 each) */}
            <div className="flex-1 w-full flex flex-col justify-end gap-2 pb-2 z-10">
              {[1, 2, 3, 4].map(idx => {
                const isActive = idx <= tensLower;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSetTensLower(isActive ? idx - 1 : idx)}
                    className={`w-14 h-7 mx-auto rounded-full border-2 border-[#542B09] transition-all duration-150 shadow-md cursor-pointer ${
                      isActive
                        ? '-translate-y-2 bg-[#FF9F1C] bead-shadow scale-105'
                        : 'translate-y-0 bg-[#D17E10]'
                    }`}
                    title={`Tens Earth Bead ${idx} (10)`}
                  />
                );
              })}
            </div>
          </div>

          {/* ONES COLUMN */}
          <div className="relative w-16 h-full flex flex-col items-center">
            {/* Wooden Rod - starts cleanly below header badge so it NEVER intersects the label text */}
            <div className="absolute top-7 bottom-1 w-2 bg-[#5A3816] z-0 rounded-sm" />

            {/* Column Label Plaque with solid background for zero overlap */}
            <div className="z-20 px-2.5 py-0.5 mb-1 rounded-md bg-[#D1FAE5] border border-[#0A574D]/30 shadow-xs flex items-center justify-center">
              <span className="text-[11px] font-mono font-black tracking-wider text-[#065F46]">
                ONES
              </span>
            </div>

            {/* Upper Deck (Heaven Bead, value 5) */}
            <div className="h-16 w-full flex items-center justify-center z-10">
              <button
                type="button"
                onClick={handleToggleOnesUpper}
                className={`w-14 h-7 rounded-full border-2 border-[#0A574D] transition-all transform duration-150 shadow-md cursor-pointer ${
                  onesUpper
                    ? 'translate-y-2 bg-[#10B981] bead-shadow scale-105'
                    : '-translate-y-2 bg-[#059669]'
                }`}
                title="Ones Heaven Bead (5)"
              />
            </div>

            {/* Spacer for Beam */}
            <div className="h-6" />

            {/* Lower Deck (4 Earth Beads, 1 each) */}
            <div className="flex-1 w-full flex flex-col justify-end gap-2 pb-2 z-10">
              {[1, 2, 3, 4].map(idx => {
                const isActive = idx <= onesLower;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSetOnesLower(isActive ? idx - 1 : idx)}
                    className={`w-14 h-7 mx-auto rounded-full border-2 border-[#0A574D] transition-all duration-150 shadow-md cursor-pointer ${
                      isActive
                        ? '-translate-y-2 bg-[#10B981] bead-shadow scale-105'
                        : 'translate-y-0 bg-[#059669]'
                    }`}
                    title={`Ones Earth Bead ${idx} (1)`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3.5 text-center text-xs sm:text-sm text-ink-muted font-medium">
        Click beads to push them toward or away from the central beam.
      </p>
    </div>
  );
};
