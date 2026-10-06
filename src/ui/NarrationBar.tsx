import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Bot,
  Subtitles,
} from 'lucide-react';
import {
  subscribeNarration,
  stopNarration,
  pauseNarration,
  resumeNarration,
  speakNarration,
  NarrationState,
} from '../services/audio';

interface NarrationBarProps {
  muted: boolean;
  captionsEnabled: boolean;
  onToggleMute: () => void;
  onToggleCaptions: () => void;
  defaultText?: string;
  className?: string;
}

export const NarrationBar: React.FC<NarrationBarProps> = ({
  muted,
  captionsEnabled,
  onToggleMute,
  onToggleCaptions,
  defaultText,
  className = '',
}) => {
  const [narration, setNarration] = useState<NarrationState>({
    status: 'idle',
    currentText: '',
    voiceName: 'Rachel',
    isFallback: false,
  });

  useEffect(() => {
    const unsubscribe = subscribeNarration((state) => {
      setNarration(state);
    });
    return unsubscribe;
  }, []);

  const isPlaying = narration.status === 'playing';
  const isLoading = narration.status === 'loading';
  const isPaused = narration.status === 'paused';
  const isActive = isPlaying || isLoading || isPaused;

  const displayText = narration.currentText || defaultText || '';

  const handleReplayOrPlay = () => {
    if (muted) {
      onToggleMute();
    }
    if (isPaused) {
      resumeNarration();
    } else if (isPlaying) {
      pauseNarration();
    } else if (displayText) {
      speakNarration(displayText, false);
    }
  };

  const handleStop = () => {
    stopNarration();
  };

  if (!isActive && !defaultText) {
    return null;
  }

  return (
    <aside
      aria-label="Audio narration controls and captions"
      className={`rounded-2xl transition-all duration-300 border-2 shadow-warm-lg ${
        isActive
          ? 'bg-ink text-white border-amber-400/40 p-3.5 sm:p-4'
          : 'bg-card paper-card text-ink border-ink/15 p-3'
      } ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Speaker status & live audio waves */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={handleReplayOrPlay}
            disabled={isLoading}
            className={`p-2.5 rounded-xl font-display font-black text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm ${
              isActive
                ? 'bg-amber-400 text-ink hover:bg-amber-300'
                : 'bg-saffron text-white hover:bg-saffron-hover'
            }`}
            title={isPlaying ? 'Pause narration' : isPaused ? 'Resume narration' : 'Listen to narration'}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            <span className="font-bold">
              {isLoading ? 'Loading Voice...' : isPlaying ? 'Pause' : isPaused ? 'Resume' : 'Listen'}
            </span>
          </button>

          {/* Replay Button if active */}
          {isActive && (
            <button
              type="button"
              onClick={() => {
                if (displayText) speakNarration(displayText, false);
              }}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
              title="Replay from start"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Voice Indicator Badge & Audio Waves */}
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 ${
                isActive
                  ? 'bg-white/15 text-amber-300'
                  : 'bg-ink/5 text-ink-muted'
              }`}
            >
              {narration.isFallback ? (
                <Bot className="w-3.5 h-3.5 text-blue-400" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>{narration.voiceName || 'Rachel'} (AI Voice)</span>
            </span>

            {/* Animated equalizer waves when playing */}
            {isPlaying && (
              <div className="flex items-end gap-0.5 h-4 px-1" title="Audio playing">
                <span className="w-1 bg-amber-400 rounded-full animate-[bounce_0.6s_ease-in-out_infinite]" style={{ height: '60%' }} />
                <span className="w-1 bg-amber-300 rounded-full animate-[bounce_0.8s_ease-in-out_infinite_0.2s]" style={{ height: '100%' }} />
                <span className="w-1 bg-amber-400 rounded-full animate-[bounce_0.5s_ease-in-out_infinite_0.4s]" style={{ height: '80%' }} />
                <span className="w-1 bg-amber-300 rounded-full animate-[bounce_0.7s_ease-in-out_infinite_0.1s]" style={{ height: '40%' }} />
              </div>
            )}
          </div>
        </div>

        {/* Center: Live Subtitles / Captions (if enabled) */}
        {captionsEnabled && displayText && (
          <div className="flex-1 max-w-2xl px-2 text-center sm:text-left">
            <p
              className={`text-xs sm:text-sm font-medium leading-snug line-clamp-2 ${
                isActive ? 'text-amber-100 font-serif' : 'text-ink-soft'
              }`}
            >
              &ldquo;{displayText}&rdquo;
            </p>
          </div>
        )}

        {/* Right: Quick Controls (Captions toggle & Mute toggle) */}
        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          {/* Toggle Subtitles */}
          <button
            type="button"
            onClick={onToggleCaptions}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              captionsEnabled
                ? isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-paper text-ink border border-ink/10'
                : 'text-white/40 hover:text-white/70'
            }`}
            title={captionsEnabled ? 'Hide captions' : 'Show captions'}
          >
            <Subtitles className="w-4 h-4" />
          </button>

          {/* Toggle Mute */}
          <button
            type="button"
            onClick={onToggleMute}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              muted
                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                : isActive
                ? 'bg-white/20 text-white'
                : 'bg-paper text-ink border border-ink/10'
            }`}
            title={muted ? 'Unmute narration' : 'Mute narration'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Stop Button */}
          {isActive && (
            <button
              type="button"
              onClick={handleStop}
              className="px-2.5 py-1 text-xs font-bold text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all cursor-pointer"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
