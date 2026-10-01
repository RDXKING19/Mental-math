import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { GateId } from '../../engine/types';
import { GATES, StorySlide } from '../../content/gatesData';
import { MascotGanu } from '../../ui/MascotGanu';

interface StoryScreenProps {
  gate: GateId;
  initialSlideIndex?: number;
  onFinishStory: () => void;
  onSlideChange?: (index: number) => void;
}

export const StoryScreen: React.FC<StoryScreenProps> = ({
  gate,
  initialSlideIndex = 0,
  onFinishStory,
  onSlideChange,
}) => {
  const gateData = GATES[gate];
  const slides = gateData.storySlides;
  const [currentIdx, setCurrentIdx] = useState(initialSlideIndex);

  const currentSlide: StorySlide = slides[currentIdx] || slides[0];

  useEffect(() => {
    onSlideChange?.(currentIdx);
  }, [currentIdx, onSlideChange]);

  const handleNext = () => {
    if (currentIdx < slides.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      onFinishStory();
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  return (
    <div className="h-full max-w-5xl mx-auto p-4 sm:p-8 flex flex-col justify-between overflow-y-auto">
      {/* Top Header: Phase & Slide Dots */}
      <div className="flex items-center justify-between gap-3 border-b-2 border-ink/10 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="px-3.5 py-1.5 bg-orange-100 text-orange-950 font-display font-black text-xs sm:text-sm rounded-full uppercase tracking-wider flex items-center gap-2 border border-orange-400">
            <BookOpen className="w-4 h-4 text-orange-700" /> Phase 2 · Story
          </span>
          <span className="text-xs sm:text-sm font-mono font-bold text-ink-muted">
            Slide {currentIdx + 1} of {slides.length}
          </span>
        </div>

        {/* Slide Progress Dots (Larger, easier to click) */}
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIdx(i)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                i === currentIdx ? 'w-8 bg-amber-500' : 'w-2.5 bg-ink/20 hover:bg-ink/40'
              }`}
              title={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Main Slide Card (Generous layout, larger typography) */}
      <div className="my-auto py-6 sm:py-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Side: Title, Body, Pull-quote */}
        <div className="space-y-5">
          <span className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-widest text-saffron block">
            Gate {gate} Story · Chapter {currentIdx + 1}
          </span>

          <h2 className="font-display font-black text-3xl sm:text-4xl text-ink leading-tight">
            {currentSlide.title}
          </h2>

          <p className="font-body text-base sm:text-lg text-ink-soft leading-relaxed font-normal">
            {currentSlide.body}
          </p>

          {/* Pull Quote with high contrast saffron accent */}
          <div className="p-4 bg-paper rounded-2xl border-l-4 border-saffron shadow-sm">
            <p className="font-display text-sm sm:text-base font-extrabold text-ink italic leading-relaxed">
              &ldquo;{currentSlide.quote}&rdquo;
            </p>
          </div>

          {/* Thought Trail Demo (if available on slide) */}
          {currentSlide.trailDemo && (
            <div className="p-4 bg-card rounded-2xl border-2 border-ink/15 shadow-sm space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-ink-muted block">
                Visual Strategy Preview
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {currentSlide.trailDemo.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <span className="px-3 py-1.5 bg-paper font-mono text-xs sm:text-sm font-bold text-ink rounded-xl border border-ink/10 shadow-inner">
                      {item.label}
                    </span>
                    {idx < currentSlide.trailDemo!.length - 1 && (
                      <span className="text-sm font-bold text-saffron">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Visual Artwork + Mascot */}
        <div className="flex flex-col items-center justify-center p-6 bg-card paper-card border-2 border-ink/15 shadow-warm-lg space-y-5">
          {/* Decorative Art Container */}
          <div className="w-full h-48 sm:h-56 bg-gradient-to-br from-paper to-saffron-light/40 rounded-3xl flex items-center justify-center border-2 border-ink/10 p-5 shadow-inner">
            <div className="text-center space-y-2.5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-card shadow-md flex items-center justify-center text-saffron border border-ink/10">
                <Sparkles className="w-9 h-9 sm:w-10 sm:h-10" />
              </div>
              <h4 className="font-display font-black text-lg sm:text-xl text-ink">
                {currentSlide.title}
              </h4>
              <p className="text-xs sm:text-sm text-ink-muted max-w-xs mx-auto leading-relaxed">
                {currentSlide.quote}
              </p>
            </div>
          </div>

          {/* Mascot Speech Bubble */}
          <MascotGanu
            mood="encouraging"
            size="sm"
            speech={currentSlide.bubble}
            className="w-full"
          />
        </div>
      </div>

      {/* Bottom Nav: Back and Next */}
      <div className="pt-4 border-t-2 border-ink/10 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentIdx === 0}
          className="px-6 py-3.5 bg-paper hover:bg-paper-subtle text-ink font-display font-extrabold text-sm sm:text-base rounded-2xl border-2 border-ink/15 shadow-sm flex items-center gap-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-8 py-3.5 bg-gradient-to-r from-saffron to-amber-500 hover:from-saffron-hover hover:to-amber-600 text-white font-display font-black text-base sm:text-lg rounded-2xl shadow-warm-lg border-2 border-saffron-border flex items-center gap-2.5 transition-all active:scale-95 hover:shadow-glow-saffron drop-shadow-sm"
        >
          <span>
            {currentIdx === slides.length - 1 ? 'Enter Simulation Lab' : 'Next Chapter'}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
