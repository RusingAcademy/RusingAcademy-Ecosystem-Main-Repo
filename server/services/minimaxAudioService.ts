/**
 * MiniMax Audio Service
 * 
 * Generates French pronunciation audio using MiniMax text-to-speech API
 * for listening exercises and pronunciation guides in the learning platform.
 * 
 * Uses high-value French voices from MiniMax Voice Library:
 * https://www.minimax.io/audio/voices
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import https from 'https';
import http from 'http';

const execAsync = promisify(exec);

// High-Value French Voices from MiniMax
// These are professional-grade voices optimized for educational content
export const FRENCH_VOICES = {
  // Male voices - ideal for formal instruction and narration
  MALE_NARRATOR: 'French_MaleNarrator',           // Professional narrator voice
  LEVEL_HEADED_MAN: 'French_Male_Speech_New',     // Clear, composed delivery
  CASUAL_MAN: 'French_CasualMan',                 // Conversational, approachable
  
  // Female voices - ideal for varied content and engagement
  FEMALE_ANCHOR: 'French_Female_News Anchor',     // Patient, professional presenter
  MOVIE_LEAD_FEMALE: 'French_MovieLeadFemale',    // Expressive, engaging
  FEMALE_NEWS: 'French_FemaleAnchor',             // Clear broadcast style
} as const;

// English high-value voices for bilingual content
export const ENGLISH_VOICES = {
  // Recommended voices from MiniMax
  COMPELLING_LADY: 'English_compelling_lady1',     // Bright, articulate storyteller
  CAPTIVATING_FEMALE: 'English_captivating_female1', // Clear, authoritative
  TRUSTWORTHY_MAN: 'English_Trustworth_Man',       // Warm, mentor-like
  GENTLE_TEACHER: 'English_Gentle-voiced_man',     // Patient, educational
  EXPRESSIVE_NARRATOR: 'English_expressive_narrator', // Crisp, modulated
  MAGNETIC_MALE: 'English_magnetic_voiced_man',    // Deep, polished
} as const;

export type FrenchVoice = typeof FRENCH_VOICES[keyof typeof FRENCH_VOICES];
export type EnglishVoice = typeof ENGLISH_VOICES[keyof typeof ENGLISH_VOICES];

// Cloned Coach Voices from MiniMax (for personalized coaching)
export const COACH_VOICES = {
  STEVEN: 'moss_audio_b813fbba-c1d2-11f0-a527-aab150a40f84',      // Coach Steven Barholere
  SUE_ANNE: 'moss_audio_2abcced5-f449-11f0-beb6-9609078c1ee2',    // Coach Sue-Anne
  ERIKA: 'moss_audio_738f5bca-f448-11f0-aff0-8af3c85499ec',       // Coach Erika
  PRECIOSA: 'moss_audio_a784f0fe-f448-11f0-9e6a-0a02ecbdcfa7',    // Coach Preciosa
} as const;

export type CoachVoice = typeof COACH_VOICES[keyof typeof COACH_VOICES];

export interface AudioGenerationOptions {
  text: string;
  voiceId?: FrenchVoice | EnglishVoice | string;
  speed?: number; // 0.5 to 2.0, default 1.0
  emotion?: 'happy' | 'sad' | 'angry' | 'fearful' | 'disgusted' | 'surprised' | 'neutral';
  languageBoost?: 'French' | 'English' | 'auto';
  outputDirectory?: string;
  filename?: string;
}

export interface AudioGenerationResult {
  success: boolean;
  filePath?: string;
  publicUrl?: string;
  remoteUrl?: string;
  error?: string;
  voiceUsed?: string;
}

/**
 * Download a file from URL to local path
 */
async function downloadFile(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = require('fs').createWriteStream(destPath);
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          file.close();
          downloadFile(redirectUrl, destPath).then(resolve).catch(reject);
          return;
        }
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      require('fs').unlink(destPath, () => {}); // Delete partial file
      reject(err);
    });
  });
}

/**
 * Generate audio using MiniMax API with high-value voices
 */
