import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { TrailStep } from '../engine/types';

interface ThoughtTrailProps {
  steps: TrailStep[];
  title?: string;
  className?: string;
  highlightFinal?: boolean;
}

export const ThoughtTrail: React.FC<ThoughtTrailProps> = ({
  steps,
  title = 'Visual Thought Trail',
  className = '',
  highlightFinal = true,
}) => {
  return (
    <div className={`p-5 bg-paper-subtle border-2 border-ink/15 rounded-3xl shadow-sm ${className}`}>
      <div className="flex items-center gap-2 mb-3.5">
        <Sparkles className="w-5 h-5 text-saffron" />
        <h4 className="font-display font-extrabold text-sm uppercase tracking-wider text-ink">
          {title}
        </h4>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;
          return (
            <React.Fragment key={idx}>
              <div
                className={`group relative px-4 py-2.5 rounded-2xl transition-all duration-200 ${
                  isLast && highlightFinal
                    ? 'bg-teal text-white shadow-warm-lg font-black border-2 border-teal-hover scale-105 shadow-glow-teal'
                    : 'bg-card border-2 border-ink/15 text-ink shadow-sm'
                }`}
              >
                <div className="font-mono text-base sm:text-lg font-extrabold">
                  {step.label}
                </div>

                {step.note && (
                  <div
                    className={`text-xs sm:text-sm mt-0.5 font-medium ${
                      isLast && highlightFinal ? 'text-teal-light' : 'text-ink-soft'
                    }`}
                  >
                    {step.note}
                  </div>
                )}
              </div>

              {!isLast && (
                <ArrowRight className="w-5 h-5 text-ink-muted shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
