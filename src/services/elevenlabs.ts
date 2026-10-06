/**
 * ElevenLabs Text-to-Speech Service
 * Provides natural voice narration for the Mental Math learning module.
 * Features:
 * - Pre-generated audio manifest support (public/audio/manifest.json)
 * - ElevenLabs TTS API integration with fast eleven_turbo_v2_5 model
 * - Automatic IndexedDB caching for zero-latency instant replays and quota conservation
 * - Math symbol translation (e.g. '×' -> 'times', '÷' -> 'divided by', '²' -> 'squared')
 * - Graceful fallback to browser speechSynthesis if offline or rate limited
 * - Real-time narration state subscriptions for UI waveform animations & captions
 */

export const DEFAULT_ELEVENLABS_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ELEVENLABS_API_KEY) || '';

export interface VoiceOption {
  id: string;
  name: string;
  desc: string;
  gender: 'female' | 'male';
}

export const ELEVENLABS_VOICES: VoiceOption[] = [
  {
    id: '21m00Tcm4TlvDq8ikWAM',
    name: 'Rachel',
    desc: 'Warm, calm, and articulate educator',
    gender: 'female',
  },
  {
    id: 'JBFqnCBsd6RMkjVDRZzb',
    name: 'George',
    desc: 'Warm, friendly storyteller (Ganu)',
    gender: 'male',
  },
  {
    id: 'EXAVITQu4vr4xnSDxMaL',
    name: 'Bella',
    desc: 'Lively, cheerful, and encouraging',
    gender: 'female',
  },
];

export const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

export type NarrationStatus = 'idle' | 'loading' | 'playing' | 'paused';

export interface NarrationState {
  status: NarrationStatus;
  currentText: string;
  voiceName: string;
  isFallback: boolean;
}

type NarrationListener = (state: NarrationState) => void;

class ElevenLabsService {
  private apiKey: string = DEFAULT_ELEVENLABS_KEY;
  private voiceId: string = DEFAULT_VOICE_ID;
  private currentAudio: HTMLAudioElement | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private objectUrlMap: Map<string, string> = new Map();
  private dbPromise: Promise<IDBDatabase> | null = null;
  private manifest: Record<string, { file: string; text: string }> | null = null;
  private manifestLoaded = false;
  private listeners: Set<NarrationListener> = new Set();
  private activeRequestId: number = 0;
  private abortController: AbortController | null = null;
  private state: NarrationState = {
    status: 'idle',
    currentText: '',
    voiceName: 'Rachel',
    isFallback: false,
  };

  constructor() {
    this.initIndexedDB();
    this.loadManifest();
  }

