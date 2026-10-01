import React from 'react';

interface ClickBotProps {
  progress?: number; // 0 to 100
  speech?: string;
  expression?: 'smug' | 'calculating' | 'panicked' | 'impressed';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ClickBot: React.FC<ClickBotProps> = ({
  progress = 0,
  speech,
  expression = 'smug',
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: { w: 75, h: 75 },
    md: { w: 100, h: 100 },
    lg: { w: 130, h: 130 },
  };

  const { w, h } = sizeMap[size];

  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {/* Bot Avatar with 3D Image */}
      <div className="relative shrink-0 select-none animate-float-slow" style={{ width: w, height: h }}>
        <div className="w-full h-full rounded-2xl p-1 bg-gradient-to-tr from-cyan-500 via-sky-300 to-indigo-500 shadow-warm-lg overflow-hidden border-2 border-cyan-400">
          <img
            src="./images/click_bot.jpg"
            alt="ClickBot Rival"
            className="w-full h-full object-cover rounded-xl"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Small live status ping */}
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-coral rounded-full border-2 border-white shadow-sm animate-ping" />
      </div>

      {/* Progress & Speech */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="font-display font-extrabold text-xs sm:text-sm text-ink uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-coral animate-ping" />
            Click Bot (Rival Opponent)
          </span>
          <span className="font-mono text-xs sm:text-sm font-bold text-coral">
            {Math.round(progress)}%
          </span>
        </div>

        {/* Rival Progress Bar */}
        <div className="w-full h-3.5 bg-paper border-2 border-ink/15 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-coral to-amber-500 transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>

        {speech && (
          <p className="mt-1.5 text-xs sm:text-sm text-ink-soft font-medium italic truncate">
            &ldquo;{speech}&rdquo;
          </p>
        )}
      </div>
    </div>
  );
};
