/**
 * Voice API Routes for RusingAcademy SLE AI Companion
 * Multi-Coach Voice System with MiniMax TTS and OpenAI Whisper STT
 */

import { Router, Request, Response } from "express";
import OpenAI from "openai";
import multer from "multer";
import fs from "fs";

const router = Router();

// Initialize OpenAI client for Whisper STT
const openai = new OpenAI();

// Multer configuration for audio file uploads
const upload = multer({
  dest: "/tmp/voice-uploads/",
  limits: { fileSize: 25 * 1024 * 1024 },
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
    systemPrompt: `You are Prof. Steven, a bilingual language coach specializing in Canadian Public Service language training. You help learners prepare for SLE exams with patience and expertise. Respond naturally in the language the user speaks to you. Keep responses concise for voice conversation. Be encouraging, professional, and supportive.`,
  },
};

router.get("/coaches", (_req: Request, res: Response) => {
  const coaches = Object.values(VOICE_COACHES).map((coach) => ({
    id: coach.id,
    name: coach.name,
    languages: coach.languages,
    specialty: coach.specialty,
  }));
  res.json({ coaches });
});

router.post("/tts", async (req: Request, res: Response) => {
  try {
    const { text, coachId = "prof-steven" } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    const coach = VOICE_COACHES[coachId];
    if (!coach) return res.status(400).json({ error: "Invalid coach ID" });

    const groupId = process.env.MINIMAX_GROUP_ID;
    const apiKey = process.env.MINIMAX_API_KEY;
    if (!groupId || !apiKey) return res.status(500).json({ error: "MiniMax API not configured" });

    const response = await fetch(`https://api.minimax.chat/v1/t2a_v2?GroupId=${groupId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "speech-01-turbo",
        text: text,
        stream: false,
        voice_setting: { voice_id: coach.voiceId, speed: 1.0, vol: 1.0, pitch: 0 },
        audio_setting: { sample_rate: 32000, bitrate: 128000, format: "mp3" },
      }),
    });

    if (!response.ok) return res.status(500).json({ error: "TTS generation failed" });
    const data = await response.json();
    if (data.audio_file) {
      res.json({ success: true, audioUrl: data.audio_file, coachId: coach.id, coachName: coach.name });
    } else {
      res.status(500).json({ error: "No audio generated" });
    }
  } catch (error) {
    console.error("TTS error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/stt", upload.single("audio"), async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Audio file is required" });
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(req.file.path),
      model: "whisper-1",
      language: req.body.language || undefined,
    });
    fs.unlinkSync(req.file.path);
    res.json({ success: true, text: transcription.text });
  } catch (error) {
    console.error("STT error:", error);
    res.status(500).json({ error: "Transcription failed" });
  }
});

router.post("/conversation", upload.single("audio"), async (req: Request, res: Response) => {
  try {
    const { coachId = "prof-steven", context = "" } = req.body;
    const coach = VOICE_COACHES[coachId];
    if (!coach) return res.status(400).json({ error: "Invalid coach ID" });

    let userText = req.body.text;
    if (req.file) {
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(req.file.path),
        model: "whisper-1",
      });
      userText = transcription.text;
      fs.unlinkSync(req.file.path);
    }
    if (!userText) return res.status(400).json({ error: "No input provided" });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: coach.systemPrompt },
        ...(context ? [{ role: "user" as const, content: `Context: ${context}` }] : []),
        { role: "user", content: userText },
      ],
      max_tokens: 300,
    });

    const aiResponse = completion.choices[0]?.message?.content || "I apologize, I couldn't generate a response.";
    const groupId = process.env.MINIMAX_GROUP_ID;
    const apiKey = process.env.MINIMAX_API_KEY;
    let audioUrl = null;

    if (groupId && apiKey) {
      const ttsResponse = await fetch(`https://api.minimax.chat/v1/t2a_v2?GroupId=${groupId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "speech-01-turbo",
          text: aiResponse,
          stream: false,
          voice_setting: { voice_id: coach.voiceId, speed: 1.0, vol: 1.0, pitch: 0 },
          audio_setting: { sample_rate: 32000, bitrate: 128000, format: "mp3" },
        }),
      });
      if (ttsResponse.ok) {
        const ttsData = await ttsResponse.json();
        audioUrl = ttsData.audio_file;
      }
    }

    res.json({ success: true, userText, aiResponse, audioUrl, coachId: coach.id, coachName: coach.name });
  } catch (error) {
    console.error("Conversation error:", error);
    res.status(500).json({ error: "Conversation failed" });
  }
});

export default router;
