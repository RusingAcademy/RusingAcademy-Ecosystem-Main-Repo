/**
 * Voice API Routes for RusingAcademy SLE AI Companion
 * Multi-Coach Voice System with MiniMax TTS and OpenAI Whisper STT
 * 
 * Uses axios for API calls (no openai SDK dependency)
 */

import { Router, Request, Response } from "express";
import axios from "axios";
import multer from "multer";
import fs from "fs";
import path from "path";
import FormData from "form-data";

const router = Router();

// Multer configuration for audio file uploads
const upload = multer({
  dest: "/tmp/voice-uploads/",
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
});

// Voice Coach Configuration
const VOICE_COACHES: Record<string, {
  id: string;
  name: string;
  voiceId: string;
  languages: string[];
  specialty: string;
  systemPrompt: string;
}> = {
  "prof-steven": {
    id: "prof-steven",
    name: "Prof. Steven",
    voiceId: process.env.STEVEN_VOICE_ID || "moss_audio_967c63af-eb64-11f0-ae84-1a25b61af6e2",
    languages: ["en", "fr"],
    specialty: "SLE Exam Preparation",
    systemPrompt: `You are Prof. Steven, a bilingual language coach specializing in Canadian Public Service language training. 
You help learners prepare for SLE (Second Language Evaluation) exams with patience and expertise.
Respond naturally in the language the user speaks to you. Keep responses concise for voice conversation.
Be encouraging, professional, and supportive.`,
  },
  // Future coaches can be added here
};

/**
 * Helper function to transcribe audio using OpenAI Whisper API via axios
 */
async function transcribeAudio(audioPath: string, language?: string): Promise<string> {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  
  if (!openaiApiKey) {
    throw new Error("OpenAI API key not configured");
  }

  const formData = new FormData();
  formData.append("file", fs.createReadStream(audioPath));
  formData.append("model", "whisper-1");
  if (language) {
    formData.append("language", language);
  }

  const response = await axios.post(
    "https://api.openai.com/v1/audio/transcriptions",
    formData,
    {
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        ...formData.getHeaders(),
      },
    }
  );

  return response.data.text;
}

/**
 * Helper function to generate AI chat response using OpenAI API via axios
 */
async function generateChatResponse(
  systemPrompt: string,
  userMessage: string,
  context?: string
): Promise<string> {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  
  if (!openaiApiKey) {
    throw new Error("OpenAI API key not configured");
  }

  const messages: Array<{ role: string; content: string }> = [
    { role: "system", content: systemPrompt },
  ];

  if (context) {
    messages.push({ role: "user", content: `Context: ${context}` });
  }

  messages.push({ role: "user", content: userMessage });

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o",
      messages,
      max_tokens: 300,
    },
    {
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0]?.message?.content || "I apologize, I couldn't generate a response.";
}

/**
 * GET /api/voice/coaches
 * Returns list of available voice coaches
 */
router.get("/coaches", (_req: Request, res: Response) => {
  const coaches = Object.values(VOICE_COACHES).map((coach) => ({
    id: coach.id,
    name: coach.name,
    languages: coach.languages,
    specialty: coach.specialty,
  }));
  res.json({ coaches });
});

/**
 * POST /api/voice/tts
 * Text-to-Speech using MiniMax API
 */
router.post("/tts", async (req: Request, res: Response) => {
  try {
    const { text, coachId = "prof-steven" } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const coach = VOICE_COACHES[coachId];
    if (!coach) {
      return res.status(400).json({ error: "Invalid coach ID" });
    }

    const groupId = process.env.MINIMAX_GROUP_ID;
    const apiKey = process.env.MINIMAX_API_KEY;

    if (!groupId || !apiKey) {
      return res.status(500).json({ error: "MiniMax API not configured" });
    }

    // Call MiniMax TTS API
    const response = await fetch(
      `https://api.minimax.chat/v1/t2a_v2?GroupId=${groupId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "speech-01-turbo",
          text: text,
          stream: false,
          voice_setting: {
            voice_id: coach.voiceId,
            speed: 1.0,
            vol: 1.0,
            pitch: 0,
          },
          audio_setting: {
            sample_rate: 32000,
            bitrate: 128000,
            format: "mp3",
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("MiniMax TTS error:", errorText);
      return res.status(500).json({ error: "TTS generation failed" });
    }

    const data = await response.json();

    if (data.audio_file) {
      res.json({
        success: true,
        audioUrl: data.audio_file,
        coachId: coach.id,
        coachName: coach.name,
      });
    } else {
      res.status(500).json({ error: "No audio generated" });
    }
  } catch (error) {
    console.error("TTS error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/voice/stt
 * Speech-to-Text using OpenAI Whisper via axios
 */
router.post("/stt", upload.single("audio"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Audio file is required" });
    }

    const audioPath = req.file.path;

    // Transcribe using OpenAI Whisper via axios
    const text = await transcribeAudio(audioPath, req.body.language);

    // Clean up uploaded file
    fs.unlinkSync(audioPath);

    res.json({
      success: true,
      text,
    });
  } catch (error) {
    console.error("STT error:", error);
    res.status(500).json({ error: "Transcription failed" });
  }
});

/**
 * POST /api/voice/conversation
 * Full conversation endpoint: STT -> AI Response -> TTS
 */
router.post("/conversation", upload.single("audio"), async (req: Request, res: Response) => {
  try {
    const { coachId = "prof-steven", context = "" } = req.body;

    const coach = VOICE_COACHES[coachId];
    if (!coach) {
      return res.status(400).json({ error: "Invalid coach ID" });
    }

    let userText = req.body.text;

    // If audio file provided, transcribe it first
    if (req.file) {
      userText = await transcribeAudio(req.file.path);
      fs.unlinkSync(req.file.path);
    }

    if (!userText) {
      return res.status(400).json({ error: "No input provided" });
    }

    // Generate AI response using OpenAI via axios
    const aiResponse = await generateChatResponse(coach.systemPrompt, userText, context);

    // Generate TTS for the response
    const groupId = process.env.MINIMAX_GROUP_ID;
    const apiKey = process.env.MINIMAX_API_KEY;

    let audioUrl = null;

    if (groupId && apiKey) {
      const ttsResponse = await fetch(
        `https://api.minimax.chat/v1/t2a_v2?GroupId=${groupId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "speech-01-turbo",
            text: aiResponse,
            stream: false,
            voice_setting: {
              voice_id: coach.voiceId,
              speed: 1.0,
              vol: 1.0,
              pitch: 0,
            },
            audio_setting: {
              sample_rate: 32000,
              bitrate: 128000,
              format: "mp3",
            },
          }),
        }
      );

      if (ttsResponse.ok) {
        const ttsData = await ttsResponse.json();
        audioUrl = ttsData.audio_file;
      }
    }

    res.json({
      success: true,
      userText,
      aiResponse,
      audioUrl,
      coachId: coach.id,
      coachName: coach.name,
    });
  } catch (error) {
    console.error("Conversation error:", error);
    res.status(500).json({ error: "Conversation failed" });
  }
});

export default router;
