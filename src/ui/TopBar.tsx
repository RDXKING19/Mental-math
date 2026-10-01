import React from 'react';
import {
  Home,
  MapPin,
  Settings as SettingsIcon,
  BookOpen,
  Sparkles,
  Star,
  HeartHandshake,
  Type,
  Target,
  Award,
} from 'lucide-react';
import { GateId, Phase } from '../engine/types';
import { GATES } from '../content/gatesData';
import { getPlayerLevel } from '../engine/gamification';

interface TopBarProps {
  currentGate: GateId;
  currentPhase?: Phase | 'map' | 'intro' | 'reflect' | 'celebration';
  xp: number;
  stars: number;
  streak?: number;
  scrollCount: number;
  calmMode: boolean;
  textSize: 'normal' | 'large' | 'xl';
  onNavigateMap: () => void;
  onNavigateHome: () => void;
  onToggleCalm: () => void;
  onToggleTextSize: () => void;
  onOpenSettings: () => void;
  onOpenTrickBook: () => void;
  onOpenDailyQuests?: () => void;
  onOpenAchievements?: () => void;
  onSelectPhase?: (phase: Phase) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentGate,
  currentPhase,
  xp,
  stars,
  streak,
  scrollCount,
  calmMode,
  textSize,
  onNavigateMap,
  onNavigateHome,
  onToggleCalm,
  onToggleTextSize,
  onOpenSettings,
  onOpenTrickBook,
  onOpenDailyQuests,
  onOpenAchievements,
  onSelectPhase,
}) => {
  const gateData = GATES[currentGate] || GATES[1];
  const levelInfo = getPlayerLevel(xp);

  const phases: { id: Phase; label: string; num: number }[] = [
    { id: 'wonder', label: 'Wonder', num: 1 },
    { id: 'story', label: 'Story', num: 2 },
    { id: 'simulate', label: 'Simulate', num: 3 },
    { id: 'practice', label: 'Practice', num: 4 },
  ];

  const isGatePhase =
    currentPhase === 'wonder' ||
    currentPhase === 'story' ||
    currentPhase === 'simulate' ||
    currentPhase === 'practice';

  return (
    <header className="h-16 sm:h-18 px-3 sm:px-6 bg-white/95 backdrop-blur-md border-b-2 border-amber-900/10 flex items-center justify-between shrink-0 select-none z-30 shadow-xs gap-2 overflow-x-hidden">
      {/* Left: Home, Map, Gate Badge */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onNavigateHome}
          className="p-2 sm:p-2.5 text-ink hover:text-saffron hover:bg-paper rounded-xl transition-all cursor-pointer active:scale-95"
          title="Home - Quick Minds Intro"
        >
          <Home className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          type="button"
          onClick={onNavigateMap}
          className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-paper hover:bg-paper-subtle text-ink font-display font-black text-xs sm:text-sm rounded-xl border border-ink/15 shadow-xs transition-all cursor-pointer active:scale-95"
          title="Bazaar Map"
        >
          <MapPin className="w-4 h-4 text-saffron shrink-0" />
          <span className="hidden md:inline">Bazaar Map</span>
        </button>

        {/* Gate Badge */}
        <div
          className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-xs sm:text-sm font-display font-black border-2 truncate max-w-[120px] sm:max-w-none"
          style={{
            backgroundColor: `${gateData.accentColor}18`,
            color: gateData.accentColor,
            borderColor: `${gateData.accentColor}50`,
          }}
        >
          <span className="hidden sm:inline">Gate {currentGate}:</span>
          <span className="truncate">{gateData.name}</span>
        </div>
      </div>

      {/* Center: 4-Phase Capsule (Shown when inside a Gate) */}
      {isGatePhase && (
        <nav
          aria-label="Gate Phases"
          className="hidden xl:flex items-center gap-1.5 bg-paper p-1.5 rounded-full border-2 border-ink/15 shadow-xs"
        >
          {phases.map(p => {
            const isActive = currentPhase === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectPhase?.(p.id)}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-display font-black transition-all cursor-pointer ${
                  isActive
                    ? 'bg-ink text-white shadow-sm'
                    : 'text-ink-soft hover:text-ink hover:bg-white'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-black ${
                    isActive ? 'bg-amber-400 text-ink' : 'bg-ink/10 text-ink'
                  }`}
                >
                  {p.num}
                </span>
                <span>{p.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Right: Gamification Badges & Core Controls (No theme/audio clutter) */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Quick Text Size Scaler */}
        <button
          type="button"
          onClick={onToggleTextSize}
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 bg-paper hover:bg-paper-subtle text-ink rounded-xl border border-ink/15 text-xs sm:text-sm font-display font-black transition-all cursor-pointer shadow-xs active:scale-95"
          title={`Text Size: ${textSize.toUpperCase()} (Cycle Normal/Large/XL)`}
        >
          <Type className="w-4 h-4 text-teal shrink-0" />
          <span className="font-mono uppercase font-black text-xs">
            {textSize === 'xl' ? 'XL' : textSize === 'large' ? 'L' : 'M'}
          </span>
        </button>

        {/* Player Level Badge */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-100 border-2 border-amber-400 rounded-xl text-amber-950 font-display text-xs font-black shadow-xs"
          title={`Level ${levelInfo.level}: ${levelInfo.title} (${levelInfo.progressPct}% to next tier)`}
        >
          <span className="text-sm">{levelInfo.badgeIcon}</span>
          <span className="truncate max-w-[80px]">Lv.{levelInfo.level}</span>
        </div>

        {/* Daily Quests Button */}
        {onOpenDailyQuests && (
          <button
            type="button"
            onClick={onOpenDailyQuests}
            className="hidden md:flex p-1.5 sm:p-2 bg-paper hover:bg-paper-subtle text-amber-700 rounded-xl border border-ink/15 transition-all cursor-pointer active:scale-95 shadow-xs"
            title="Daily Bazaar Quests"
          >
            <Target className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}

        {/* Achievements / Badges Button */}
        {onOpenAchievements && (
          <button
            type="button"
            onClick={onOpenAchievements}
            className="hidden md:flex p-1.5 sm:p-2 bg-paper hover:bg-paper-subtle text-purple-700 rounded-xl border border-ink/15 transition-all cursor-pointer active:scale-95 shadow-xs"
            title="Trophies & Badges"
          >
            <Award className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}

        {/* Trick Book Button */}
        <button
          type="button"
          onClick={onOpenTrickBook}
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 bg-paper hover:bg-paper-subtle text-ink rounded-xl border border-ink/15 text-xs sm:text-sm font-display font-black transition-all cursor-pointer shadow-xs active:scale-95"
          title="Open Trick Scrolls Book"
        >
          <BookOpen className="w-4 h-4 text-saffron shrink-0" />
          <span className="hidden sm:inline font-mono">{scrollCount}/32</span>
        </button>

        {/* Streak Flame Badge */}
        {streak !== undefined && streak >= 2 && (
          <div
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 bg-orange-100 border-2 border-orange-500 rounded-xl text-orange-950 font-mono text-xs sm:text-sm font-black shadow-xs animate-pulse"
            title={`Current Streak: ${streak} answers in a row!`}
          >
            <span className="text-sm">🔥</span>
            <span>{streak}</span>
          </div>
        )}

        {/* Stars */}
        <div
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 bg-amber-100 border-2 border-amber-400 rounded-xl text-amber-950 font-mono text-xs sm:text-sm font-black shadow-xs"
          title="Total Stars Earned (out of 45)"
        >
          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-500 text-amber-600 shrink-0" />
          <span>{stars}</span>
        </div>

        {/* XP */}
        <div
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 bg-orange-100 border-2 border-orange-400 rounded-xl text-orange-950 font-mono text-xs sm:text-sm font-black shadow-xs"
          title="Total XP Earned"
        >
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600 shrink-0" />
          <span>{xp}<span className="hidden sm:inline"> XP</span></span>
        </div>

        {/* Calm Mode Quick Toggle */}
        <button
          type="button"
          onClick={onToggleCalm}
          className={`p-1.5 sm:p-2 rounded-xl border-2 transition-all cursor-pointer active:scale-95 shadow-xs ${
            calmMode
              ? 'bg-emerald-100 text-emerald-900 border-emerald-500'
              : 'text-ink-muted hover:text-ink hover:bg-paper border-ink/15'
          }`}
          title={calmMode ? 'Calm Mode Active (Click to disable)' : 'Enable Calm Mode'}
        >
          <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Settings */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="p-1.5 sm:p-2 text-ink hover:bg-paper rounded-xl transition-all cursor-pointer active:scale-95 shadow-xs border border-ink/15"
          title="Settings & Preferences"
        >
          <SettingsIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </header>
  );
};
