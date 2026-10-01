import { GateId, Phase } from '../engine/types';
import { ProgressV1 } from '../services/store';

export type ScreenState =
  | { kind: 'intro' }
  | { kind: 'map' }
  | { kind: 'wonder'; gate: GateId }
  | { kind: 'story'; gate: GateId; slideIndex: number }
  | { kind: 'simulate'; gate: GateId; station: 1 | 2 | 3; activityIndex: 0 | 1 | 2 }
  | { kind: 'practice_select'; gate: GateId }
  | { kind: 'practice_play'; gate: GateId; worldIndex: number }
  | { kind: 'reflect' }
  | { kind: 'celebration' };

export type Action =
  | { type: 'NAVIGATE_INTRO' }
  | { type: 'NAVIGATE_MAP' }
  | { type: 'NAVIGATE_GATE'; gate: GateId; phase?: Phase }
  | { type: 'NAVIGATE_STORY_SLIDE'; gate: GateId; slideIndex: number }
  | { type: 'NAVIGATE_SIMULATE'; gate: GateId; station: 1 | 2 | 3; activityIndex: 0 | 1 | 2 }
  | { type: 'NAVIGATE_PRACTICE_SELECT'; gate: GateId }
  | { type: 'NAVIGATE_PRACTICE_PLAY'; gate: GateId; worldIndex: number }
  | { type: 'NAVIGATE_REFLECT' }
  | { type: 'NAVIGATE_CELEBRATION' };

export function appReducer(state: ScreenState, action: Action): ScreenState {
  switch (action.type) {
    case 'NAVIGATE_INTRO':
      return { kind: 'intro' };

    case 'NAVIGATE_MAP':
      return { kind: 'map' };

    case 'NAVIGATE_GATE': {
      const phase = action.phase || 'wonder';
      if (phase === 'wonder') return { kind: 'wonder', gate: action.gate };
      if (phase === 'story') return { kind: 'story', gate: action.gate, slideIndex: 0 };
      if (phase === 'simulate') return { kind: 'simulate', gate: action.gate, station: 1, activityIndex: 0 };
      if (phase === 'practice') return { kind: 'practice_select', gate: action.gate };
      return { kind: 'wonder', gate: action.gate };
    }

    case 'NAVIGATE_STORY_SLIDE':
      return { kind: 'story', gate: action.gate, slideIndex: action.slideIndex };

    case 'NAVIGATE_SIMULATE':
      return {
        kind: 'simulate',
        gate: action.gate,
        station: action.station,
        activityIndex: action.activityIndex,
      };

    case 'NAVIGATE_PRACTICE_SELECT':
      return { kind: 'practice_select', gate: action.gate };

    case 'NAVIGATE_PRACTICE_PLAY':
      return { kind: 'practice_play', gate: action.gate, worldIndex: action.worldIndex };

    case 'NAVIGATE_REFLECT':
      return { kind: 'reflect' };

    case 'NAVIGATE_CELEBRATION':
      return { kind: 'celebration' };

    default:
      return state;
  }
}
