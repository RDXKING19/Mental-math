import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Heart,
  Star,
  Sparkles,
  ArrowRight,
  HelpCircle,
  RotateCcw,
  Zap,
  CheckCircle2,
  AlertCircle,
  Shield,
  Bot,
} from 'lucide-react';
import { GateId, Problem } from '../../engine/types';
import { GATES } from '../../content/gatesData';
import { generateWorldQuestions } from '../../engine/generator';
import { createRng } from '../../engine/rng';
import { checkAnswer } from '../../engine/checker';
import { calculateXp, calculateStars, isGuardianPassed } from '../../engine/scoring';
import { NumericKeypad } from '../../ui/NumericKeypad';
import { ThoughtTrail } from '../../ui/ThoughtTrail';
import { SpeedRing } from '../../ui/SpeedRing';
import { ClickBot } from '../../ui/ClickBot';
import {
  playCorrect,
  playTryAgain,
  playFanfare,
  playStreak,
  playTap,
} from '../../services/audio';

interface PracticePlayScreenProps {
  gate: GateId;
  worldIndex: number;
  sessionSeed: number;
  calmMode: boolean;
  soundEnabled: boolean;
  onFinishWorld: (stars: 0 | 1 | 2 | 3, correctCount: number, earnedXp: number) => void;
  onBackToSelect: () => void;
  onTechniqueCorrect?: (techId: string) => void;
}