export async function generateAudio(options: AudioGenerationOptions): Promise<AudioGenerationResult> {
  const {
    text,
    voiceId = FRENCH_VOICES.MALE_NARRATOR,
    speed = 1.0,
    emotion = 'neutral',
    languageBoost = 'French',
    outputDirectory = '/home/ubuntu/ecosystemhub-preview/client/public/audio',
    filename,
  } = options;

  try {
    // Ensure output directory exists
    await fs.mkdir(outputDirectory, { recursive: true });

    // Prepare MCP command input - note: MiniMax returns URL, we need to download
    const input = JSON.stringify({
      text,
      voice_id: voiceId,
      speed,
      emotion,
      language_boost: languageBoost,
      format: 'mp3',
      sample_rate: 32000,
      bitrate: 128000,
      output_directory: outputDirectory,
    });

    // Execute MiniMax text_to_audio via MCP
    const { stdout, stderr } = await execAsync(
      `manus-mcp-cli tool call text_to_audio --server minimax --input '${input.replace(/'/g, "'\\''")}'`,
      { timeout: 120000 } // 2 minute timeout for longer texts
    );

    // Parse result - extract URL from output
    const urlMatch = stdout.match(/Audio URL:\s*(https?:\/\/[^\s\n]+)/i) ||
                     stdout.match(/(https?:\/\/[^\s\n]+\.mp3[^\s\n]*)/i);
    
    if (urlMatch) {
      const remoteUrl = urlMatch[1];
      
      // Generate local filename
      const timestamp = Date.now();
      const localFilename = filename || `audio_${timestamp}.mp3`;
      const localPath = path.join(outputDirectory, localFilename);
      
      // Download the file
      await downloadFile(remoteUrl, localPath);
      
      // Verify file exists
      const stats = await fs.stat(localPath);
      if (stats.size > 0) {
        const publicUrl = localPath.replace(
          '/home/ubuntu/ecosystemhub-preview/client/public',
          ''
        );
        return {
          success: true,
          filePath: localPath,
          publicUrl,
          remoteUrl,
          voiceUsed: voiceId,
        };
      }
    }

    // Check for error in output
    if (stderr && !stderr.includes('Tool execution result')) {
      console.error('MiniMax audio generation error:', stderr);
      return { success: false, error: stderr };
    }

    return { success: false, error: 'Failed to generate or download audio' };
  } catch (error) {
    console.error('MiniMax audio generation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Generate French pronunciation guide audio
 * Uses professional narrator voice with slightly slower speed for learning
 */
export async function generateFrenchPronunciation(
  phrase: string,
  options?: {
    lessonId?: number;
    voiceGender?: 'male' | 'female';
    speed?: number;
    filename?: string;
  }
): Promise<AudioGenerationResult> {
  const outputDir = '/home/ubuntu/ecosystemhub-preview/client/public/audio/pronunciation';
  const voice = options?.voiceGender === 'female' 
    ? FRENCH_VOICES.FEMALE_ANCHOR 
    : FRENCH_VOICES.MALE_NARRATOR;
  
  const filename = options?.filename || 
    (options?.lessonId ? `lesson_${options.lessonId}_${Date.now()}.mp3` : undefined);
  
  return generateAudio({
    text: phrase,
    voiceId: voice,
    speed: options?.speed || 0.85, // Slightly slower for pronunciation learning
    emotion: 'neutral',
    languageBoost: 'French',
    outputDirectory: outputDir,
    filename,
  });
}

/**
 * Generate listening comprehension audio
 * Uses natural speed with clear articulation
 */
export async function generateListeningExercise(
  text: string,
  options?: {
    exerciseId?: number;
    voiceGender?: 'male' | 'female';
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    filename?: string;
  }
): Promise<AudioGenerationResult> {
  const outputDir = '/home/ubuntu/ecosystemhub-preview/client/public/audio/listening';
  
  // Select voice based on gender preference
  const voice = options?.voiceGender === 'female' 
    ? FRENCH_VOICES.MOVIE_LEAD_FEMALE  // More expressive for engagement
    : FRENCH_VOICES.LEVEL_HEADED_MAN;   // Clear and composed
  
  // Adjust speed based on difficulty level
  let speed = 1.0;
  if (options?.difficulty === 'beginner') speed = 0.85;
  else if (options?.difficulty === 'advanced') speed = 1.1;
  
  return generateAudio({
    text,
    voiceId: voice,
    speed,
    emotion: 'neutral',
    languageBoost: 'French',
    outputDirectory: outputDir,
    filename: options?.filename,
  });
}

/**
 * Generate conversation dialogue audio with alternating voices
 */
export async function generateDialogue(
  lines: Array<{ speaker: 'male' | 'female'; text: string }>,
  dialogueId: number
): Promise<{ results: AudioGenerationResult[]; success: boolean }> {
  const results: AudioGenerationResult[] = [];
  const outputDir = '/home/ubuntu/ecosystemhub-preview/client/public/audio/dialogues';
  
  await fs.mkdir(outputDir, { recursive: true });
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const voice = line.speaker === 'male' 
      ? FRENCH_VOICES.CASUAL_MAN        // Conversational male
      : FRENCH_VOICES.MOVIE_LEAD_FEMALE; // Expressive female
    
    const result = await generateAudio({
      text: line.text,
      voiceId: voice,
      speed: 1.0,
      emotion: 'neutral',
      languageBoost: 'French',
      outputDirectory: outputDir,
      filename: `dialogue_${dialogueId}_line_${i + 1}.mp3`,
    });
    
    results.push(result);
  }
  
  const allSuccessful = results.every(r => r.success);
  return { results, success: allSuccessful };
}

/**
 * Generate English pronunciation for bilingual exercises
 */
export async function generateEnglishPronunciation(
  phrase: string,
  options?: {
    voiceGender?: 'male' | 'female';
    speed?: number;
    filename?: string;
  }
): Promise<AudioGenerationResult> {
  const outputDir = '/home/ubuntu/ecosystemhub-preview/client/public/audio/english';
  const voice = options?.voiceGender === 'female' 
    ? ENGLISH_VOICES.COMPELLING_LADY 
    : ENGLISH_VOICES.TRUSTWORTHY_MAN;
  
  return generateAudio({
    text: phrase,
    voiceId: voice,
    speed: options?.speed || 0.9,
    emotion: 'neutral',
    languageBoost: 'English',
    outputDirectory: outputDir,
    filename: options?.filename,
  });
}

/**
 * Generate SLE exam practice audio
 * Uses formal, clear voices appropriate for exam preparation
 */
export async function generateSLEPracticeAudio(
  text: string,
  type: 'oral_comprehension' | 'oral_expression' | 'reading',
  level: 'A' | 'B' | 'C',
  filename?: string
): Promise<AudioGenerationResult> {
  const outputDir = '/home/ubuntu/ecosystemhub-preview/client/public/audio/sle';
  
  // Use professional anchor voice for SLE content
  const voice = FRENCH_VOICES.FEMALE_ANCHOR;
  
  // Adjust speed based on level
  let speed = 1.0;
  if (level === 'A') speed = 0.9;      // Slightly slower for Level A
  else if (level === 'C') speed = 1.05; // Natural speed for Level C
  
  return generateAudio({
    text,
    voiceId: voice,
    speed,
    emotion: 'neutral',
    languageBoost: 'French',
    outputDirectory: outputDir,
    filename: filename || `sle_${type}_${level}_${Date.now()}.mp3`,
  });
}

/**
 * Batch generate pronunciation audio for multiple phrases
 */
export async function batchGeneratePronunciation(
  phrases: Array<{ text: string; id: string }>,
  voiceGender: 'male' | 'female' = 'male'
): Promise<Map<string, AudioGenerationResult>> {
  const results = new Map<string, AudioGenerationResult>();
  
  for (const phrase of phrases) {
    const result = await generateFrenchPronunciation(phrase.text, {
      voiceGender,
      filename: `pronunciation_${phrase.id}.mp3`,
    });
    results.set(phrase.id, result);
    
    // Small delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return results;
}

/**
 * Generate personalized coaching audio using cloned coach voices
 */
export async function generateCoachAudio(
  text: string,
  coachName: 'steven' | 'sue_anne' | 'erika' | 'preciosa',
  options?: {
    speed?: number;
    filename?: string;
  }
): Promise<AudioGenerationResult> {
  const outputDir = '/home/ubuntu/ecosystemhub-preview/client/public/audio/coaching';
  
  const voiceMap = {
    steven: COACH_VOICES.STEVEN,
    sue_anne: COACH_VOICES.SUE_ANNE,
    erika: COACH_VOICES.ERIKA,
    preciosa: COACH_VOICES.PRECIOSA,
  };
  
  return generateAudio({
    text,
    voiceId: voiceMap[coachName],
    speed: options?.speed || 1.0,
    emotion: 'neutral',
    languageBoost: 'French',
    outputDirectory: outputDir,
    filename: options?.filename,
  });
}

export default {
  generateAudio,
  generateFrenchPronunciation,
  generateListeningExercise,
  generateDialogue,
  generateEnglishPronunciation,
  generateSLEPracticeAudio,
  batchGeneratePronunciation,
  generateCoachAudio,
  FRENCH_VOICES,
  ENGLISH_VOICES,
  COACH_VOICES,
};
