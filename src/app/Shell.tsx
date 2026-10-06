import React, { useReducer, useState, useEffect } from 'react';
import { appReducer, ScreenState } from './reducer';
import {
  loadProgress,
  saveProgress,
  resetProgress,
  ProgressV1,
  Settings,
} from '../services/store';
import { GateId, Phase } from '../engine/types';
import { TopBar } from '../ui/TopBar';
import { TrickBookModal } from '../ui/TrickBookModal';
import { QuickCheckModal } from '../ui/QuickCheckModal';
import { SettingsModal } from '../ui/SettingsModal';
import { DailyQuestModal } from '../ui/DailyQuestModal';
import { AchievementsModal } from '../ui/AchievementsModal';
import { IntroScreen } from '../screens/IntroScreen';
import { BazaarMap } from '../screens/BazaarMap';
import { WonderScreen } from '../screens/gate/WonderScreen';
import { StoryScreen } from '../screens/gate/StoryScreen';
import { SimulateScreen } from '../screens/gate/SimulateScreen';
import { PracticeSelectScreen } from '../screens/gate/PracticeSelectScreen';
import { PracticePlayScreen } from '../screens/gate/PracticePlayScreen';
import { ReflectScreen } from '../screens/ReflectScreen';
import { CelebrationScreen } from '../screens/CelebrationScreen';
import { stopNarration, setNarrationVoice, setElevenLabsKey } from '../services/audio';