export const PracticePlayScreen: React.FC<PracticePlayScreenProps> = ({
  gate,
  worldIndex,
  sessionSeed,
  calmMode,
  soundEnabled,
  onFinishWorld,
  onBackToSelect,
  onTechniqueCorrect,
}) => {
  const gateData = GATES[gate];
  const worldDef = gateData.worlds[worldIndex] || gateData.worlds[0];

  // Generate 10 verified procedural questions
  const [questions] = useState<Problem[]>(() => {
    const rng = createRng(sessionSeed + gate * 100 + worldIndex * 10);
    return generateWorldQuestions(gate, worldIndex, rng);
  });

  const [questionIdx, setQuestionIdx] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [hearts, setHearts] = useState(3);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [accumulatedXp, setAccumulatedXp] = useState(0);

  // Question attempt tracking
  const [hasRetried, setHasRetried] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [elapsedMs, setElapsedMs] = useState(0);

  // Feedback display state
  const [feedback, setFeedback] = useState<{
    status: 'correct' | 'wrong';
    misconception?: string;
    earnedXp?: number;
  } | null>(null);

  // Boss Duel race tracking
  const [botProgress, setBotProgress] = useState(0);
  const [isWorldComplete, setIsWorldComplete] = useState(false);

  const currentProblem = questions[questionIdx] || questions[0];

  // Soft Timer interval
  useEffect(() => {
    if (feedback || isWorldComplete) return;
    const interval = setInterval(() => {
      setElapsedMs(Date.now() - questionStartTime);
    }, 100);
    return () => clearInterval(interval);
  }, [questionStartTime, feedback, isWorldComplete]);

  // Click Bot simulation for Boss Duel
  useEffect(() => {
    if (worldDef.mode !== 'boss' || feedback || isWorldComplete || calmMode) return;
    const botTargetMs = currentProblem.targetMs * 1.2;
    const interval = setInterval(() => {
      const elapsed = Date.now() - questionStartTime;
      const pct = Math.min(100, (elapsed / botTargetMs) * 100);
      setBotProgress(pct);
    }, 200);
    return () => clearInterval(interval);
  }, [questionStartTime, worldDef.mode, feedback, isWorldComplete, currentProblem, calmMode]);

  const handleSubmitAnswer = (chosenAnswer?: string | number) => {
    const answerToTest = chosenAnswer !== undefined ? chosenAnswer : typedAnswer;
    if (String(answerToTest).trim().length === 0) return;

    const ms = Date.now() - questionStartTime;
    const result = checkAnswer(answerToTest, currentProblem);

    if (result.correct) {
      playCorrect(soundEnabled);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak === 5) playStreak(soundEnabled);

      const xp = calculateXp(
        { correct: true, ms, hintUsed, retried: hasRetried },
        calmMode,
        currentProblem.targetMs,
        streak
      );

      setAccumulatedXp(prev => prev + xp);
      setCorrectCount(prev => prev + 1);
      onTechniqueCorrect?.(currentProblem.techniqueId);

      setFeedback({
        status: 'correct',
        earnedXp: xp,
      });
    } else {
      playTryAgain(soundEnabled);
      setStreak(0);
      if (!calmMode) {
        setHearts(prev => Math.max(0, prev - 1));
      }

      setFeedback({
        status: 'wrong',
        misconception: result.matchedMisconception,
      });
    }
  };

  const handleNextQuestion = () => {
    playTap(soundEnabled);
    setFeedback(null);
    setTypedAnswer('');
    setHasRetried(false);
    setHintUsed(false);
    setQuestionStartTime(Date.now());
    setElapsedMs(0);
    setBotProgress(0);

    if (questionIdx < questions.length - 1 && (calmMode || hearts > 0)) {
      setQuestionIdx(questionIdx + 1);
    } else {
      finishWorld();
    }
  };

  const handleRetryQuestion = () => {
    playTap(soundEnabled);
    setHasRetried(true);
    setFeedback(null);
    setTypedAnswer('');
  };

  const finishWorld = () => {
    setIsWorldComplete(true);
    const finalStars = calculateStars(correctCount);

    if (finalStars >= 3 || (worldDef.isGuardian && isGuardianPassed(correctCount))) {
      playFanfare(soundEnabled);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    onFinishWorld(finalStars, correctCount, accumulatedXp);
  };

  const handleUseHint = () => {
    playTap(soundEnabled);
    setHintUsed(true);
  };

  // World Completion View
  if (isWorldComplete) {
    const finalStars = calculateStars(correctCount);
    const guardianPassed = worldDef.isGuardian && isGuardianPassed(correctCount);

    return (
      <div className="h-full max-w-lg mx-auto p-6 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 rounded-full bg-saffron-light flex items-center justify-center text-saffron border-4 border-saffron shadow-lg">
          <Sparkles className="w-10 h-10" />
        </div>

        <div>
          <span className="font-mono text-xs font-bold text-saffron uppercase tracking-widest block mb-1">
            World {worldIndex + 1} Complete
          </span>
          <h2 className="font-display font-black text-3xl text-ink">
            {worldDef.name}
          </h2>
          {guardianPassed && (
            <span className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-teal-light text-teal font-display font-bold text-xs rounded-full border border-teal/30">
              <Shield className="w-4 h-4" /> Guardian Boss Defeated!
            </span>
          )}
        </div>

        {/* Stars Ceremony */}
        <div className="flex items-center gap-3">
          {[1, 2, 3].map(s => (
            <Star
              key={s}
              className={`w-12 h-12 transition-all ${
                s <= finalStars
                  ? 'fill-sun text-sun scale-110 drop-shadow-md animate-bounce'
                  : 'text-ink/15'
              }`}
            />
          ))}
        </div>

        {/* Stats Card */}
        <div className="w-full p-4 bg-card paper-card border border-ink/15 shadow-warm grid grid-cols-3 gap-2 text-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-ink-muted">Accuracy</span>
            <div className="font-mono text-xl font-bold text-ink">{correctCount}/10</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-ink-muted">XP Gained</span>
            <div className="font-mono text-xl font-bold text-saffron">+{accumulatedXp}</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-ink-muted">Stars</span>
            <div className="font-mono text-xl font-bold text-sun">{finalStars}★</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2">
          <button
            type="button"
            onClick={onBackToSelect}
            className="w-full py-3.5 bg-saffron hover:bg-saffron-hover text-white font-display font-black text-base rounded-xl shadow-warm flex items-center justify-center gap-2 transition-all active:scale-95 drop-shadow-sm cursor-pointer"
          >
            <span>Return to World Select</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Out of Hearts View (only in non-calm mode)
  if (!calmMode && hearts <= 0 && !feedback) {
    return (
      <div className="h-full max-w-md mx-auto p-6 flex flex-col items-center justify-center text-center space-y-5 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-coral-light flex items-center justify-center text-coral border-2 border-coral">
          <AlertCircle className="w-8 h-8" />
        </div>

        <h3 className="font-display font-extrabold text-2xl text-ink">
          Out of Hearts!
        </h3>
        <p className="text-xs sm:text-sm text-ink-soft">
          Don’t worry! Mental math is all about practice. Would you like to try this world again or switch to Calm Mode for unlimited retries?
        </p>

        <div className="w-full space-y-2 pt-2">
          <button
            type="button"
            onClick={() => {
              setHearts(3);
              setQuestionIdx(0);
              setStreak(0);
              setCorrectCount(0);
            }}
            className="w-full py-3 bg-saffron hover:bg-saffron-hover text-white font-display font-black text-sm rounded-xl shadow-warm flex items-center justify-center gap-2 drop-shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try World Again</span>
          </button>

          <button
            type="button"
            onClick={onBackToSelect}
            className="w-full py-2.5 bg-white hover:bg-paper text-ink font-display font-bold text-xs rounded-xl border border-ink/15"
          >
            Back to World Select
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full max-w-3xl mx-auto p-3 sm:p-6 flex flex-col justify-between overflow-y-auto">
      {/* Top Gameplay Bar: Progress, Hearts/Calm, Streak, SpeedRing, Exit */}
      <div className="flex items-center justify-between pb-3 border-b border-ink/10 shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToSelect}
            className="text-xs font-display font-bold text-ink-muted hover:text-ink"
          >
            ← Exit
          </button>

          <span className="font-mono text-sm sm:text-base font-black text-ink px-3 py-1 bg-paper rounded-xl border-2 border-ink/15 shadow-sm">
            {questionIdx + 1} / 10
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Streak indicator */}
          {streak >= 2 && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 text-white rounded-full text-xs sm:text-sm font-display font-black shadow-glow-saffron animate-bounce border border-orange-400">
              <Zap className="w-4 h-4 fill-white" />
              <span>{streak} Streak!</span>
            </div>
          )}

          {/* Hearts Display (or Calm badge) */}
          {calmMode ? (
            <span className="px-3 py-1 bg-teal-light text-teal rounded-full text-xs sm:text-sm font-extrabold border border-teal/40">
              Calm Mode
            </span>
          ) : (
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map(h => (
                <Heart
                  key={h}
                  className={`w-5 h-5 transition-all ${
                    h <= hearts ? 'fill-coral text-coral scale-105' : 'text-ink/20'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Speed Ring Timer */}
          <SpeedRing
            elapsedMs={elapsedMs}
            targetMs={currentProblem.targetMs}
            calmMode={calmMode}
            size={48}
          />
        </div>
      </div>

      {/* Boss Duel Bar if in Boss Mode */}
      {worldDef.mode === 'boss' && (
        <div className="my-2.5 p-3.5 bg-card paper-card border-2 border-coral/30 shadow-warm shrink-0">
          <ClickBot
            progress={botProgress}
            expression={botProgress > 80 ? 'smug' : botProgress > 50 ? 'calculating' : 'smug'}
            speech={botProgress > 70 ? 'I am almost done! Can you outspeed me?' : 'Clock cycles ramping up...'}
            size="sm"
          />
        </div>
      )}

      {/* Main Question Presentation (Massive, Clear, High-Contrast Typography) */}
      <div className="my-auto py-4 text-center space-y-5">
        {/* Technique Title Pill */}
        <span className="inline-block px-4 py-1.5 bg-paper rounded-full text-xs sm:text-sm font-mono font-bold text-ink-muted border-2 border-ink/10 shadow-sm">
          {currentProblem.techniqueId} · {currentProblem.explanation}
        </span>

        {/* Big Bold Problem Equation */}
        <h2 className="font-mono font-black text-5xl sm:text-7xl text-ink tracking-wide drop-shadow-sm">
          {currentProblem.prompt}
        </h2>

        {currentProblem.subPrompt && (
          <p className="text-sm sm:text-base text-ink-soft italic font-medium">
            {currentProblem.subPrompt}
          </p>
        )}

        {/* Hint Display (if used) */}
        {hintUsed && currentProblem.trail.length > 0 && (
          <div className="max-w-md mx-auto p-4 bg-saffron-light rounded-2xl border-2 border-saffron/40 text-sm text-ink font-medium text-left shadow-sm">
            <span className="font-display font-extrabold text-saffron-dark block mb-1">
              First Step Hint:
            </span>
            <span className="font-mono font-bold text-base">{currentProblem.trail[0].label}</span>
            {currentProblem.trail[0].note && <span> — {currentProblem.trail[0].note}</span>}
          </div>
        )}

        {/* Input Interface based on mode */}
        {!feedback && (
          <div className="pt-2">
            {/* Speed Sprint / Choice Mode (Multiple Choice Options) */}
            {(worldDef.mode === 'sprint' || worldDef.mode === 'spotter') && currentProblem.options ? (
              <div className="grid grid-cols-2 gap-3.5 max-w-md mx-auto">
                {currentProblem.options.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSubmitAnswer(opt.id)}
                    className="p-5 bg-card hover:bg-paper active:scale-95 border-2 border-ink/15 hover:border-saffron rounded-2xl shadow-warm font-mono text-2xl sm:text-3xl font-black text-ink transition-all hover:shadow-glow-saffron cursor-pointer"
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            ) : (
              /* Number Entry Mode via NumericKeypad */
              <NumericKeypad
                value={typedAnswer}
                onChange={setTypedAnswer}
                onSubmit={() => handleSubmitAnswer()}
                soundEnabled={soundEnabled}
              />
            )}
          </div>
        )}

        {/* Feedback Display (Correct / Misconception Trail) */}
        {feedback && (
          <div className="max-w-xl mx-auto space-y-4 animate-in zoom-in-95 duration-200">
            {feedback.status === 'correct' ? (
              <div className="p-5 bg-teal-light rounded-2xl border-2 border-teal/40 text-center space-y-1.5 shadow-warm">
                <span className="flex items-center justify-center gap-2 font-display font-black text-2xl text-teal">
                  <CheckCircle2 className="w-7 h-7" /> Brilliant! Correct!
                </span>
                <p className="text-sm sm:text-base text-teal-hover font-bold font-mono">
                  +{feedback.earnedXp} XP earned
                </p>
              </div>
            ) : (
              <div className="p-5 bg-coral-light rounded-2xl border-2 border-coral/40 text-left space-y-3.5 shadow-warm">
                <div className="flex items-center gap-2 text-coral font-display font-black text-lg sm:text-xl">
                  <AlertCircle className="w-6 h-6 shrink-0" />
                  <span>Not quite! Here is the strategy:</span>
                </div>

                {feedback.misconception && (
                  <p className="text-xs sm:text-sm text-ink font-medium bg-card p-3 rounded-xl border border-coral/20 leading-relaxed">
                    💡 <strong>Misconception Alert:</strong> {feedback.misconception}
                  </p>
                )}

                {/* Show Thought Trail */}
                <ThoughtTrail steps={currentProblem.trail} />
              </div>
            )}

            {/* Next or Retry CTA */}
            <div className="flex items-center justify-center gap-3 pt-2">
              {feedback.status === 'wrong' && !hasRetried && (
                <button
                  type="button"
                  onClick={handleRetryQuestion}
                  className="px-5 py-2.5 bg-card hover:bg-paper border border-ink/20 text-ink font-display font-bold text-sm rounded-xl shadow-sm cursor-pointer"
                >
                  Retry for Half XP (+5)
                </button>
              )}

              <button
                type="button"
                onClick={handleNextQuestion}
                className="px-6 py-2.5 bg-saffron hover:bg-saffron-hover text-white font-display font-black text-sm rounded-xl shadow-warm flex items-center gap-2 drop-shadow-sm cursor-pointer"
              >
                <span>{questionIdx < questions.length - 1 ? 'Next Question' : 'View Results'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      {!feedback && (
        <div className="pt-2 border-t border-ink/10 flex items-center justify-between text-xs text-ink-muted shrink-0">
          <button
            type="button"
            onClick={handleUseHint}
            disabled={hintUsed}
            className="flex items-center gap-1 hover:text-saffron disabled:opacity-40"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Hint (-3 XP)</span>
          </button>

          <span className="font-mono text-ink-soft">
            Target Pace: {(currentProblem.targetMs / 1000).toFixed(0)}s
          </span>
        </div>
      )}
    </div>
  );
};
