import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { GateId } from '../engine/types';
import { NumericKeypad } from './NumericKeypad';

interface QuickCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockGate: (gate: GateId) => void;
}

interface DiagnosticQuestion {
  gateLevel: GateId;
  prompt: string;
  subPrompt: string;
  correctAnswer: number;
  hint: string;
}

const QUESTIONS: DiagnosticQuestion[] = [
  {
    gateLevel: 1,
    prompt: '47 + 39',
    subPrompt: 'Round 39 to 40, then fix!',
    correctAnswer: 86,
    hint: '47 + 40 = 87... minus 1 is 86.',
  },
  {
    gateLevel: 2,
    prompt: '65²',
    subPrompt: 'Squares ending in 5: n × (n + 1), attach 25',
    correctAnswer: 4225,
    hint: '6 × 7 = 42, attach 25 → 4225.',
  },
  {
    gateLevel: 3,
    prompt: '47 × 53',
    subPrompt: 'Balanced around 50: 50² − 3²',
    correctAnswer: 2491,
    hint: '2500 − 9 = 2491.',
  },
];

export const QuickCheckModal: React.FC<QuickCheckModalProps> = ({
  isOpen,
  onClose,
  onUnlockGate,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const q = QUESTIONS[currentIdx];

  const handleSubmit = () => {
    const parsed = parseInt(inputVal.trim(), 10);
    if (isNaN(parsed)) return;

    const nextAnswers = [...userAnswers, parsed];
    setUserAnswers(nextAnswers);
    setInputVal('');

    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsFinished(true);
    }
  };

  const score = userAnswers.reduce((acc, ans, idx) => {
    return ans === QUESTIONS[idx].correctAnswer ? acc + 1 : acc;
  }, 0);

  const recommendedGate: GateId = score >= 3 ? 3 : score >= 2 ? 2 : 1;

  const handleApplyRecommendation = () => {
    onUnlockGate(recommendedGate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/65 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-lg bg-paper paper-card border-2 border-ink/20 shadow-2xl p-6 sm:p-9">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 text-ink-muted hover:text-ink rounded-2xl cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {!isFinished ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3.5 py-1.5 bg-saffron-light text-saffron-dark rounded-full text-xs sm:text-sm font-display font-black">
                Quick Placement Check · Question {currentIdx + 1} of 3
              </span>
            </div>

            <h3 className="font-display font-black text-4xl sm:text-5xl text-ink text-center my-4 font-mono">
              {q.prompt}
            </h3>

            <p className="text-center text-sm sm:text-base font-semibold text-ink-soft mb-6">
              {q.subPrompt}
            </p>

            {/* Numeric Keypad for fast response */}
            <NumericKeypad
              value={inputVal}
              onChange={setInputVal}
              onSubmit={handleSubmit}
            />
          </div>
        ) : (
          <div className="text-center space-y-5">
            <div className="w-18 h-18 mx-auto rounded-full bg-saffron-light flex items-center justify-center text-saffron border-4 border-saffron shadow-md">
              <Sparkles className="w-9 h-9" />
            </div>

            <h3 className="font-display font-black text-2xl sm:text-4xl text-ink">
              Diagnostic Complete!
            </h3>

            <p className="font-display text-lg sm:text-xl text-ink-soft">
              You scored <span className="font-black text-ink font-mono">{score}/3</span>
            </p>

            <div className="p-4 sm:p-5 bg-card rounded-2xl border border-ink/15 text-left space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between text-xs font-black text-ink-muted uppercase tracking-wider">
                <span>QUESTION</span>
                <span>STATUS</span>
              </div>
              {QUESTIONS.map((item, i) => {
                const isCorrect = userAnswers[i] === item.correctAnswer;
                return (
                  <div key={i} className="flex items-center justify-between py-2 border-t border-ink/10 text-base">
                    <span className="font-mono font-bold">{item.prompt}</span>
                    <span className="flex items-center gap-2 font-bold">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-teal" />
                          <span className="text-teal font-black">Correct</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5 text-coral" />
                          <span className="text-coral">Got {userAnswers[i]}</span>
                        </>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="p-4 sm:p-5 bg-teal-light rounded-2xl border-2 border-teal/30 text-teal-hover">
              <span className="text-xs uppercase font-black tracking-wider block mb-1">
                Recommended Placement
              </span>
              <p className="font-display font-black text-2xl sm:text-3xl text-teal">
                Gate {recommendedGate}: {recommendedGate === 3 ? 'Master' : recommendedGate === 2 ? 'Flow' : 'Spark'}
              </p>
              <p className="text-xs sm:text-sm mt-1.5 text-ink-soft font-semibold">
                {recommendedGate > 1
                  ? 'We have unlocked this Gate so you can jump in right away!'
                  : 'Start at Gate 1 to master the core mental foundations!'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleApplyRecommendation}
              className="w-full py-4 bg-saffron hover:bg-saffron-hover text-white font-display font-black text-lg sm:text-xl rounded-2xl shadow-warm flex items-center justify-center gap-2.5 transition-all cursor-pointer drop-shadow-sm"
            >
              <span>Begin at Gate {recommendedGate}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

