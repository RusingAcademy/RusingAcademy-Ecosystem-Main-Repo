/**
 * Voice Routes Registration
 * Registers voice API routes with the Express application
 */

import { Express } from "express";
import voiceRouter from "./voice";
import { createLogger } from "../logger";
const log = createLogger("routes-registerVoiceRoutes");

/**
 * Register voice routes with the Express application
 * @param app - Express application instance
 */
export function registerVoiceRoutes(app: Express): void {
  // Register voice API routes at /api/voice
  app.use("/api/voice", voiceRouter);
  
  log.info("[Voice] Voice routes registered at /api/voice");
  log.info("[Voice] Available endpoints:");
  log.info("[Voice]   GET  /api/voice/coaches - List available coaches");
  log.info("[Voice]   POST /api/voice/tts - Text-to-Speech");
  log.info("[Voice]   POST /api/voice/stt - Speech-to-Text");
  log.info("[Voice]   POST /api/voice/conversation - Full conversation");
}
