/**
 * Voice Routes Registration
 * 
 * This file provides a simple function to register voice routes
 * in the main Express application.
 * 
 * Usage in server/_core/index.ts:
 * 1. Add import: import { registerVoiceRoutes } from "../routes/registerVoiceRoutes";
 * 2. Call after other routes: registerVoiceRoutes(app);
 */

import { Express } from "express";
import voiceRouter from "./voice";

/**
 * Register voice API routes on the Express application
 * @param app - Express application instance
 */
export function registerVoiceRoutes(app: Express): void {
  // Voice API (MiniMax TTS, OpenAI Whisper STT)
  app.use("/api/voice", voiceRouter);
  
  console.log("[Voice] Voice routes registered at /api/voice");
}

export default registerVoiceRoutes;
