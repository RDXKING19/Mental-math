import React, { useState } from 'react';
import {
  X,
  HeartHandshake,
  FileText,
  RotateCcw,
  AlertTriangle,
  Type,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  Play,
  Check,
} from 'lucide-react';
import { Settings } from '../services/store';
import {
  ELEVENLABS_VOICES,
  speakNarration,
  stopNarration,
  setNarrationVoice,
} from '../services/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onUpdateSettings: (newSettings: Partial<Settings>) => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetProgress,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);
  const [testingVoice, setTestingVoice] = useState(false);

  if (!isOpen) return null;

  const currentVoiceId = settings.voiceId || ELEVENLABS_VOICES[0].id;

  const handleTestVoice = (voiceId: string) => {
    stopNarration();
    setTestingVoice(true);
    setNarrationVoice(voiceId);
    speakNarration(
      'Welcome to the Mental Math Bazaar! Split, shift, and conquer.',
      false,
      () => setTestingVoice(false),
      voiceId
    );
  };

  const handleSelectVoice = (voiceId: string) => {
    onUpdateSettings({ voiceId });
    setNarrationVoice(voiceId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white paper-card border-2 border-amber-900/20 shadow-2xl p-6 sm:p-7 rounded-3xl">
        <div className="flex items-center justify-between pb-4 border-b border-ink/10 mb-4 sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <h3 className="font-display font-black text-xl text-ink flex items-center gap-2">
            <span>Settings & Accessibility</span>
          </h3>
          <button
            type="button"
            onClick={() => {
              stopNarration();
              onClose();
            }}
            className="p-1.5 text-ink-muted hover:text-ink hover:bg-paper rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* ElevenLabs AI Voice Narration */}
          <div className="p-4 bg-paper rounded-2xl border-2 border-amber-400/40 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 text-amber-900 rounded-xl">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <span className="font-display font-black text-sm text-ink block">
                    AI Voice Narration
                  </span>
                  <span className="text-xs text-ink-soft">
                    Natural ElevenLabs storytelling & spoken math
                  </span>
                </div>
              </div>

              {/* Master Mute Toggle */}
              <button
                type="button"
                onClick={() => {
                  const newMuted = !settings.muted;
                  if (newMuted) stopNarration();
                  onUpdateSettings({ muted: newMuted });
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-display font-black text-xs transition-colors cursor-pointer border ${
                  !settings.muted
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : 'bg-red-100 text-red-700 border-red-200'
                }`}
              >
                {!settings.muted ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Unmuted</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Muted</span>
                  </>
                )}
              </button>
            </div>

            {/* Voice Persona Selector */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-mono font-bold text-ink-muted uppercase tracking-wider block">
                Choose Narrator Voice:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {ELEVENLABS_VOICES.map((v) => {
                  const isSelected = currentVoiceId === v.id;
                  return (
                    <div
                      key={v.id}
                      onClick={() => handleSelectVoice(v.id)}
                      className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-white border-amber-500 shadow-sm ring-2 ring-amber-400/30'
                          : 'bg-white/60 border-ink/10 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-display font-black text-xs text-ink">
                          {v.name}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
                      </div>
                      <p className="text-[11px] text-ink-soft leading-tight mb-2">
                        {v.desc}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTestVoice(v.id);
                        }}
                        className="w-full py-1 px-2 bg-paper hover:bg-amber-100 text-ink text-[10px] font-bold rounded-lg border border-ink/10 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Preview</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Auto-narrate & Sound Effects sub-toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-ink/10">
              <label className="flex items-center justify-between p-2 bg-white rounded-xl border border-ink/10 cursor-pointer">
                <span className="text-xs font-display font-bold text-ink">Auto-Read Stories</span>
                <input
                  type="checkbox"
                  checked={settings.autoNarrate}
                  onChange={(e) => onUpdateSettings({ autoNarrate: e.target.checked })}
                  className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 bg-white rounded-xl border border-ink/10 cursor-pointer">
                <span className="text-xs font-display font-bold text-ink">Sound Effects (SFX)</span>
                <input
                  type="checkbox"
                  checked={settings.soundEffects}
                  onChange={(e) => onUpdateSettings({ soundEffects: e.target.checked })}
                  className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Calm Mode */}
          <div className="flex items-center justify-between p-3.5 bg-paper rounded-2xl border border-ink/10 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <span className="font-display font-black text-sm text-ink block">
                  Calm Mode
                </span>
                <span className="text-xs text-ink-soft">
                  Removes timers, hearts, and speed pressure
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onUpdateSettings({ calmMode: !settings.calmMode })}
              className={`w-12 h-7 rounded-full transition-colors relative p-1 cursor-pointer ${
                settings.calmMode ? 'bg-emerald-600' : 'bg-ink/20'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                  settings.calmMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Text Size Accessibility Scaling */}
          <div className="p-3.5 bg-paper rounded-2xl border border-ink/10 shadow-xs space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                <Type className="w-5 h-5" />
              </div>
              <div>
                <span className="font-display font-black text-sm text-ink block">
                  Text Reading Size
                </span>
                <span className="text-xs text-ink-soft">
                  Adjust font size for optimal readability
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { id: 'normal' as const, label: 'Normal (16px)' },
                { id: 'large' as const, label: 'Large (18px)' },
                { id: 'xl' as const, label: 'Extra Large (20px)' },
              ].map(s => {
                const isActive = (settings.textSize || 'large') === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      document.documentElement.setAttribute('data-text-size', s.id);
                      onUpdateSettings({ textSize: s.id });
                    }}
                    className={`py-2 px-1 text-xs font-display font-black rounded-xl border-2 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-ink border-ink/15 hover:border-amber-400'
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Captions */}
          <div className="flex items-center justify-between p-3.5 bg-paper rounded-2xl border border-ink/10 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 text-purple-800 rounded-xl">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="font-display font-black text-sm text-ink block">
                  On-Screen Captions
                </span>
                <span className="text-xs text-ink-soft">
                  Displays live synchronized speech subtitles
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onUpdateSettings({ captions: !settings.captions })}
              className={`w-12 h-7 rounded-full transition-colors relative p-1 cursor-pointer ${
                settings.captions ? 'bg-amber-600' : 'bg-ink/20'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                  settings.captions ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reset Progress Section */}
          <div className="pt-2 border-t border-ink/10">
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="w-full py-2.5 px-4 bg-paper hover:bg-red-50 text-red-700 font-display font-bold text-xs rounded-xl border border-red-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-red-600" />
                <span>Reset All Learning Progress</span>
              </button>
            ) : (
              <div className="p-3 bg-red-50 rounded-xl border border-red-200 space-y-2">
                <div className="flex items-center gap-2 text-red-800 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>Are you sure? This erases all earned stars, scrolls, and XP!</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onResetProgress();
                      setConfirmReset(false);
                      onClose();
                    }}
                    className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white font-display font-black text-xs rounded-xl shadow-xs cursor-pointer"
                  >
                    Confirm Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="flex-1 py-1.5 bg-white text-ink font-display font-bold text-xs rounded-xl border border-ink/20 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
