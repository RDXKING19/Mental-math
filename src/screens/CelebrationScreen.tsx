import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  Sparkles,
  Star,
  Printer,
  RotateCcw,
  MapPin,
  CheckCircle2,
  Volume2,
} from 'lucide-react';
import { ProgressV1 } from '../services/store';
import { playFanfare, speakNarration, stopNarration } from '../services/audio';

interface CelebrationScreenProps {
  progress: ProgressV1;
  onBackToMap: () => void;
  soundEnabled?: boolean;
}

export const CelebrationScreen: React.FC<CelebrationScreenProps> = ({
  progress,
  onBackToMap,
  soundEnabled = true,
}) => {
  const [learnerName, setLearnerName] = useState('Mathematician');

  const totalStars = [1, 2, 3].reduce((acc, g) => {
    return acc + progress.gates[g as 1 | 2 | 3].worlds.reduce((wAcc, w) => wAcc + (w?.stars || 0), 0);
  }, 0);

  useEffect(() => {
    playFanfare(soundEnabled);
    speakNarration(
      'Congratulations, Master! You have demonstrated extraordinary mental fluency across all three gates of the Mental Math Bazaar. Your mental agility is legendary!',
      !soundEnabled
    );

    return () => {
      stopNarration();
    };
  }, [soundEnabled]);

  useEffect(() => {
    // Launch celebratory confetti cascade
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [soundEnabled]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="h-full max-w-4xl mx-auto p-4 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-6">
      {/* Top Banner */}
      <div className="text-center space-y-2">
        <div className="w-18 h-18 sm:w-20 sm:h-20 mx-auto rounded-full bg-saffron-light flex items-center justify-center text-saffron border-4 border-saffron shadow-lg animate-bounce">
          <Award className="w-10 h-10" />
        </div>
        <h2 className="font-display font-black text-3xl sm:text-5xl text-ink">
          Congratulations, Master!
        </h2>
        <div className="flex items-center justify-center gap-2">
          <p className="text-base sm:text-lg font-semibold text-ink-soft max-w-lg">
            You have unlocked the inner secrets of arithmetic, Vedic shortcuts, and mental agility.
          </p>
          <button
            type="button"
            onClick={() =>
              speakNarration(
                `Congratulations ${learnerName}! You have demonstrated extraordinary fluency across all three gates of Quick Minds Mental Math.`,
                !soundEnabled
              )
            }
            className="p-2 bg-paper hover:bg-amber-100 text-ink-muted hover:text-amber-700 rounded-2xl border border-ink/15 transition-all shadow-xs cursor-pointer shrink-0"
            title="Listen to award citation"
          >
            <Volume2 className="w-5 h-5 text-amber-600" />
          </button>
        </div>
      </div>

      {/* Printable Certificate Frame */}
      <div className="relative p-6 sm:p-12 bg-white border-8 border-double border-saffron rounded-3xl shadow-2xl text-center space-y-6 print:border-4 print:shadow-none">
        {/* Decorative corner ribbons */}
        <div className="flex items-center justify-between text-saffron text-xs sm:text-sm font-mono font-black uppercase tracking-widest">
          <span>Quick Minds Masterclass</span>
          <span>Verified Achievement</span>
        </div>

        <div className="space-y-2">
          <span className="font-display text-sm sm:text-base font-bold text-ink-muted uppercase tracking-wider block">
            This certifies that
          </span>
          {/* Editable Name Field */}
          <input
            type="text"
            value={learnerName}
            onChange={e => setLearnerName(e.target.value)}
            className="font-display font-black text-4xl sm:text-6xl text-ink text-center border-b-4 border-dashed border-ink/20 focus:border-saffron focus:outline-none bg-transparent px-3 max-w-md mx-auto transition-all"
            title="Click to change your certificate name"
          />
        </div>

        <p className="font-body text-base sm:text-lg text-ink-soft max-w-xl mx-auto leading-relaxed">
          has demonstrated extraordinary fluency, visual strategy mastery, and mental calculation excellence across all three Gates of <strong>Quick Minds: Mental Math</strong>.
        </p>

        {/* Certificate Metrics */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto py-4 border-y-2 border-ink/15">
          <div>
            <span className="text-xs uppercase font-extrabold text-ink-muted block">Experience</span>
            <div className="font-mono text-xl sm:text-2xl font-black text-ink mt-0.5">{progress.xp} XP</div>
          </div>
          <div>
            <span className="text-xs uppercase font-extrabold text-ink-muted block">Mastery Stars</span>
            <div className="font-mono text-xl sm:text-2xl font-black text-sun flex items-center justify-center gap-1.5 mt-0.5">
              <Star className="w-5 h-5 fill-sun" />
              <span>{totalStars}/45</span>
            </div>
          </div>
          <div>
            <span className="text-xs uppercase font-extrabold text-ink-muted block">Date</span>
            <div className="font-mono text-sm sm:text-base font-black text-ink mt-1">
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Seals & Mentor Signature */}
        <div className="flex items-center justify-around pt-3">
          <div className="text-center flex flex-col items-center">
            <img
              src="./images/mascot_ganu.jpg"
              alt="Ganu"
              className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 mb-1 shadow-sm"
            />
            <div className="font-display font-black text-sm sm:text-base text-ink italic">Ganu the Owl</div>
            <span className="text-xs text-ink-muted uppercase font-bold">Mentor & Scholar</span>
          </div>

          <div className="w-20 h-20 rounded-full bg-saffron/10 border-2 border-dashed border-saffron flex items-center justify-center text-saffron font-display font-black text-xs uppercase tracking-tighter shadow-inner">
            OFFICIAL SEAL
          </div>

          <div className="text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-indigo-100 border-2 border-indigo-400 flex items-center justify-center text-indigo-700 font-black text-lg mb-1 shadow-sm">
              ✨
            </div>
            <div className="font-display font-black text-sm sm:text-base text-ink italic">Ira & The Bazaar</div>
            <span className="text-xs text-ink-muted uppercase font-bold">Guild of Calculators</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <button
          type="button"
          onClick={handlePrint}
          className="w-full sm:w-auto px-8 py-4 bg-ink hover:bg-ink-soft text-white font-display font-black text-base rounded-2xl shadow-warm flex items-center justify-center gap-2.5 transition-all active:scale-95 cursor-pointer"
        >
          <Printer className="w-5 h-5 text-saffron" />
          <span>Print / Save Certificate</span>
        </button>

        <button
          type="button"
          onClick={onBackToMap}
          className="w-full sm:w-auto px-8 py-4 bg-saffron hover:bg-saffron-hover text-white font-display font-black text-base rounded-2xl shadow-warm flex items-center justify-center gap-2.5 transition-all active:scale-95 cursor-pointer drop-shadow-sm"
        >
          <MapPin className="w-5 h-5" />
          <span>Return to Bazaar Map</span>
        </button>
      </div>
    </div>
  );
};