  private async loadManifest(): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      const res = await fetch('./audio/manifest.json');
      if (res.ok) {
        this.manifest = await res.json();
      }
    } catch {
      // Manifest is optional (runtime generation & IndexedDB caching handles missing files)
    } finally {
      this.manifestLoaded = true;
    }
  }

  public setApiKey(key: string): void {
    if (key && key.trim()) {
      this.apiKey = key.trim();
    }
  }

  public getApiKey(): string {
    return this.apiKey;
  }

  public setVoice(voiceId: string): void {
    this.voiceId = voiceId;
    const v = ELEVENLABS_VOICES.find(item => item.id === voiceId);
    this.updateState({ voiceName: v ? v.name : 'Rachel' });
  }

  public getVoice(): string {
    return this.voiceId;
  }

  public getState(): NarrationState {
    return { ...this.state };
  }

  public subscribe(listener: NarrationListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private updateState(partial: Partial<NarrationState>): void {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach(fn => {
      try {
        fn(this.getState());
      } catch (err) {
        console.error('Narration listener error:', err);
      }
    });
  }

  private initIndexedDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB not supported'));
        return;
      }
      const req = window.indexedDB.open('mental_math_audio_cache_v2', 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('audio_blobs')) {
          db.createObjectStore('audio_blobs');
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

    return this.dbPromise;
  }

  private async getCachedAudio(cacheKey: string): Promise<Blob | null> {
    try {
      const db = await this.initIndexedDB();
      return new Promise(resolve => {
        const tx = db.transaction('audio_blobs', 'readonly');
        const store = tx.objectStore('audio_blobs');
        const req = store.get(cacheKey);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }

  private async setCachedAudio(cacheKey: string, blob: Blob): Promise<void> {
    try {
      const db = await this.initIndexedDB();
      const tx = db.transaction('audio_blobs', 'readwrite');
      const store = tx.objectStore('audio_blobs');
      store.put(blob, cacheKey);
    } catch (err) {
      console.warn('Failed to cache audio blob in IndexedDB:', err);
    }
  }

  public prepareTextForSpeech(text: string): string {
    if (!text) return '';

    return text
      .replace(/(\d+)\s*×\s*(\d+)/g, '$1 times $2')
      .replace(/×/g, ' times ')
      .replace(/(\d+)\s*÷\s*(\d+)/g, '$1 divided by $2')
      .replace(/÷/g, ' divided by ')
      .replace(/(\d+)\s*−\s*(\d+)/g, '$1 minus $2')
      .replace(/−/g, ' minus ')
      .replace(/(\d+)\s*-\s*(\d+)/g, '$1 minus $2')
      .replace(/(\d+)²/g, '$1 squared')
      .replace(/²/g, ' squared')
      .replace(/(\d+)³/g, '$1 cubed')
      .replace(/(\d+)%/g, '$1 percent')
      .replace(/%/g, ' percent')
      .replace(/(\d+)\s*=\s*(\d+)/g, '$1 equals $2')
      .replace(/=/g, ' equals ')
      .replace(/\+/g, ' plus ')
      .replace(/≈/g, ' approximately ')
      .replace(/[""]/g, '"')
      .replace(/['']/g, "'")
      .replace(/&ldquo;|&rdquo;/g, '"')
      .replace(/&lsquo;|&rsquo;/g, "'")
      .replace(/⚡|🔥|⭐|✨|🎯|💡|🏆|🎉|🌟|👏|👍/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private generateCacheKey(text: string, voiceId: string): string {
    return `${voiceId}_${text.toLowerCase().trim()}`;
  }

  private async fetchAudioBlob(text: string, voiceId: string, signal?: AbortSignal): Promise<Blob> {
    const cacheKey = this.generateCacheKey(text, voiceId);

    // 1. Check IndexedDB
    const cached = await this.getCachedAudio(cacheKey);
    if (cached) {
      return cached;
    }

    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    // 2. Fetch from ElevenLabs API
    const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      signal,
      headers: {
        'xi-api-key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2_5',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`ElevenLabs TTS failed [${response.status}]: ${errText}`);
    }

    const blob = await response.blob();
    await this.setCachedAudio(cacheKey, blob);
    return blob;
  }

  public async speak(
    rawText: string,
    options?: {
      isMuted?: boolean;
      voiceId?: string;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: unknown) => void;
    }
  ): Promise<void> {
    // Invalidate any previous or in-flight speech requests
    this.activeRequestId++;
    const thisRequestId = this.activeRequestId;

    // Hard stop and abort any ongoing audio or speech immediately
    this.stopInternal();

    if (options?.isMuted) {
      return;
    }

    const spokenText = this.prepareTextForSpeech(rawText);
    if (!spokenText) {
      return;
    }

    const targetVoiceId = options?.voiceId || this.voiceId;
    const voiceObj = ELEVENLABS_VOICES.find(v => v.id === targetVoiceId);
    const voiceName = voiceObj ? voiceObj.name : 'Rachel';

    this.updateState({
      status: 'loading',
      currentText: rawText,
      voiceName,
      isFallback: false,
    });

    // Check if a pre-generated file exists in manifest
    const cacheKey = this.generateCacheKey(spokenText, targetVoiceId);
    if (this.manifest && this.manifest[cacheKey]) {
      const pregenFile = `./audio/${this.manifest[cacheKey].file}`;
      const audio = new Audio(pregenFile);

      if (this.activeRequestId !== thisRequestId) return;
      this.currentAudio = audio;

      audio.onplay = () => {
        if (this.activeRequestId !== thisRequestId) {
          audio.pause();
          return;
        }
        this.updateState({ status: 'playing' });
        options?.onStart?.();
      };
      audio.onended = () => {
        if (this.activeRequestId !== thisRequestId) return;
        this.currentAudio = null;
        this.updateState({ status: 'idle', currentText: '' });
        options?.onEnd?.();
      };
      audio.onerror = () => {
        if (this.activeRequestId !== thisRequestId) return;
        this.playLiveTTS(spokenText, rawText, targetVoiceId, options, thisRequestId);
      };

      try {
        await audio.play();
        return;
      } catch {
        if (this.activeRequestId !== thisRequestId) return;
        // Continue to live TTS
      }
    }

    await this.playLiveTTS(spokenText, rawText, targetVoiceId, options, thisRequestId);
  }

  private async playLiveTTS(
    spokenText: string,
    rawText: string,
    targetVoiceId: string,
    options?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: unknown) => void;
    },
    requestId?: number
  ): Promise<void> {
    const thisRequestId = requestId ?? this.activeRequestId;
    if (this.activeRequestId !== thisRequestId) return;

    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    try {
      const blob = await this.fetchAudioBlob(spokenText, targetVoiceId, signal);

      // Check again if a new speak() was called while fetching
      if (this.activeRequestId !== thisRequestId) return;

      const cacheKey = this.generateCacheKey(spokenText, targetVoiceId);
      let audioUrl = this.objectUrlMap.get(cacheKey);
      if (!audioUrl) {
        audioUrl = URL.createObjectURL(blob);
        this.objectUrlMap.set(cacheKey, audioUrl);
      }

      if (this.activeRequestId !== thisRequestId) return;

      const audio = new Audio(audioUrl);
      this.currentAudio = audio;

      audio.onplay = () => {
        if (this.activeRequestId !== thisRequestId) {
          audio.pause();
          return;
        }
        this.updateState({ status: 'playing' });
        options?.onStart?.();
      };

      audio.onended = () => {
        if (this.activeRequestId !== thisRequestId) return;
        this.currentAudio = null;
        this.updateState({ status: 'idle', currentText: '' });
        options?.onEnd?.();
      };

      audio.onerror = (e) => {
        if (this.activeRequestId !== thisRequestId) return;
        console.warn('Audio playback error, switching to Web Speech fallback', e);
        this.fallbackWebSpeech(spokenText, rawText, options, thisRequestId);
      };

      await audio.play();
    } catch (err: unknown) {
      if (this.activeRequestId !== thisRequestId) return;
      if (err instanceof DOMException && err.name === 'AbortError') return;

      console.warn('ElevenLabs API unavailable or failed, utilizing browser SpeechSynthesis:', err);
      this.fallbackWebSpeech(spokenText, rawText, options, thisRequestId);
    }
  }

  private fallbackWebSpeech(
    spokenText: string,
    originalText: string,
    options?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: unknown) => void;
    },
    requestId?: number
  ): void {
    const thisRequestId = requestId ?? this.activeRequestId;
    if (this.activeRequestId !== thisRequestId) return;

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.updateState({ status: 'idle', currentText: '' });
      options?.onEnd?.();
      return;
    }

    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }

    const utterance = new SpeechSynthesisUtterance(spokenText);
    this.currentUtterance = utterance;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice =
      voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny'))) ||
      voices.find(v => v.lang.startsWith('en')) ||
      voices[0];

    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      if (this.activeRequestId !== thisRequestId) {
        try {
          window.speechSynthesis.cancel();
        } catch {
          // ignore
        }
        return;
      }
      this.updateState({
        status: 'playing',
        currentText: originalText,
        isFallback: true,
        voiceName: englishVoice ? englishVoice.name.split(' ')[0] : 'Browser Voice',
      });
      options?.onStart?.();
    };

    utterance.onend = () => {
      if (this.activeRequestId !== thisRequestId) return;
      this.currentUtterance = null;
      this.updateState({ status: 'idle', currentText: '' });
      options?.onEnd?.();
    };

    utterance.onerror = (e) => {
      if (this.activeRequestId !== thisRequestId) return;
      this.currentUtterance = null;
      this.updateState({ status: 'idle', currentText: '' });
      options?.onError?.(e);
      options?.onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  }

  public pause(): void {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.currentAudio.pause();
      this.updateState({ status: 'paused' });
    } else if (this.currentUtterance && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      this.updateState({ status: 'paused' });
    }
  }

  public resume(): void {
    if (this.currentAudio && this.currentAudio.paused) {
      this.currentAudio.play();
      this.updateState({ status: 'playing' });
    } else if (this.currentUtterance && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
      this.updateState({ status: 'playing' });
    }
  }

  private stopInternal(): void {
    if (this.abortController) {
      try {
        this.abortController.abort();
      } catch {
        // ignore
      }
      this.abortController = null;
    }

    if (this.currentAudio) {
      try {
        this.currentAudio.onplay = null;
        this.currentAudio.onended = null;
        this.currentAudio.onerror = null;
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio.removeAttribute('src');
        this.currentAudio.load();
      } catch {
        // ignore
      }
      this.currentAudio = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
      this.currentUtterance = null;
    }
  }

  public stop(): void {
    this.activeRequestId++;
    this.stopInternal();
    this.updateState({ status: 'idle', currentText: '' });
  }

  public isNarrating(): boolean {
    return this.state.status === 'playing' || this.state.status === 'loading';
  }
}

export const elevenLabsService = new ElevenLabsService();
