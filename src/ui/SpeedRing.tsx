import React from 'react';
import { Zap, HeartHandshake } from 'lucide-react';

interface SpeedRingProps {
  elapsedMs: number;
  targetMs: number;
  calmMode?: boolean;
  size?: number;
  className?: string;
}

export const SpeedRing: React.FC<SpeedRingProps> = ({
  elapsedMs,
  targetMs,
  calmMode = false,
  size = 44,
  className = '',
}) => {
  if (calmMode) {
    return (
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 bg-teal-light text-teal rounded-full text-xs font-medium border border-teal/20 ${className}`}
        title="Calm Mode Active: No time pressure"
      >
        <HeartHandshake className="w-3.5 h-3.5" />
        <span>Calm</span>
      </div>
    );
  }

  const strokeWidth = 3.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const remainingFraction = Math.max(0, 1 - elapsedMs / targetMs);
  const strokeDashoffset = circumference * (1 - remainingFraction);
  const isSpeedBonusEligible = elapsedMs <= targetMs;

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      title={
        isSpeedBonusEligible
          ? 'Speed bonus eligible (+5 XP)'
          : 'Normal pace (+10 XP on correct)'
      }
    >
      <svg width={size} height={size} className="-rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-ink/10"
          strokeWidth={strokeWidth}
        />
        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className={`transition-all duration-100 ${
            isSpeedBonusEligible ? 'text-saffron' : 'text-ink-muted'
          }`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <Zap
        className={`absolute w-4 h-4 ${
          isSpeedBonusEligible ? 'text-saffron animate-pulse' : 'text-ink-muted'
        }`}
      />
    </div>
  );
};
