import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Eye, RotateCcw, Volume2 } from 'lucide-react';
import { GateId } from '../../engine/types';
import { GATES } from '../../content/gatesData';
import { MascotGanu } from '../../ui/MascotGanu';
import { NarrationBar } from '../../ui/NarrationBar';
import { speakNarration, stopNarration, playStep, playCorrect } from '../../services/audio';

interface WonderScreenProps {
  gate: GateId;
  muted?: boolean;
  captions?: boolean;
  autoNarrate?: boolean;
  onToggleMute?: () => void;
  onToggleCaptions?: () => void;
  onContinue: () => void;
}

export const WonderScreen: React.FC<WonderScreenProps> = ({
  gate,
  muted = false,
  captions = true,
  autoNarrate = true,
  onToggleMute = () => {},
  onToggleCaptions = () => {},
  onContinue,
}) => {
  const gateData = GATES[gate];
  const { wonder } = gateData;
  const [revealedCount, setRevealedCount] = useState<number>(0);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const mainChallengeSpeech = `${wonder.hook}. ${wonder.dialogue}`;

  // Auto-narrate on enter if autoNarrate is enabled and not muted
  useEffect(() => {
    if (autoNarrate && !muted) {
      speakNarration(mainChallengeSpeech, muted);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      stopNarration();
    };
  }, [gate, autoNarrate, muted]);

  const handleRevealStep = () => {
    if (revealedCount < wonder.revealSteps.length) {
      const stepIdx = revealedCount;
      const stepText = wonder.revealSteps[stepIdx];
      setRevealedCount(prev => prev + 1);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      playStep(!muted);
      speakNarration(`Secret step ${stepIdx + 1}: ${stepText}`, muted);

      if (stepIdx + 1 === wonder.revealSteps.length) {
        timeoutRef.current = setTimeout(() => {
          playCorrect(!muted);
          speakNarration(`All secrets revealed! ${wonder.wonderQuestion}`, muted);
        }, 3200);
      }
    }
  };

  const handleReset = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setRevealedCount(0);
    speakNarration(mainChallengeSpeech, muted);
  };

  const handleSpeakText = (text: string) => {
    speakNarration(text, muted);
  };

  return (
    <div className="h-full max-w-5xl mx-auto p-4 sm:p-8 flex flex-col justify-between overflow-y-auto">
      {/* Top Phase Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-ink/10">
        <div className="flex items-center gap-2.5">
          <span className="px-3.5 py-1.5 bg-lavender-light text-lavender font-display font-extrabold text-xs sm:text-sm rounded-full uppercase tracking-wider flex items-center gap-2 border border-lavender/30">
            <Sparkles className="w-4 h-4" /> Phase 1 · Wonder
          </span>
          <span className="text-xs sm:text-sm font-mono font-bold text-ink-muted">
            Gate {gate}: {gateData.name}
          </span>
        </div>

        {revealedCount > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1 text-xs sm:text-sm font-display font-bold text-ink-muted hover:text-ink flex items-center gap-1.5 bg-paper rounded-xl border border-ink/10 cursor-pointer"
            title="Reset Reveal"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Narration Bar with Voice Controls & Captions */}
      <div className="my-2">
        <NarrationBar
          muted={muted}
          captionsEnabled={captions}
          onToggleMute={onToggleMute}
          onToggleCaptions={onToggleCaptions}
          defaultText={mainChallengeSpeech}
        />
      </div>

      {/* Gate Landscape Artwork Banner */}
      <div className="relative w-full h-36 sm:h-52 rounded-2xl overflow-hidden my-2 border-2 border-ink/10 shadow-sm shrink-0">
        <img
          src={gate === 1 ? './images/gate1_spark.jpg' : gate === 2 ? './images/gate2_flow.jpg' : './images/gate3_master.jpg'}
          alt={`Gate ${gate}: ${gateData.name}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end justify-between p-4">
          <span className="font-display font-black text-lg sm:text-2xl text-white drop-shadow-md">
            Gate {gate}: {gateData.name}
          </span>
          <span className="px-3 py-1 bg-amber-400 text-ink font-display font-black text-xs uppercase tracking-wider rounded-full shadow-md">
            Phase 1
          </span>
        </div>
      </div>

      {/* Main Wonder Hook Card */}
      <div className="my-auto py-3 sm:py-5 text-center space-y-4">
        <span className="font-display font-black text-xs sm:text-sm text-saffron uppercase tracking-widest block">
          ⚡ The Mental Challenge ⚡
        </span>

        {/* Big Bold Hook Question with Listen Button */}
        <div className="flex items-center justify-center gap-3">
          <h2 className="font-display font-black text-4xl sm:text-6xl text-ink leading-tight drop-shadow-sm font-mono">
            &ldquo;{wonder.hook}&rdquo;
          </h2>
          <button
            type="button"
            onClick={() => handleSpeakText(mainChallengeSpeech)}
            className="p-2.5 bg-paper hover:bg-amber-100 text-ink-muted hover:text-ink rounded-2xl border border-ink/15 transition-all shadow-xs cursor-pointer active:scale-95"
            title="Read hook aloud"
          >
            <Volume2 className="w-5 h-5 text-amber-600" />
          </button>
        </div>

        <p className="text-base sm:text-xl text-ink-soft max-w-xl mx-auto italic font-medium leading-relaxed">
          {wonder.dialogue}
        </p>

        {/* Revealed Steps Cards */}
        <div className="max-w-2xl mx-auto space-y-3.5 pt-2">
          {wonder.revealSteps.slice(0, revealedCount).map((stepText, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 bg-card rounded-2xl border-2 border-saffron shadow-warm-lg flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 text-left"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="w-10 h-10 rounded-full bg-saffron text-white font-display font-black text-base sm:text-lg flex items-center justify-center shrink-0 shadow-sm drop-shadow-xs">
                  {idx + 1}
                </span>
                <p className="font-mono text-base sm:text-xl font-bold text-ink leading-relaxed">
                  {stepText}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleSpeakText(`Step ${idx + 1}: ${stepText}`)}
                className="p-2 text-ink-muted hover:text-amber-600 hover:bg-paper rounded-xl transition-all cursor-pointer shrink-0"
                title={`Listen to step ${idx + 1}`}
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Reveal Step Button */}
        {revealedCount < wonder.revealSteps.length && (
          <div className="pt-3">
            <button
              type="button"
              onClick={handleRevealStep}
              className="px-8 py-4 bg-gradient-to-r from-lavender to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-display font-black text-lg sm:text-xl rounded-2xl shadow-warm-lg flex items-center gap-3 mx-auto transition-all active:scale-95 animate-pulse cursor-pointer"
            >
              <Eye className="w-6 h-6" />
              <span>Reveal Secret Step {revealedCount + 1} of 3</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Mascot Callout & Next CTA */}
      <div className="p-4 sm:p-6 bg-card paper-card border-2 border-ink/15 shadow-warm-lg flex flex-col sm:flex-row items-center justify-between gap-5 rounded-3xl">
        <div className="flex items-center gap-3 flex-1">
          <MascotGanu
            mood="thinking"
            size="sm"
            speech={
              revealedCount === wonder.revealSteps.length
                ? wonder.wonderQuestion
                : 'Can you solve this before revealing the secret shortcut?'
            }
            className="flex-1"
          />
          <button
            type="button"
            onClick={() =>
              handleSpeakText(
                revealedCount === wonder.revealSteps.length
                  ? wonder.wonderQuestion
                  : 'Can you solve this before revealing the secret shortcut?'
              )
            }
            className="p-2 text-ink-muted hover:text-amber-600 hover:bg-paper rounded-xl transition-all cursor-pointer"
            title="Listen to Ganu"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-saffron to-amber-500 hover:from-saffron-hover hover:to-amber-600 text-white font-display font-black text-lg sm:text-xl rounded-2xl shadow-warm-lg flex items-center justify-center gap-2.5 transition-all active:scale-95 shrink-0 hover:shadow-glow-saffron drop-shadow-sm cursor-pointer"
        >
          <span>Enter the Story</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