export const Shell: React.FC = () => {
  const [progress, setProgress] = useState<ProgressV1>(() => loadProgress());
  const [screen, dispatch] = useReducer(appReducer, { kind: 'intro' });

  // Modal visibility states
  const [isTrickBookOpen, setIsTrickBookOpen] = useState(false);
  const [isQuickCheckOpen, setIsQuickCheckOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDailyQuestsOpen, setIsDailyQuestsOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);

  // Auto-save progress whenever it changes
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  // Sync ElevenLabs Voice and Key whenever updated
  useEffect(() => {
    if (progress.settings.voiceId) {
      setNarrationVoice(progress.settings.voiceId);
    }
    if (progress.settings.elevenLabsKey) {
      setElevenLabsKey(progress.settings.elevenLabsKey);
    }
  }, [progress.settings.voiceId, progress.settings.elevenLabsKey]);

  // Stop active speech whenever screen route changes
  useEffect(() => {
    stopNarration();
  }, [screen]);

  // Derived properties
  const currentGate: GateId =
    'gate' in screen ? screen.gate : progress.activeGate || 1;

  const currentPhase: Phase | 'map' | 'intro' | 'reflect' | 'celebration' =
    screen.kind === 'wonder'
      ? 'wonder'
      : screen.kind === 'story'
      ? 'story'
      : screen.kind === 'simulate'
      ? 'simulate'
      : screen.kind === 'practice_select' || screen.kind === 'practice_play'
      ? 'practice'
      : screen.kind;

  const totalStars = [1, 2, 3].reduce((acc, g) => {
    return acc + progress.gates[g as 1 | 2 | 3].worlds.reduce((wAcc, w) => wAcc + (w?.stars || 0), 0);
  }, 0);

  const earnedScrolls = Object.values(progress.scrolls).filter(s => s.earned).length;

  const handleUpdateSettings = (newSettings: Partial<Settings>) => {
    setProgress(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  };

  const handleReset = () => {
    const fresh = resetProgress();
    setProgress(fresh);
    dispatch({ type: 'NAVIGATE_INTRO' });
  };

  const handleUnlockGateFromQuickCheck = (gate: GateId) => {
    setProgress(prev => {
      const next = { ...prev, activeGate: gate };
      if (gate >= 2) next.gates[2].wonderSeen = true;
      if (gate >= 3) {
        next.gates[1].guardianPassed = true;
        next.gates[2].guardianPassed = true;
        next.gates[3].wonderSeen = true;
      }
      return next;
    });
    dispatch({ type: 'NAVIGATE_GATE', gate, phase: 'wonder' });
  };

  const handleTechniqueCorrect = (techId: string) => {
    setProgress(prev => {
      const existing = prev.scrolls[techId] || { correctCount: 0, earned: false };
      const nextCount = existing.correctCount + 1;
      const isEarned = nextCount >= 3 || existing.earned;
      return {
        ...prev,
        scrolls: {
          ...prev.scrolls,
          [techId]: { correctCount: nextCount, earned: isEarned },
        },
      };
    });
  };

  const handleFinishWorld = (
    gateId: GateId,
    worldIndex: number,
    stars: 0 | 1 | 2 | 3,
    correctCount: number,
    earnedXp: number
  ) => {
    setProgress(prev => {
      const gateProg = { ...prev.gates[gateId] };
      const currentWorld = gateProg.worlds[worldIndex];
      const bestStars = Math.max(stars, currentWorld?.stars || 0) as 0 | 1 | 2 | 3;
      const bestCorrect = Math.max(correctCount, currentWorld?.bestCorrect || 0);

      const nextWorlds = [...gateProg.worlds];
      nextWorlds[worldIndex] = {
        stars: bestStars,
        bestCorrect,
        attempts: (currentWorld?.attempts || 0) + 1,
        bestAvgMs: null,
      };
      gateProg.worlds = nextWorlds;

      // Check if world 5 (Guardian) was passed (>= 7/10)
      if (worldIndex === 4 && correctCount >= 7) {
        gateProg.guardianPassed = true;
      }

      return {
        ...prev,
        xp: prev.xp + earnedXp,
        gates: {
          ...prev.gates,
          [gateId]: gateProg,
        },
      };
    });
  };

  // Apply text size and theme attributes to HTML root
  useEffect(() => {
    document.documentElement.setAttribute('data-text-size', progress.settings.textSize || 'large');
    document.documentElement.setAttribute('data-theme', progress.settings.theme || 'cream');
  }, [progress.settings.textSize, progress.settings.theme]);

  // Stop ongoing voice narration whenever screen or phase changes
  useEffect(() => {
    stopNarration();
  }, [screen]);

  const handleToggleTextSize = () => {
    const current = progress.settings.textSize || 'large';
    const next: 'normal' | 'large' | 'xl' =
      current === 'normal' ? 'large' : current === 'large' ? 'xl' : 'normal';
    handleUpdateSettings({ textSize: next });
  };

  const handleClaimQuest = (questId: string, xpReward: number) => {
    setProgress(prev => ({
      ...prev,
      xp: prev.xp + xpReward,
      claimedQuestIds: [...(prev.claimedQuestIds || []), questId],
    }));
  };

  return (
    <div className="h-full flex flex-col bg-paper text-ink overflow-hidden">
      {/* Universal Top Bar */}
      <TopBar
        currentGate={currentGate}
        currentPhase={currentPhase}
        xp={progress.xp}
        stars={totalStars}
        streak={progress.streak}
        scrollCount={earnedScrolls}
        calmMode={progress.settings.calmMode}
        textSize={progress.settings.textSize || 'large'}
        muted={progress.settings.muted}
        onNavigateHome={() => dispatch({ type: 'NAVIGATE_INTRO' })}
        onNavigateMap={() => dispatch({ type: 'NAVIGATE_MAP' })}
        onToggleCalm={() => handleUpdateSettings({ calmMode: !progress.settings.calmMode })}
        onToggleTextSize={handleToggleTextSize}
        onToggleMute={() => {
          const nextMuted = !progress.settings.muted;
          if (nextMuted) stopNarration();
          handleUpdateSettings({ muted: nextMuted });
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenTrickBook={() => setIsTrickBookOpen(true)}
        onOpenDailyQuests={() => setIsDailyQuestsOpen(true)}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        onSelectPhase={(phase) => dispatch({ type: 'NAVIGATE_GATE', gate: currentGate, phase })}
      />

      {/* Main Dynamic Viewport Stage (100dvh, inner container scrolls) */}
      <main className="flex-1 min-h-0 overflow-y-auto relative">
        {screen.kind === 'intro' && (
          <IntroScreen
            onBegin={() => dispatch({ type: 'NAVIGATE_MAP' })}
            onOpenQuickCheck={() => setIsQuickCheckOpen(true)}
            calmMode={progress.settings.calmMode}
            onToggleCalm={() => handleUpdateSettings({ calmMode: !progress.settings.calmMode })}
            xp={progress.xp}
            streak={progress.streak}
            stars={totalStars}
            scrollCount={earnedScrolls}
            onAddXp={(amount) => setProgress(p => ({ ...p, xp: p.xp + amount }))}
            onIncrementStreak={() => setProgress(p => ({
              ...p,
              streak: p.streak + 1,
              bestStreak: Math.max(p.streak + 1, p.bestStreak),
            }))}
            onOpenDailyQuests={() => setIsDailyQuestsOpen(true)}
            onOpenAchievements={() => setIsAchievementsOpen(true)}
            onSelectGate={(gate) => dispatch({ type: 'NAVIGATE_GATE', gate, phase: 'wonder' })}
          />
        )}

        {screen.kind === 'map' && (
          <BazaarMap
            progress={progress}
            onSelectGate={(gate, phase) => dispatch({ type: 'NAVIGATE_GATE', gate, phase })}
            onOpenTrickBook={() => setIsTrickBookOpen(true)}
            onOpenQuickCheck={() => setIsQuickCheckOpen(true)}
            onNavigateReflect={() => dispatch({ type: 'NAVIGATE_REFLECT' })}
          />
        )}

        {screen.kind === 'wonder' && (
          <WonderScreen
            gate={screen.gate}
            muted={progress.settings.muted}
            captions={progress.settings.captions}
            autoNarrate={progress.settings.autoNarrate}
            onToggleMute={() => {
              const nextMuted = !progress.settings.muted;
              if (nextMuted) stopNarration();
              handleUpdateSettings({ muted: nextMuted });
            }}
            onToggleCaptions={() => handleUpdateSettings({ captions: !progress.settings.captions })}
            onContinue={() => dispatch({ type: 'NAVIGATE_STORY_SLIDE', gate: screen.gate, slideIndex: 0 })}
          />
        )}

        {screen.kind === 'story' && (
          <StoryScreen
            gate={screen.gate}
            initialSlideIndex={screen.slideIndex}
            muted={progress.settings.muted}
            captions={progress.settings.captions}
            autoNarrate={progress.settings.autoNarrate}
            onToggleMute={() => {
              const nextMuted = !progress.settings.muted;
              if (nextMuted) stopNarration();
              handleUpdateSettings({ muted: nextMuted });
            }}
            onToggleCaptions={() => handleUpdateSettings({ captions: !progress.settings.captions })}
            onFinishStory={() =>
              dispatch({
                type: 'NAVIGATE_SIMULATE',
                gate: screen.gate,
                station: 1,
                activityIndex: 0,
              })
            }
            onSlideChange={(idx) => {
              setProgress(prev => {
                const g = { ...prev.gates[screen.gate], storyIndex: idx };
                return { ...prev, gates: { ...prev.gates, [screen.gate]: g } };
              });
            }}
          />
        )}

        {screen.kind === 'simulate' && (
          <SimulateScreen
            gate={screen.gate}
            initialStation={screen.station}
            initialActivityIndex={screen.activityIndex}
            calmMode={progress.settings.calmMode}
            soundEnabled={!progress.settings.muted && progress.settings.soundEffects}
            onFinishSimulate={() => dispatch({ type: 'NAVIGATE_PRACTICE_SELECT', gate: screen.gate })}
            onUseHint={() => setProgress(prev => ({ ...prev, xp: Math.max(0, prev.xp - 3) }))}
          />
        )}

        {screen.kind === 'practice_select' && (
          <PracticeSelectScreen
            gate={screen.gate}
            gateProgress={progress.gates[screen.gate]}
            onSelectWorld={(worldIndex) =>
              dispatch({ type: 'NAVIGATE_PRACTICE_PLAY', gate: screen.gate, worldIndex })
            }
            onBackToMap={() => dispatch({ type: 'NAVIGATE_MAP' })}
          />
        )}

        {screen.kind === 'practice_play' && (
          <PracticePlayScreen
            gate={screen.gate}
            worldIndex={screen.worldIndex}
            sessionSeed={progress.sessionSeed}
            calmMode={progress.settings.calmMode}
            soundEnabled={!progress.settings.muted && progress.settings.soundEffects}
            onFinishWorld={(stars, correctCount, earnedXp) => {
              handleFinishWorld(screen.gate, screen.worldIndex, stars, correctCount, earnedXp);
            }}
            onBackToSelect={() => dispatch({ type: 'NAVIGATE_PRACTICE_SELECT', gate: screen.gate })}
            onTechniqueCorrect={handleTechniqueCorrect}
          />
        )}

        {screen.kind === 'reflect' && (
          <ReflectScreen
            progress={progress}
            onSaveReflection={(teachText) => {
              setProgress(prev => ({
                ...prev,
                reflections: { ...prev.reflections, teachGanu: teachText },
              }));
            }}
            onFinishReflect={() => dispatch({ type: 'NAVIGATE_CELEBRATION' })}
            onBackToMap={() => dispatch({ type: 'NAVIGATE_MAP' })}
            soundEnabled={!progress.settings.muted && progress.settings.soundEffects}
          />
        )}

        {screen.kind === 'celebration' && (
          <CelebrationScreen
            progress={progress}
            onBackToMap={() => dispatch({ type: 'NAVIGATE_MAP' })}
            soundEnabled={!progress.settings.muted && progress.settings.soundEffects}
          />
        )}
      </main>

      {/* Global Modals */}
      <TrickBookModal
        isOpen={isTrickBookOpen}
        onClose={() => setIsTrickBookOpen(false)}
        unlockedScrolls={progress.scrolls}
      />

      <QuickCheckModal
        isOpen={isQuickCheckOpen}
        onClose={() => setIsQuickCheckOpen(false)}
        onUnlockGate={handleUnlockGateFromQuickCheck}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={progress.settings}
        onUpdateSettings={handleUpdateSettings}
        onResetProgress={handleReset}
      />

      <DailyQuestModal
        isOpen={isDailyQuestsOpen}
        onClose={() => setIsDailyQuestsOpen(false)}
        xp={progress.xp}
        streak={progress.streak}
        starsCount={totalStars}
        scrollsCount={earnedScrolls}
        claimedQuestIds={progress.claimedQuestIds || []}
        soundEnabled={progress.settings.soundEffects}
        onClaimQuest={handleClaimQuest}
      />

      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        xp={progress.xp}
        streak={progress.streak}
        bestStreak={progress.bestStreak}
        starsCount={totalStars}
        scrollsCount={earnedScrolls}
        fastestMs={progress.fastestCorrectMs}
        gateGuardianBeaten={progress.gates[1].guardianPassed}
      />
    </div>
  );
};
