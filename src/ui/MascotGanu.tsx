import React, { useState } from 'react';
import { Sparkles, Lightbulb } from 'lucide-react';
import { GANU_MENTOR_TIPS } from '../engine/gamification';

interface MascotGanuProps {
  speech?: string;
  mood?: 'happy' | 'thinking' | 'encouraging' | 'celebrating';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  interactive?: boolean;
}

export const MascotGanu: React.FC<MascotGanuProps> = ({
  speech,
  size = 'md',
  className = '',
  interactive = true,
}) => {
  const [tipIndex, setTipIndex] = useState(0);
  const [isWiggling, setIsWiggling] = useState(false);
  const [activeSpeech, setActiveSpeech] = useState<string | null>(null);

  const sizeMap = {
    sm: { w: 75, h: 75, text: 'text-xs sm:text-sm' },
    md: { w: 105, h: 105, text: 'text-sm sm:text-base' },
    lg: { w: 140, h: 140, text: 'text-base sm:text-lg' },
  };

  const { w, h, text } = sizeMap[size];

  const handleNextTip = () => {
    if (!interactive) return;
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 500);

    const tip = GANU_MENTOR_TIPS[tipIndex % GANU_MENTOR_TIPS.length];
    setTipIndex(prev => prev + 1);
    setActiveSpeech(`💡 ${tip.title}: ${tip.body} (${tip.formula})`);
  };

  const displayedSpeech = activeSpeech || speech;

  return (
    <div className={`flex items-start gap-4 ${className}`}>
      {/* 3D Ganu the Owl Mascot Avatar with warm golden border */}
      <div
        onClick={handleNextTip}
        className={`relative shrink-0 select-none animate-float-slow cursor-pointer hover:scale-105 active:scale-95 transition-transform ${
          isWiggling ? 'animate-bounce' : ''
        }`}
        style={{ width: w, height: h }}
        title="Tap Ganu for a Secret Mental Math Trick!"
      >
        <div className="w-full h-full rounded-full p-1 bg-gradient-to-tr from-amber-400 via-amber-300 to-orange-400 shadow-warm-lg overflow-hidden border-2 border-amber-500/70">
          <img
            src="./images/mascot_ganu.jpg"
            alt="Ganu the Owl Mentor"
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Small sparkle badge over mascot */}
        <span className="absolute -top-1 -right-1 p-1.5 bg-amber-500 text-white rounded-full shadow-md border-2 border-white">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </span>
      </div>

      {/* Reactive High-Contrast Speech Bubble */}
      {displayedSpeech && (
        <div className="relative bg-white border-2 border-amber-500/40 shadow-warm rounded-2xl px-5 py-3.5 max-w-xl animate-in fade-in zoom-in-95 duration-200 flex-1">
          <div className="absolute top-5 -left-2.5 w-4 h-4 bg-white border-l-2 border-b-2 border-amber-500/40 rotate-45" />

          {/* Bubble header */}
          <div className="flex items-center justify-between gap-2 mb-1.5 border-b border-ink/10 pb-1.5">
            <span className="font-display font-black text-xs sm:text-sm text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>🦉 Ganu the Owl Mentor</span>
              <span className="text-[11px] text-ink-muted lowercase hidden sm:inline">(tap owl for tips)</span>
            </span>

            {/* Next Tip Button */}
            {interactive && (
              <button
                type="button"
                onClick={handleNextTip}
                className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-display font-black rounded-xl border border-amber-400 transition-all cursor-pointer shadow-xs active:scale-95"
                title="Next mental math trick"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-700" />
                <span>Next Tip</span>
              </button>
            )}
          </div>

          <p className={`${text} text-ink font-semibold leading-relaxed`}>
            {displayedSpeech}
          </p>
        </div>
      )}
    </div>
  );
};
