/**
 * Voice Coaches Configuration (Shared between Client and Server)
 * Centralized configuration for all voice-enabled coaches in the SLE AI Companion
 * 
 * @description This file serves as the single source of truth for all coach voice configurations.
 * To add a new coach, simply add a new entry to the VOICE_COACHES object.
 * 
 * @author Manus AI
 * @version 2.0.0 - Multi-coach architecture
 */

export type SupportedLanguage = 'en' | 'fr';

export interface VoiceCoachConfig {
  /** Unique identifier for the coach */
  id: string;
  /** Display name of the coach */
  name: string;
  /** Full title with honorifics */
  title: string;
  /** MiniMax Voice ID for TTS */
  voiceId: string;
  /** Path to coach avatar image */
  avatar: string;
  /** Languages the coach can speak */
  languages: SupportedLanguage[];
  /** Coach's area of expertise */
  specialty: string;
  /** Short description for UI display */
  description: {
    en: string;
    fr: string;
  };
  /** System prompt for AI conversations */
  systemPrompt: string;
  /** Whether this coach is currently active */
  isActive: boolean;
  /** Primary color for UI theming (hex) */
  themeColor: string;
  /** Order in coach selection list */
  displayOrder: number;
}

/**
 * Voice Coaches Registry
 * Add new coaches here - they will automatically appear in the UI
 */
export const VOICE_COACHES: Record<string, VoiceCoachConfig> = {
  'prof-steven': {
    id: 'prof-steven',
    name: 'Prof. Steven',
    title: 'Professor Steven Barholere',
    voiceId: 'moss_audio_967c63af-eb64-11f0-ae84-1a25b61af6e2',
    avatar: '/coaches/prof-steven.png',
    languages: ['en', 'fr'],
    specialty: 'SLE Exam Preparation & Bilingual Excellence',
    description: {
      en: 'Your expert guide for SLE exam preparation and professional bilingual development.',
      fr: 'Votre guide expert pour la préparation aux examens ELS et le développement bilingue professionnel.',
    },
    systemPrompt: `You are Professor Steven Barholere, the founder and lead instructor at RusingAcademy. 
You are a warm, encouraging, and highly knowledgeable bilingual language coach specializing in helping Canadian public servants prepare for their Second Language Evaluation (SLE) exams.

Your teaching philosophy:
- Patient and supportive, celebrating small wins
- Practical and exam-focused, with real-world examples
- Bilingual excellence through immersive practice
- Building confidence alongside competence

When speaking:
- Use a professional yet approachable tone
- Provide clear, actionable feedback
- Encourage learners to practice both languages
- Reference SLE exam formats and expectations when relevant
- Keep responses concise but helpful (2-3 sentences for quick interactions)

You can seamlessly switch between English and French based on the learner's needs.`,
    isActive: true,
    themeColor: '#D4AF37', // Gold
    displayOrder: 1,
  },

  // ============================================
  // TEMPLATE FOR ADDING NEW COACHES
  // ============================================
  // 'coach-id': {
  //   id: 'coach-id',
  //   name: 'Coach Name',
  //   title: 'Full Title',
  //   voiceId: 'MINIMAX_VOICE_ID_HERE', // Clone voice in MiniMax first
  //   avatar: '/coaches/coach-name.png',
  //   languages: ['en', 'fr'],
  //   specialty: 'Area of expertise',
  //   description: {
  //     en: 'English description',
  //     fr: 'French description',
  //   },
  //   systemPrompt: `System prompt for AI behavior...`,
  //   isActive: true,
  //   themeColor: '#HEX_COLOR',
  //   displayOrder: 2,
  // },

  // Future coaches can be added here:
  // 'coach-marie': { ... },
  // 'coach-jean': { ... },
  // 'grammar-specialist': { ... },
};

/**
 * Get all active coaches sorted by display order
 */
export function getActiveCoaches(): VoiceCoachConfig[] {
  return Object.values(VOICE_COACHES)
    .filter((coach) => coach.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Get a specific coach by ID
 */
export function getCoachById(coachId: string): VoiceCoachConfig | undefined {
  return VOICE_COACHES[coachId];
}

/**
 * Get the default coach (first active coach)
 */
export function getDefaultCoach(): VoiceCoachConfig {
  const activeCoaches = getActiveCoaches();
  if (activeCoaches.length === 0) {
    throw new Error('No active coaches configured');
  }
  return activeCoaches[0];
}

/**
 * Get coaches that support a specific language
 */
export function getCoachesByLanguage(language: SupportedLanguage): VoiceCoachConfig[] {
  return getActiveCoaches().filter((coach) => coach.languages.includes(language));
}

/**
 * Check if a coach ID is valid
 */
export function isValidCoachId(coachId: string): boolean {
  return coachId in VOICE_COACHES && VOICE_COACHES[coachId].isActive;
}

export default VOICE_COACHES;
