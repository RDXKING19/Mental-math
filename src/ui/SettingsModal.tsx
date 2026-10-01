import React, { useState } from 'react';
import {
  X,
  HeartHandshake,
  FileText,
  RotateCcw,
  AlertTriangle,
  Type,
} from 'lucide-react';
import { Settings } from '../services/store';

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-md bg-white paper-card border-2 border-amber-900/20 shadow-2xl p-6 sm:p-7">
        <div className="flex items-center justify-between pb-4 border-b border-ink/10 mb-4">
          <h3 className="font-display font-black text-xl text-ink">Settings & Accessibility</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-ink-muted hover:text-ink hover:bg-paper rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
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
                  Displays clear story subtitle banners
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
