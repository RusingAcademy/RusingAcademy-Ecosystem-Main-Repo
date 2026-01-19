/**
 * Voice API Routes for RusingAcademy SLE AI Companion
 * 
 * TTS: MiniMax API with Steven Barholere's cloned voice
 * STT: OpenAI Whisper API
 * 
 * @author Manus AI
 * @version 1.0.0
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
// Using native fetch (Node.js 22+)
// Using native FormData (Node.js 22+)
import { Readable } from 'stream';

const router = Router();

// ============================================================================
// CONFIGURATION
// ============================================================================

// MiniMax API Configuration
const MINIMAX_GROUP_ID = process.env.MINIMAX_GROUP_ID || '1939950841343512593';
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;
const MINIMAX_TTS_ENDPOINT = `https://api.minimax.chat/v1/t2a_v2?GroupId=${MINIMAX_GROUP_ID}`;

// Steven Barholere 2 - Confirmed Voice ID from MiniMax Voice Library
const STEVEN_VOICE_ID = process.env.STEVEN_VOICE_ID || 'moss_audio_967c63af-eb64-11f0-ae84-1a25b61af6e2';

// OpenAI Configuration for Whisper STT
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_BASE = process.env.OPENAI_API_BASE || 'https://api.openai.com/v1';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const ttsRequestSchema = z.object({
  text: z.string().min(1).max(5000),
  language: z.enum(['en', 'fr']).default('en'),
  speed: z.number().min(0.5).max(2.0).default(1.0),
  emotion: z.enum(['neutral', 'happy', 'serious', 'encouraging']).default('encouraging'),
});

const sttRequestSchema = z.object({
  audio: z.string(), // Base64 encoded audio
  language: z.enum(['en', 'fr']).optional(),
});

// ============================================================================
// TEXT-TO-SPEECH (TTS) - MiniMax API
// ============================================================================

/**
 * POST /api/voice/tts
 * Convert text to speech using MiniMax with Steven's cloned voice
 */
