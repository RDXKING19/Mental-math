import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { GateId } from '../../engine/types';
import { GATES, StorySlide } from '../../content/gatesData';
import { MascotGanu } from '../../ui/MascotGanu';
import { NarrationBar } from '../../ui/NarrationBar';
import { speakNarration, stopNarration, playStep } from '../../services/audio';

interface StoryScreenProps {
  gate: GateId;
  initialSlideIndex?: number;
  muted?: boolean;
  captions?: boolean;
  autoNarrate?: boolean;
  onToggleMute?: () => void;
  onToggleCaptions?: () => void;
  onFinishStory: () => void;
  onSlideChange?: (index: number) => void;
}

export const StoryScreen: React.FC<StoryScreenProps> = ({
  gate,
  initialSlideIndex = 0,
  muted = false,
  captions = true,
  autoNarrate = true,
  onToggleMute = () => {},
  onToggleCaptions = () => {},
  onFinishStory,
  onSlideChange,
}) => {
  const gateData = GATES[gate];
  const slides = gateData.storySlides;
  const [currentIdx, setCurrentIdx] = useState(initialSlideIndex);

  const currentSlide: StorySlide = slides[currentIdx] || slides[0];

  const slideNarrationText = `${currentSlide.title}. ${currentSlide.body} "${currentSlide.quote}". Ganu says: ${currentSlide.bubble}`;

  useEffect(() => {
    onSlideChange?.(currentIdx);
  }, [currentIdx, onSlideChange]);

  useEffect(() => {
    if (autoNarrate && !muted) {
      speakNarration(slideNarrationText, muted);
    }
    return () => {
      stopNarration();
    };
  }, [currentIdx, autoNarrate, muted]);

  const handleNext = () => {
    playStep(!muted);
    if (currentIdx < slides.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      onFinishStory();
    }
  };

  const handleBack = () => {
    playStep(!muted);
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleSpeakSnippet = (text: string) => {
    speakNarration(text, muted);
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

        {/* Slide Progress Dots */}
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                playStep(!muted);
                setCurrentIdx(i);
              }}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                i === currentIdx ? 'w-8 bg-amber-500' : 'w-2.5 bg-ink/20 hover:bg-ink/40'
              }`}
              title={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Narration Bar with Play/Pause & Subtitles */}
      <div className="my-2">
        <NarrationBar
          muted={muted}
          captionsEnabled={captions}
          onToggleMute={onToggleMute}
          onToggleCaptions={onToggleCaptions}
          defaultText={slideNarrationText}
        />
      </div>

      {/* Main Slide Card */}
      <div className="my-auto py-4 sm:py-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Side: Title, Body, Pull-quote */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-widest text-saffron block">
              Gate {gate} Story · Chapter {currentIdx + 1}
            </span>
            <button
              type="button"
              onClick={() => handleSpeakSnippet(slideNarrationText)}
              className="p-1.5 text-ink-muted hover:text-amber-600 hover:bg-paper rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
              title="Read entire slide aloud"
            >
              <Volume2 className="w-4 h-4" />
              <span>Read Aloud</span>
            </button>
          </div>

          <h2 className="font-display font-black text-2xl sm:text-4xl text-ink leading-tight">
            {currentSlide.title}
          </h2>

          <p className="font-body text-base sm:text-lg text-ink-soft leading-relaxed font-normal">
            {currentSlide.body}
          </p>

          {/* Pull Quote */}
          <div className="p-4 bg-paper rounded-2xl border-l-4 border-saffron shadow-sm flex items-start justify-between gap-3">
            <p className="font-display text-sm sm:text-base font-extrabold text-ink italic leading-relaxed flex-1">
              &ldquo;{currentSlide.quote}&rdquo;
            </p>
            <button
              type="button"
              onClick={() => handleSpeakSnippet(currentSlide.quote)}
              className="p-1 text-ink-muted hover:text-amber-600 rounded-lg shrink-0 cursor-pointer"
              title="Listen to quote"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thought Trail Demo */}
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
        <div className="flex flex-col items-center justify-center p-6 bg-card paper-card border-2 border-ink/15 shadow-warm-lg space-y-5 rounded-3xl">
          {/* Story Artwork Container */}
          <div className="w-full relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-ink/10 shadow-md group aspect-[16/9] bg-gradient-to-br from-paper to-saffron-light/40 flex items-center justify-center">
            {currentSlide.image && (
              <img
                key={currentSlide.id}
                src={currentSlide.image}
                alt={currentSlide.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}

            {/* Subtle Chapter Badge Pill on top-left of image */}
            <div className="absolute top-3 left-3 px-3 py-1 bg-ink/80 backdrop-blur-md text-amber-200 rounded-full text-xs font-mono font-bold tracking-wider shadow-md border border-amber-400/30">
              Chapter {currentIdx + 1}
            </div>
          </div>

          {/* Mascot Speech Bubble with speaker icon */}
          <div className="w-full flex items-center gap-2">
            <MascotGanu
              mood="encouraging"
              size="sm"
              speech={currentSlide.bubble}
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => handleSpeakSnippet(currentSlide.bubble)}
              className="p-2 text-ink-muted hover:text-amber-600 hover:bg-paper rounded-xl transition-all cursor-pointer shrink-0"
              title="Listen to Ganu"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Nav: Back and Next */}
      <div className="pt-4 border-t-2 border-ink/10 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentIdx === 0}
          className="px-6 py-3.5 bg-paper hover:bg-paper-subtle text-ink font-display font-extrabold text-sm sm:text-base rounded-2xl border-2 border-ink/15 shadow-sm flex items-center gap-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-8 py-3.5 bg-gradient-to-r from-saffron to-amber-500 hover:from-saffron-hover hover:to-amber-600 text-white font-display font-black text-base sm:text-lg rounded-2xl shadow-warm-lg border-2 border-saffron-border flex items-center gap-2.5 transition-all active:scale-95 hover:shadow-glow-saffron drop-shadow-sm cursor-pointer"
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
