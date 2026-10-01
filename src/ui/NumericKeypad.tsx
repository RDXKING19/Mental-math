import React, { useEffect } from 'react';
import { Delete, CornerDownLeft, Minus } from 'lucide-react';
import { playTap } from '../services/audio';

interface NumericKeypadProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  soundEnabled?: boolean;
  disabled?: boolean;
  className?: string;
  allowNegative?: boolean;
}

export const NumericKeypad: React.FC<NumericKeypadProps> = ({
  value,
  onChange,
  onSubmit,
  soundEnabled = true,
  disabled = false,
  className = '',
  allowNegative = false,
}) => {
  const handleDigit = (digit: string) => {
    if (disabled) return;
    playTap(soundEnabled);
    if (value === '0') {
      onChange(digit);
    } else {
      onChange(value + digit);
    }
  };

  const handleBackspace = () => {
    if (disabled) return;
    playTap(soundEnabled);
    if (value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (disabled) return;
    playTap(soundEnabled);
    onChange('');
  };

  const handleToggleMinus = () => {
    if (disabled || !allowNegative) return;
    playTap(soundEnabled);
    if (value.startsWith('-')) {
      onChange(value.slice(1));
    } else {
      onChange('-' + value);
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (value.trim().length > 0) {
          onSubmit();
        }
      } else if (e.key === '-' && allowNegative) {
        e.preventDefault();
        handleToggleMinus();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [value, disabled, allowNegative]);

  return (
    <div className={`w-full max-w-sm mx-auto select-none ${className}`}>
      {/* Visual Input Display Bar (Larger, High Contrast) */}
      <div className="mb-3.5 px-5 py-3.5 bg-card border-2 border-ink/20 rounded-2xl shadow-inner flex items-center justify-between">
        <span className="font-mono text-xs sm:text-sm text-ink-muted uppercase tracking-wider font-bold">
          Your Answer:
        </span>
        <div className="font-mono text-3xl sm:text-4xl font-black text-ink tracking-widest min-h-[44px] flex items-center">
          {value || <span className="text-ink/30 animate-pulse font-light">_</span>}
        </div>
        {value.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs sm:text-sm text-ink-muted hover:text-coral transition-colors font-bold px-2.5 py-1 rounded-lg bg-paper cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Grid of Keys (Generous touch target, high readability) */}
      <div className="grid grid-cols-3 gap-2.5">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(d => (
          <button
            key={d}
            type="button"
            disabled={disabled}
            onClick={() => handleDigit(d)}
            className="h-14 sm:h-16 bg-card hover:bg-paper active:scale-95 border-2 border-ink/15 hover:border-saffron shadow-sm rounded-2xl font-mono text-2xl sm:text-3xl font-black text-ink transition-all flex items-center justify-center disabled:opacity-50 cursor-pointer"
          >
            {d}
          </button>
        ))}

        {/* Bottom Row */}
        {allowNegative ? (
          <button
            type="button"
            disabled={disabled}
            onClick={handleToggleMinus}
            className="h-14 sm:h-16 bg-paper-subtle hover:bg-paper active:scale-95 border-2 border-ink/15 rounded-2xl font-mono text-xl font-extrabold text-ink-soft transition-all flex items-center justify-center disabled:opacity-50 cursor-pointer"
            title="Minus / Negative"
          >
            <Minus className="w-6 h-6" />
          </button>
        ) : (
          <button
            type="button"
            disabled={disabled}
            onClick={handleClear}
            className="h-14 sm:h-16 bg-paper-subtle hover:bg-paper active:scale-95 border-2 border-ink/15 rounded-2xl font-display text-base font-bold text-ink-muted transition-all flex items-center justify-center disabled:opacity-50 cursor-pointer"
          >
            C
          </button>
        )}

        <button
          type="button"
          disabled={disabled}
          onClick={() => handleDigit('0')}
          className="h-14 sm:h-16 bg-card hover:bg-paper active:scale-95 border-2 border-ink/15 hover:border-saffron shadow-sm rounded-2xl font-mono text-2xl sm:text-3xl font-black text-ink transition-all flex items-center justify-center disabled:opacity-50 cursor-pointer"
        >
          0
        </button>

        <button
          type="button"
          disabled={disabled || value.length === 0}
          onClick={handleBackspace}
          className="h-14 sm:h-16 bg-paper-subtle hover:bg-coral-light active:scale-95 border-2 border-ink/15 hover:border-coral rounded-2xl font-mono text-xl font-bold text-coral transition-all flex items-center justify-center disabled:opacity-30 cursor-pointer"
          title="Backspace"
        >
          <Delete className="w-6 h-6" />
        </button>

        {/* Full-width Vibrant Submit button */}
        <button
          type="button"
          disabled={disabled || value.trim().length === 0}
          onClick={onSubmit}
          className="col-span-3 h-14 sm:h-16 mt-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 active:scale-98 text-white font-display font-black text-xl sm:text-2xl rounded-2xl shadow-warm-lg border-2 border-amber-300 flex items-center justify-center gap-2.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>Submit Answer</span>
          <CornerDownLeft className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Screen reader live announcement */}
      <div className="sr-only" aria-live="polite">
        {value ? `Current entry: ${value}` : 'Empty entry'}
      </div>
    </div>
  );
};