router.post('/tts', async (req: Request, res: Response) => {
  try {
    const validation = ttsRequestSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request',
        details: validation.error.errors,
      });
    }

    const { text, language, speed, emotion } = validation.data;

    if (!MINIMAX_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'MiniMax API key not configured',
      });
    }

    const emotionSettings = {
      neutral: { pitch: 0, volume_gain: 0 },
      happy: { pitch: 2, volume_gain: 1 },
      serious: { pitch: -2, volume_gain: -1 },
      encouraging: { pitch: 1, volume_gain: 2 },
    };

    const settings = emotionSettings[emotion];

    const ttsPayload = {
      model: 'speech-01-turbo',
      text: text,
      stream: false,
      voice_setting: {
        voice_id: STEVEN_VOICE_ID,
        speed: speed,
        vol: 1.0,
        pitch: settings.pitch,
      },
      audio_setting: {
        sample_rate: 32000,
        bitrate: 128000,
        format: 'mp3',
        channel: 1,
      },
      language_boost: language === 'fr' ? 'French' : 'English',
    };

    console.log('[TTS] Generating speech for:', text.substring(0, 50) + '...');

    const response = await fetch(MINIMAX_TTS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MINIMAX_API_KEY}`,
      },
      body: JSON.stringify(ttsPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[TTS] MiniMax API error:', errorText);
      return res.status(response.status).json({
        success: false,
        error: 'TTS generation failed',
        details: errorText,
      });
    }

    const result = await response.json() as any;

    if (result.data?.audio) {
      return res.json({
        success: true,
        audio: result.data.audio,
        format: 'mp3',
        duration: result.data.audio_length || null,
        voiceId: STEVEN_VOICE_ID,
      });
    } else if (result.audio_file) {
      return res.json({
        success: true,
        audioUrl: result.audio_file,
        format: 'mp3',
        voiceId: STEVEN_VOICE_ID,
      });
    } else {
      console.error('[TTS] Unexpected response format:', result);
      return res.status(500).json({
        success: false,
        error: 'Unexpected TTS response format',
      });
    }
  } catch (error) {
    console.error('[TTS] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// ============================================================================
// SPEECH-TO-TEXT (STT) - OpenAI Whisper
// ============================================================================

/**
 * POST /api/voice/stt
 * Transcribe audio to text using OpenAI Whisper
 */
router.post('/stt', async (req: Request, res: Response) => {
  try {
    const validation = sttRequestSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request',
        details: validation.error.errors,
      });
    }

    const { audio, language } = validation.data;

    if (!OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'OpenAI API key not configured',
      });
    }

    const audioBuffer = Buffer.from(audio, 'base64');

    // Create a Blob from the audio buffer for native FormData
    const audioBlob = new Blob([audioBuffer], { type: 'audio/webm' });
    
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'json');
    
    if (language) {
      formData.append('language', language);
    }

    console.log('[STT] Transcribing audio, size:', audioBuffer.length, 'bytes');

    const response = await fetch(`${OPENAI_API_BASE}/audio/transcriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[STT] OpenAI API error:', errorText);
      return res.status(response.status).json({
        success: false,
        error: 'Transcription failed',
        details: errorText,
      });
    }

    const result = await response.json() as any;

    console.log('[STT] Transcription result:', result.text?.substring(0, 50) + '...');

    return res.json({
      success: true,
      text: result.text,
      language: result.language || language || 'detected',
    });
  } catch (error) {
    console.error('[STT] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// ============================================================================
// VOICE CONVERSATION - Combined TTS + AI Response
// ============================================================================

/**
 * POST /api/voice/conversation
 * Handle a voice conversation turn
 */
router.post('/conversation', async (req: Request, res: Response) => {
  try {
    const { audio, context, language = 'en' } = req.body;

    if (!audio) {
      return res.status(400).json({
        success: false,
        error: 'Audio is required',
      });
    }

    // Step 1: Transcribe user audio
    const audioBuffer = Buffer.from(audio, 'base64');
    // Create a Blob from the audio buffer for native FormData
    const audioBlob = new Blob([audioBuffer], { type: 'audio/webm' });
    
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', language);

    const sttResponse = await fetch(`${OPENAI_API_BASE}/audio/transcriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!sttResponse.ok) {
      throw new Error('STT failed');
    }

    const sttResult = await sttResponse.json() as any;
    const userText = sttResult.text;

    console.log('[Conversation] User said:', userText);

    // Step 2: Generate AI response using GPT
    const systemPrompt = language === 'fr' 
      ? `Tu es Prof. Steven Barholere, un coach expert en préparation aux examens linguistiques ELS du gouvernement canadien. Tu aides les fonctionnaires à améliorer leur français. Réponds de manière encourageante, professionnelle et concise. Limite tes réponses à 2-3 phrases maximum pour une conversation naturelle.`
      : `You are Prof. Steven Barholere, an expert coach for Canadian government SLE language exams. You help public servants improve their French and English skills. Respond in an encouraging, professional, and concise manner. Keep responses to 2-3 sentences maximum for natural conversation.`;

    const gptResponse = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...(context || []),
          { role: 'user', content: userText },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!gptResponse.ok) {
      throw new Error('GPT response failed');
    }

    const gptResult = await gptResponse.json() as any;
    const aiText = gptResult.choices[0].message.content;

    console.log('[Conversation] AI response:', aiText);

    // Step 3: Convert AI response to speech using MiniMax
    const ttsPayload = {
      model: 'speech-01-turbo',
      text: aiText,
      stream: false,
      voice_setting: {
        voice_id: STEVEN_VOICE_ID,
        speed: 1.0,
        vol: 1.0,
        pitch: 1,
      },
      audio_setting: {
        sample_rate: 32000,
        bitrate: 128000,
        format: 'mp3',
        channel: 1,
      },
      language_boost: language === 'fr' ? 'French' : 'English',
    };

    const ttsResponse = await fetch(MINIMAX_TTS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MINIMAX_API_KEY}`,
      },
      body: JSON.stringify(ttsPayload),
    });

    if (!ttsResponse.ok) {
      throw new Error('TTS failed');
    }

    const ttsResult = await ttsResponse.json() as any;

    return res.json({
      success: true,
      userText,
      aiText,
      audio: ttsResult.data?.audio || null,
      audioUrl: ttsResult.audio_file || null,
    });
  } catch (error) {
    console.error('[Conversation] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Conversation processing failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    service: 'voice',
    status: 'healthy',
    features: {
      tts: !!MINIMAX_API_KEY,
      stt: !!OPENAI_API_KEY,
      conversation: !!(MINIMAX_API_KEY && OPENAI_API_KEY),
    },
    voiceId: STEVEN_VOICE_ID,
  });
});

export default router;
