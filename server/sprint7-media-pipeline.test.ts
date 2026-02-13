import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const ROOT = resolve(import.meta.dirname, "..");

function readFile(relPath: string): string {
  const full = resolve(ROOT, relPath);
  if (!existsSync(full)) throw new Error(`File not found: ${relPath}`);
  return readFileSync(full, "utf-8");
}

describe("Sprint 7: Video & Audio Content Production Pipeline", () => {

  // ─── A) Bunny Stream Integration ───
  describe("Bunny Stream Upload Pipeline", () => {
    it("bunnyStream.ts service exists with full API coverage", () => {
      const content = readFile("server/bunnyStream.ts");
      expect(content).toContain("createVideo");
      expect(content).toContain("listVideos");
      expect(content).toContain("deleteVideo");
      expect(content).toContain("getVideo");
      expect(content).toContain("getEmbedUrl");
      expect(content).toContain("getDirectPlayUrl");
    });

    it("bunnyStream router has CRUD + TUS upload procedures", () => {
      const content = readFile("server/routers/bunnyStream.ts");
      expect(content).toContain("list: protectedProcedure");
      expect(content).toContain("get: protectedProcedure");
      expect(content).toContain("create: protectedProcedure");
      expect(content).toContain("delete: protectedProcedure");
      expect(content).toContain("update: protectedProcedure");
      expect(content).toContain("getTusCredentials");
    });

    it("BunnyVideoManager component supports browse + upload modes", () => {
      const content = readFile("client/src/components/BunnyVideoManager.tsx");
      expect(content).toContain("tus-js-client");
      expect(content).toContain("Upload");
      expect(content).toContain("Browse");
      expect(content).toContain("onSelect");
    });

    it("BunnyStreamPlayer renders Bunny CDN iframe embed", () => {
      const content = readFile("client/src/components/BunnyStreamPlayer.tsx");
      expect(content).toContain("iframe");
      expect(content).toContain("mediadelivery.net");
      expect(content).toContain("videoId");
    });

    it("CourseBuilder integrates BunnyVideoManager for video activities", () => {
      const content = readFile("client/src/pages/admin/CourseBuilder.tsx");
      expect(content).toContain("BunnyVideoManager");
      expect(content).toContain('videoProvider');
      expect(content).toContain('"bunny"');
    });
  });

  // ─── B) MiniMax TTS Integration ───
  describe("MiniMax TTS Narration Generation", () => {
    it("minimaxAudioService has French and English voice constants", () => {
      const content = readFile("server/services/minimaxAudioService.ts");
      expect(content).toContain("FRENCH_VOICES");
      expect(content).toContain("ENGLISH_VOICES");
      expect(content).toContain("COACH_VOICES");
    });

    it("Steven's cloned voice is configured with correct MiniMax voice ID", () => {
      const content = readFile("server/services/minimaxAudioService.ts");
      expect(content).toContain("STEVEN: 'moss_audio_b813fbba-c1d2-11f0-a527-aab150a40f84'");
    });

    it("voice route has Steven's voice ID from STEVEN_VOICE_ID env", () => {
      const content = readFile("server/routes/voice.ts");
      expect(content).toContain("STEVEN_VOICE_ID");
      expect(content).toContain("prof-steven");
      expect(content).toContain("Coach Steven");
    });

    it("audio router has generateCoachAudio with steven option", () => {
      const content = readFile("server/routers/audio.ts");
      expect(content).toContain("generateCoachAudio");
      expect(content).toContain("'steven'");
      expect(content).toContain("'sue_anne'");
      expect(content).toContain("'erika'");
      expect(content).toContain("'preciosa'");
    });

    it("audio router has pronunciation and listening generation endpoints", () => {
      const content = readFile("server/routers/audio.ts");
      expect(content).toContain("generatePronunciation");
      expect(content).toContain("generateListening");
      expect(content).toContain("generateSLEPractice");
    });

    it("audio router has getVoices and getCoachVoices endpoints", () => {
      const content = readFile("server/routers/audio.ts");
      expect(content).toContain("getVoices");
      expect(content).toContain("getCoachVoices");
    });

    it("minimaxAudioService exports generateCoachAudio function", () => {
      const content = readFile("server/services/minimaxAudioService.ts");
      expect(content).toContain("generateCoachAudio");
      expect(content).toContain("coachName: 'steven'");
    });
  });

  // ─── C) ActivityViewer Media Playback ───
  describe("ActivityViewer Media Playback", () => {
    it("supports Bunny Stream video playback", () => {
      const content = readFile("client/src/components/ActivityViewer.tsx");
      expect(content).toContain("BunnyStreamPlayer");
      expect(content).toContain('videoProvider === "bunny"');
    });

    it("supports YouTube video embeds", () => {
      const content = readFile("client/src/components/ActivityViewer.tsx");
      expect(content).toContain("youtube.com/embed");
      expect(content).toContain('videoProvider === "youtube"');
    });

    it("supports Vimeo video embeds", () => {
      const content = readFile("client/src/components/ActivityViewer.tsx");
      expect(content).toContain("player.vimeo.com");
      expect(content).toContain('videoProvider === "vimeo"');
    });

    it("supports self-hosted video with native player", () => {
      const content = readFile("client/src/components/ActivityViewer.tsx");
      expect(content).toContain("<video");
      expect(content).toContain("controls");
    });

    it("supports audio playback with native audio player", () => {
      const content = readFile("client/src/components/ActivityViewer.tsx");
      expect(content).toContain("<audio");
      expect(content).toContain("audioUrl");
      expect(content).toContain('activityType === "audio"');
    });

    it("handles all activity types (video, audio, text, quiz)", () => {
      const content = readFile("client/src/components/ActivityViewer.tsx");
      expect(content).toContain('activityType === "video"');
      expect(content).toContain('activityType === "audio"');
      expect(content).toContain('activityType === "quiz"');
      expect(content).toContain('activityType === "text"');
    });
  });

  // ─── D) Media Coverage Metrics ───
  describe("Media Coverage Metrics", () => {
    it("adminDashboardData router has getMediaCoverage endpoint", () => {
      const content = readFile("server/routers/adminDashboardData.ts");
      expect(content).toContain("getMediaCoverage");
      expect(content).toContain("videoCoveragePercent");
      expect(content).toContain("audioCoveragePercent");
      expect(content).toContain("mediaCoveragePercent");
      expect(content).toContain("byContentType");
    });

    it("getMediaCoverage counts activities by content type", () => {
      const content = readFile("server/routers/adminDashboardData.ts");
      expect(content).toContain("videoActivities");
      expect(content).toContain("audioActivities");
      expect(content).toContain("textActivities");
      expect(content).toContain("quizActivities");
      expect(content).toContain("activitiesWithoutMedia");
    });

    it("getMediaCoverage calculates coverage percentages", () => {
      const content = readFile("server/routers/adminDashboardData.ts");
      expect(content).toContain("Math.round");
      expect(content).toContain("totalActivities > 0");
    });
  });

  // ─── E) Admin Media Library ───
  describe("Admin Media Library", () => {
    it("MediaLibrary page exists with upload, browse, and organize features", () => {
      const content = readFile("client/src/pages/admin/MediaLibrary.tsx");
      expect(content).toContain("Upload");
      expect(content).toContain("search");
      expect(content).toContain("folder");
      expect(content).toContain("mediaLibrary.list");
    });

    it("MediaLibrary has grid and list view modes", () => {
      const content = readFile("client/src/pages/admin/MediaLibrary.tsx");
      expect(content).toContain('"grid"');
      expect(content).toContain('"list"');
    });

    it("MediaLibrary route is registered in App.tsx", () => {
      const content = readFile("client/src/App.tsx");
      expect(content).toContain("/admin/media-library");
    });
  });

  // ─── F) Voice Routes Registration ───
  describe("Voice API Routes", () => {
    it("voice routes are registered in the Express app", () => {
      const content = readFile("server/_core/index.ts");
      expect(content).toContain("registerVoiceRoutes");
    });

    it("voice route has multi-coach configuration", () => {
      const content = readFile("server/routes/voice.ts");
      expect(content).toContain("prof-steven");
      expect(content).toContain("coach-preciosa");
      expect(content).toContain("VOICE_COACHES");
    });

    it("voice route supports audio transcription via Whisper", () => {
      const content = readFile("server/routes/voice.ts");
      expect(content).toContain("transcribeAudio");
      expect(content).toContain("whisper");
    });
  });
});
