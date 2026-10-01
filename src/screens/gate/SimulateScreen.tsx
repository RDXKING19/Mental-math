import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Bot,
  AlertCircle,
} from 'lucide-react';
import { GateId } from '../../engine/types';
import { GATES, ActivityDef } from '../../content/gatesData';
import { BeadRail } from '../../ui/BeadRail';
import { NumberLineHopper } from '../../ui/NumberLineHopper';
import { BaseBalance } from '../../ui/BaseBalance';
import { CrossGridVisual } from '../../ui/CrossGridVisual';
import { ClickBot } from '../../ui/ClickBot';
import { NumericKeypad } from '../../ui/NumericKeypad';
import { playCorrect, playTryAgain, playTap } from '../../services/audio';

interface SimulateScreenProps {
  gate: GateId;
  initialStation?: 1 | 2 | 3;
  initialActivityIndex?: 0 | 1 | 2;
  calmMode: boolean;
  soundEnabled: boolean;
  onFinishSimulate: () => void;
  onActivityComplete?: (activityId: string) => void;
  onUseHint?: () => void;
}

export const SimulateScreen: React.FC<SimulateScreenProps> = ({
  gate,
  initialStation = 1,
  initialActivityIndex = 0,
  calmMode,
  soundEnabled,
  onFinishSimulate,
  onActivityComplete,
  onUseHint,
}) => {
  const gateData = GATES[gate];
  const activities = gateData.activities;

  const [selectedStation, setSelectedStation] = useState<1 | 2 | 3>(initialStation);
  const [selectedActivityIndex, setSelectedActivityIndex] = useState<0 | 1 | 2>(initialActivityIndex);
  const [showHint, setShowHint] = useState(false);
  const [isActivityDone, setIsActivityDone] = useState(false);

  // Generic activity states
  const [typedInput, setTypedInput] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Error detective state
  const [selectedErrorLine, setSelectedErrorLine] = useState<number | null>(null);

  // Bot duel state (for miniBotDuel)
  const [duelRound, setDuelRound] = useState(1);
  const [duelPlayerScore, setDuelPlayerScore] = useState(0);

  const currentActivity: ActivityDef =
    activities.find(
      a => a.station === selectedStation && a.activityIndex === selectedActivityIndex
    ) || activities[0];

  const handleSelectActivity = (station: 1 | 2 | 3, index: 0 | 1 | 2) => {
    playTap(soundEnabled);
    setSelectedStation(station);
    setSelectedActivityIndex(index);
    setShowHint(false);
    setIsActivityDone(false);
    setTypedInput('');
    setFeedbackMsg(null);
    setSelectedErrorLine(null);
    setDuelRound(1);
    setDuelPlayerScore(0);
  };

  const handleCompleteCurrent = () => {
    playCorrect(soundEnabled);
    setIsActivityDone(true);
    onActivityComplete?.(currentActivity.id);
  };

  const handleNextActivity = () => {
    if (selectedActivityIndex < 2) {
      handleSelectActivity(selectedStation, (selectedActivityIndex + 1) as 0 | 1 | 2);
    } else if (selectedStation < 3) {
      handleSelectActivity((selectedStation + 1) as 1 | 2 | 3, 0);
    } else {
      onFinishSimulate();
    }
  };

  const handleHintClick = () => {
    playTap(soundEnabled);
    setShowHint(true);
    onUseHint?.();
  };

  return (
    <div className="h-full max-w-6xl mx-auto p-3 sm:p-6 flex flex-col justify-between overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-ink/10 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="px-3.5 py-1.5 bg-teal-light text-teal font-display font-black text-xs sm:text-sm rounded-full uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4" /> Phase 3 · Simulate Lab
          </span>
          <span className="text-xs sm:text-sm font-mono font-bold text-ink-muted">
            Gate {gate}: {gateData.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleHintClick}
            disabled={showHint || isActivityDone}
            className="flex items-center gap-2 px-3.5 py-2 bg-paper hover:bg-paper-subtle text-ink font-display font-bold text-xs sm:text-sm rounded-2xl border border-ink/15 transition-all disabled:opacity-40 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-saffron" />
            <span>Hint (-3 XP)</span>
          </button>
        </div>
      </div>

      {/* Main Stage: Responsive Layout (Compact Tabs on Mobile, Left Sidebar on Desktop) */}
      <div className="flex-1 min-h-0 my-3 flex flex-col md:flex-row gap-4 overflow-hidden">
        {/* Mobile Station & Activity Pill Selector (< md) */}
        <div className="md:hidden flex flex-col gap-2 shrink-0 bg-card paper-card p-3 border-2 border-ink/15 shadow-sm">
          {/* Station Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {([1, 2, 3] as const).map(st => {
              const isActive = selectedStation === st;
              const label =
                st === 1
                  ? '👁️ 1. Understand'
                  : st === 2
                  ? '✍️ 2. Try It'
                  : '⚔️ 3. Duel';
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleSelectActivity(st, 0)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-display font-black whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-teal text-white shadow-warm'
                      : 'bg-paper text-ink-soft hover:text-ink border border-ink/10'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Activity Pills for current station */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {activities
              .filter(a => a.station === selectedStation)
              .map(act => {
                const isSelected = selectedActivityIndex === act.activityIndex;
                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => handleSelectActivity(act.station, act.activityIndex)}
                    className={`flex-1 min-w-[120px] px-2.5 py-1.5 rounded-xl text-xs font-display font-bold truncate transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-saffron text-white shadow-sm font-black ring-2 ring-saffron/40 drop-shadow-xs'
                        : 'bg-paper text-ink-soft hover:bg-card border border-ink/10'
                    }`}
                  >
                    Act {act.activityIndex + 1}: {act.title}
                  </button>
                );
              })}
          </div>
        </div>

        {/* Desktop Left Sidebar (>= md): 3 Stations with 3 Activities Each */}
        <div className="hidden md:block w-80 bg-card paper-card border-2 border-ink/15 shadow-sm p-3.5 overflow-y-auto shrink-0 space-y-3.5">
          {[1, 2, 3].map(stationNum => {
            const st = stationNum as 1 | 2 | 3;
            const stationTitle =
              st === 1
                ? '1 · Understand (Visuals)'
                : st === 2
                ? '2 · Try It Yourself'
                : '3 · Solve Alone & Duel';

            const stationActivities = activities.filter(a => a.station === st);

            return (
              <div key={st} className="space-y-1.5">
                <span className="text-xs font-display font-black uppercase tracking-wider text-ink-muted px-2 block">
                  Station {stationTitle}
                </span>

                <div className="space-y-1.5">
                  {stationActivities.map(act => {
                    const isSelected =
                      selectedStation === act.station &&
                      selectedActivityIndex === act.activityIndex;

                    return (
                      <button
                        key={act.id}
                        type="button"
                        onClick={() => handleSelectActivity(act.station, act.activityIndex)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-display font-bold transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-teal text-white shadow-warm font-black scale-[1.02]'
                            : 'bg-paper/70 hover:bg-paper text-ink border border-ink/10'
                        }`}
                      >
                        <span className="truncate">{act.title}</span>
                        {isSelected && <ArrowRight className="w-4 h-4 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Panel: Interactive Canvas */}
        <div className="flex-1 bg-card paper-card border-2 border-ink/15 shadow-warm p-4 sm:p-7 overflow-y-auto flex flex-col justify-between">
          <div>
            {/* Activity Info Header */}
            <div className="mb-4">
              <span className="text-xs sm:text-sm font-mono font-bold text-teal uppercase tracking-wider">
                {currentActivity.stationTitle}
              </span>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-ink mt-0.5">
                {currentActivity.title}
              </h3>
              <p className="text-sm sm:text-base font-semibold text-ink-soft mt-1">
                {currentActivity.instruction}
              </p>
            </div>

            {/* Hint Banner if requested */}
            {showHint && (
              <div className="mb-4 p-4 bg-amber-500/15 rounded-2xl border-2 border-amber-500/50 flex items-start gap-3 text-sm text-ink font-medium animate-in fade-in duration-200">
                <HelpCircle className="w-5 h-5 text-saffron shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-saffron font-display font-black">
                    Strategy Tip from Ganu:
                  </strong>
                  <span className="text-ink-soft font-semibold">{currentActivity.rule}</span>
                </div>
              </div>
            )}

            {/* Dynamic Activity Render Canvas */}
            <div className="my-2">
              {/* 1. Bead Rail */}
              {currentActivity.type === 'beadRail' && (
                <BeadRail
                  initialValue={47}
                  targetValue={85}
                  soundEnabled={soundEnabled}
                  onTargetReached={handleCompleteCurrent}
                />
              )}

              {/* 2. Number Line Hopper */}
              {currentActivity.type === 'numberLine' && (
                <NumberLineHopper
                  start={58}
                  hopTens={20}
                  hopOnes={7}
                  soundEnabled={soundEnabled}
                  onComplete={handleCompleteCurrent}
                />
              )}

              {/* 3. Base Balance */}
              {currentActivity.type === 'baseBalance' && (
                <BaseBalance
                  a={97}
                  b={94}
                  soundEnabled={soundEnabled}
                  onComplete={handleCompleteCurrent}
                />
              )}

              {/* 4. Cross Lines */}
              {currentActivity.type === 'crossLines' && (
                <CrossGridVisual
                  a={23}
                  b={14}
                  soundEnabled={soundEnabled}
                  onComplete={handleCompleteCurrent}
                />
              )}

              {/* 5. Round Fix Builder */}
              {currentActivity.type === 'roundFixBuilder' && (
                <div className="p-5 sm:p-6 bg-paper rounded-2xl border border-ink/10 space-y-4">
                  <div className="text-center">
                    <span className="font-mono text-3xl sm:text-4xl font-black text-ink">47 + 39</span>
                    <p className="text-sm font-semibold text-ink-soft mt-1.5">
                      Choose the friendly round number to add, then select the fix:
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setTypedInput('40')}
                      className={`px-5 py-3 rounded-2xl font-mono text-base font-bold border transition-all cursor-pointer ${
                        typedInput === '40'
                          ? 'bg-teal text-white border-teal shadow-warm font-black scale-105'
                          : 'bg-card border-ink/15 text-ink hover:bg-paper'
                      }`}
                    >
                      Step 1: Jump +40 (to 87)
                    </button>

                    <button
                      type="button"
                      disabled={typedInput !== '40'}
                      onClick={() => {
                        handleCompleteCurrent();
                        setFeedbackMsg('Brilliant! 47 + 40 = 87, minus 1 = 86.');
                      }}
                      className="px-5 py-3 rounded-2xl font-mono text-base font-bold bg-card hover:bg-paper border border-ink/15 text-ink disabled:opacity-40 transition-all cursor-pointer"
                    >
                      Step 2: Fix −1 (to 86)
                    </button>
                  </div>
                </div>
              )}

              {/* 6. Nine Machine */}
              {currentActivity.type === 'nineMachine' && (
                <div className="p-5 sm:p-6 bg-paper rounded-2xl border border-ink/10 space-y-5">
                  <div className="text-center">
                    <span className="font-mono text-3xl sm:text-4xl font-black text-ink">17 × 9</span>
                    <p className="text-sm font-semibold text-ink-soft mt-1.5">
                      Calculate 17 × 10 first, then take away one 17:
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    <div className="p-4 bg-card rounded-2xl border border-ink/10 text-center shadow-sm">
                      <span className="text-xs uppercase font-extrabold text-ink-muted">17 × 10</span>
                      <div className="font-mono text-2xl sm:text-3xl font-black text-ink mt-1">170</div>
                    </div>
                    <div className="p-4 bg-card rounded-2xl border border-ink/10 text-center shadow-sm">
                      <span className="text-xs uppercase font-extrabold text-teal">− 17</span>
                      <div className="font-mono text-2xl sm:text-3xl font-black text-teal mt-1">153</div>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        handleCompleteCurrent();
                        setFeedbackMsg('17 × 9 = 170 − 17 = 153! The Nine Machine never fails.');
                      }}
                      className="px-7 py-3.5 bg-saffron hover:bg-saffron-hover text-white font-display font-black text-base sm:text-lg rounded-2xl shadow-warm cursor-pointer transition-all active:scale-95 drop-shadow-sm"
                    >
                      Verify Nine-Machine Rule
                    </button>
                  </div>
                </div>
              )}

              {/* 7. Error Detective */}
              {currentActivity.type === 'errorDetective' && (
                <div className="p-5 sm:p-6 bg-paper rounded-2xl border border-ink/10 space-y-4">
                  <p className="text-sm sm:text-base font-bold text-ink">
                    Click the line where the calculation made a misconception slip:
                  </p>

                  <div className="space-y-3">
                    {[
                      { line: 1, text: 'Problem: 83 − 48' },
                      { line: 2, text: 'Step 1: Round 48 up to 50: 83 − 50 = 33 (Valid round)' },
                      { line: 3, text: 'Step 2: Subtracted 2 too many, so subtract 2 again: 33 − 2 = 31 (SLIP!)' },
                    ].map(item => (
                      <button
                        key={item.line}
                        type="button"
                        onClick={() => {
                          setSelectedErrorLine(item.line);
                          if (item.line === 3) {
                            handleCompleteCurrent();
                            setFeedbackMsg('Found it! Because you subtracted 50 (2 too much), you must ADD 2 back (+2), giving 35!');
                          } else {
                            playTryAgain(soundEnabled);
                            setFeedbackMsg('This line is correct. Look closely at the final adjustment fix!');
                          }
                        }}
                        className={`w-full text-left p-4 rounded-2xl border text-sm sm:text-base font-mono font-bold transition-all cursor-pointer ${
                          selectedErrorLine === item.line
                            ? item.line === 3
                              ? 'bg-teal-light border-teal text-teal shadow-sm'
                              : 'bg-coral-light border-coral text-coral shadow-sm'
                            : 'bg-card border-ink/15 text-ink hover:bg-paper'
                        }`}
                      >
                        {item.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 8. Mini Bot Duel */}
              {currentActivity.type === 'miniBotDuel' && (
                <div className="p-5 sm:p-6 bg-paper rounded-2xl border border-ink/10 space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-black text-xs sm:text-sm uppercase text-ink-muted">
                      Round {duelRound} of 3
                    </span>
                    <span className="font-mono text-sm sm:text-base font-black text-saffron">
                      Score: {duelPlayerScore} - {duelRound - 1 - duelPlayerScore >= 0 ? duelRound - 1 - duelPlayerScore : 0}
                    </span>
                  </div>

                  <ClickBot
                    progress={(duelRound / 3) * 60}
                    expression={duelPlayerScore >= 2 ? 'panicked' : 'smug'}
                    speech={duelPlayerScore >= 2 ? 'Beep! Your mental shortcuts are faster than my CPU!' : 'Can you out-calculate my clock cycle?'}
                  />

                  <div className="p-5 sm:p-6 bg-card rounded-2xl border border-ink/10 text-center space-y-3 shadow-sm">
                    <span className="font-mono text-3xl sm:text-4xl font-black text-ink block">
                      {duelRound === 1 ? '36 × 5' : duelRound === 2 ? '97 × 94' : '47 × 53'}
                    </span>
                    <p className="text-sm font-semibold text-ink-soft">
                      {duelRound === 1 ? 'Double and halve!' : duelRound === 2 ? 'Nikhilam near 100' : 'Difference of squares'}
                    </p>

                    <div className="flex justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setDuelPlayerScore(duelPlayerScore + 1);
                          if (duelRound < 3) {
                            setDuelRound(duelRound + 1);
                          } else {
                            handleCompleteCurrent();
                            setFeedbackMsg('Victory! You defeated Click Bot across all 3 mini rounds!');
                          }
                        }}
                        className="px-7 py-3 bg-saffron hover:bg-saffron-hover text-white font-display font-black text-base sm:text-lg rounded-2xl shadow-warm cursor-pointer transition-all active:scale-95 drop-shadow-sm"
                      >
                        {duelRound === 1 ? '180' : duelRound === 2 ? '9118' : '2491'} (Correct)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Default Fallback Interactive Simulator */}
              {!['beadRail', 'numberLine', 'baseBalance', 'crossLines', 'roundFixBuilder', 'nineMachine', 'errorDetective', 'miniBotDuel'].includes(currentActivity.type) && (
                <div className="p-6 bg-paper rounded-2xl border border-ink/10 space-y-4 text-center">
                  <div className="p-5 bg-card rounded-2xl border border-ink/15">
                    <span className="font-mono text-3xl font-black text-ink">
                      {currentActivity.title}
                    </span>
                    <p className="text-base text-ink-soft mt-1.5 font-semibold">
                      {currentActivity.rule}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      handleCompleteCurrent();
                      setFeedbackMsg('Activity validated! You have mastered this concept.');
                    }}
                    className="px-7 py-3.5 bg-teal hover:bg-teal-hover text-white font-display font-black text-base sm:text-lg rounded-2xl shadow-warm cursor-pointer transition-all active:scale-95"
                  >
                    Confirm & Complete Exploration
                  </button>
                </div>
              )}
            </div>

            {/* Feedback Message */}
            {feedbackMsg && (
              <div className="mt-4 p-4 bg-teal-light rounded-2xl border-2 border-teal/40 text-teal text-sm sm:text-base font-bold animate-in fade-in duration-200">
                {feedbackMsg}
              </div>
            )}
          </div>

          {/* Bottom Completion Card & Next CTA */}
          <div className="pt-4 border-t border-ink/10 flex items-center justify-between gap-3">
            <div className="text-sm font-bold text-ink-muted">
              {isActivityDone ? (
                <span className="text-teal font-display font-black flex items-center gap-1.5 text-base">
                  <CheckCircle2 className="w-5 h-5" /> Activity Complete!
                </span>
              ) : (
                <span>Complete the task above to proceed</span>
              )}
            </div>

            <button
              type="button"
              onClick={handleNextActivity}
              className="px-7 py-3.5 bg-saffron hover:bg-saffron-hover text-white font-display font-black text-base sm:text-lg rounded-2xl shadow-warm flex items-center gap-2.5 transition-all active:scale-95 cursor-pointer drop-shadow-sm"
            >
              <span>
                {selectedStation === 3 && selectedActivityIndex === 2
                  ? 'Go to Practice Map'
                  : 'Next Activity'}
              </span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

