/**
 * Pre-generation script for narration audio files
 * Usage: npm run generate-audio
 * Reads ELEVENLABS_API_KEY from .env.local and generates mp3 clips for core story and wonder lines.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables from .env.local
function loadEnv() {
  const envPath = path.join(rootDir, '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const [key, ...vals] = trimmed.split('=');
      const val = vals.join('=').trim();
      if (key && val) {
        process.env[key.trim()] = val;
      }
    }
  }
}

loadEnv();

const apiKey =
  process.env.ELEVENLABS_API_KEY ||
  process.env.VITE_ELEVENLABS_API_KEY ||
  '';

if (!apiKey) {
  console.warn('⚠️ No ELEVENLABS_API_KEY found in environment or .env.local.');
}

const voiceId = '21m00Tcm4TlvDq8ikWAM'; // Rachel
const audioDir = path.join(rootDir, 'public', 'audio');
const manifestPath = path.join(audioDir, 'manifest.json');

if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

let manifest = {};
if (fs.existsSync(manifestPath)) {
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch {
    manifest = {};
  }
}

function prepareTextForSpeech(text) {
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

// Key lines to pre-generate for Gate 1
const LINES_TO_GENERATE = [
  '99 × 7 in three seconds?. Ira’s cash register went black, but 99 × 7 is right there in the air!',
  'Think of 99 as 100 − 1.',
  '100 × 7 = 700.',
  'Now take away one 7: 700 − 7 = 693!',
  'The Queue is Getting Long. The market was bustling at sunrise. Suddenly, Ira’s electronic till flashed red and died. "When screens turn off, real mental agility turns on." Ganu says: Don’t panic, Ira! Your brain is ten times faster than any silicone chip!',
];

async function generateLine(rawText) {
  const spokenText = prepareTextForSpeech(rawText);
  const hash = crypto.createHash('sha1').update(voiceId + spokenText).digest('hex').slice(0, 10);
  const filename = `${hash}.mp3`;
  const filePath = path.join(audioDir, filename);
  const cacheKey = `${voiceId}_${spokenText.toLowerCase().trim()}`;

  if (fs.existsSync(filePath)) {
    console.log(`[CACHED] ${filename} - "${spokenText.slice(0, 40)}..."`);
    manifest[cacheKey] = { file: filename, text: rawText };
    return;
  }

  console.log(`[GENERATING] ${filename} - "${spokenText.slice(0, 40)}..."`);
  const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: spokenText,
      model_id: 'eleven_turbo_v2_5',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ElevenLabs error [${response.status}]: ${err}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
  manifest[cacheKey] = { file: filename, text: rawText };
  console.log(`[SAVED] ${filename}`);
}

async function run() {
  console.log('--- Generating Audio Clips with ElevenLabs Turbo 2.5 ---');
  for (const line of LINES_TO_GENERATE) {
    try {
      await generateLine(line);
    } catch (err) {
      console.error('Error generating clip:', err.message);
    }
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`Manifest updated with ${Object.keys(manifest).length} clips at ${manifestPath}`);
  console.log('--- Audio Generation Complete ---');
}

run();
