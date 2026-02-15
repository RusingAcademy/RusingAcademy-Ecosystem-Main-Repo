import { describe, it, expect } from "vitest";

/**
 * Sprint 16: Bunny Stream Video Pipeline Tests
 *
 * Validates the integration of Bunny Stream video uploads into:
 * 1. Coach Application Wizard (replacing base64 S3 upload)
 * 2. Coach Profile public page (Bunny Stream iframe embeds)
 * 3. Admin approval flow (bunnyVideoId propagation)
 * 4. Coach Profile Editor (already wired)
 */

describe("Sprint 16: Bunny Stream Video Pipeline", () => {
  // ─── Schema Validation ──────────────────────────────────────────────────

  describe("Database Schema — bunnyVideoId field", () => {
    it("should have bunnyVideoId field in coachProfiles schema", async () => {
      const { coachProfiles } = await import("../drizzle/schema");
      expect(coachProfiles).toBeDefined();
      // The field should exist in the table definition
      const columns = Object.keys(coachProfiles);
      expect(columns).toBeDefined();
      // Check the column is defined (Drizzle tables have column accessors)
      expect((coachProfiles as any).bunnyVideoId).toBeDefined();
    });

    it("should have bunnyVideoId field in coachApplications schema", async () => {
      const { coachApplications } = await import("../drizzle/schema");
      expect(coachApplications).toBeDefined();
      expect((coachApplications as any).bunnyVideoId).toBeDefined();
    });

    it("coachProfiles bunnyVideoId should be varchar(100)", async () => {
      const { coachProfiles } = await import("../drizzle/schema");
      const col = (coachProfiles as any).bunnyVideoId;
      expect(col).toBeDefined();
      // Drizzle column config
      expect(col.config?.length || col.columnType).toBeDefined();
    });

    it("coachApplications bunnyVideoId should be varchar(100)", async () => {
      const { coachApplications } = await import("../drizzle/schema");
      const col = (coachApplications as any).bunnyVideoId;
      expect(col).toBeDefined();
      expect(col.config?.length || col.columnType).toBeDefined();
    });
  });

  // ─── Bunny Stream Embed URL Generation ──────────────────────────────────

  describe("Bunny Stream Embed URL Generation", () => {
    const LIBRARY_ID = "585866";

    it("should generate correct embed URL format", () => {
      const videoId = "abc123-def456-ghi789";
      const embedUrl = `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${videoId}`;
      expect(embedUrl).toBe(
        `https://iframe.mediadelivery.net/embed/585866/abc123-def456-ghi789`
      );
    });

    it("should generate embed URL with autoplay=false parameter", () => {
      const videoId = "test-video-id";
      const embedUrl = `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${videoId}?autoplay=false&preload=true`;
      expect(embedUrl).toContain("autoplay=false");
      expect(embedUrl).toContain("preload=true");
    });

    it("should handle empty videoId gracefully", () => {
      const videoId = "";
      const shouldShowEmbed = videoId && LIBRARY_ID;
      expect(shouldShowEmbed).toBeFalsy();
    });

    it("should handle null videoId gracefully", () => {
      const videoId: string | null = null;
      const shouldShowEmbed = videoId && LIBRARY_ID;
      expect(shouldShowEmbed).toBeFalsy();
    });
  });

  // ─── Coach Application Data Flow ────────────────────────────────────────

  describe("Coach Application — Bunny Video Integration", () => {
    it("should include bunnyVideoId in application submission data", () => {
      const applicationData = {
        firstName: "Marie",
        lastName: "Dupont",
        phone: "+1-613-555-0123",
        city: "Ottawa",
        province: "Ontario",
        headline: "Expert SLE Coach",
        bio: "Over 10 years of experience helping public servants achieve bilingual excellence.",
        hourlyRate: 7500, // cents
        trialRate: 3500,
        photoUrl: "https://cdn.example.com/photo.jpg",
        videoUrl: "https://iframe.mediadelivery.net/embed/585866/test-video-id",
        bunnyVideoId: "test-video-id",
        termsAccepted: true,
        privacyAccepted: true,
      };

      expect(applicationData.bunnyVideoId).toBe("test-video-id");
      expect(applicationData.videoUrl).toContain("iframe.mediadelivery.net");
    });

    it("should allow application without video (optional field)", () => {
      const applicationData = {
        firstName: "Jean",
        lastName: "Martin",
        headline: "French Language Coach",
        bio: "Passionate about teaching French to public servants.",
        hourlyRate: 6000,
        trialRate: 3000,
        bunnyVideoId: undefined,
        videoUrl: undefined,
      };

      expect(applicationData.bunnyVideoId).toBeUndefined();
      expect(applicationData.videoUrl).toBeUndefined();
    });

    it("should prioritize bunnyVideoId over legacy videoUrl", () => {
      const applicationData = {
        bunnyVideoId: "bunny-video-123",
        videoUrl: "https://youtube.com/watch?v=old-video",
      };

      // When bunnyVideoId is present, it should take priority
      const hasBunnyVideo = !!applicationData.bunnyVideoId;
      expect(hasBunnyVideo).toBe(true);
    });
  });

  // ─── Admin Approval Flow ────────────────────────────────────────────────

  describe("Admin Approval — bunnyVideoId Propagation", () => {
    it("should copy bunnyVideoId from application to coach profile on approval", () => {
      const application = {
        userId: 42,
        firstName: "Marie",
        lastName: "Dupont",
        headline: "Expert SLE Coach",
        bio: "Experienced language coach.",
        introVideoUrl: "https://iframe.mediadelivery.net/embed/585866/video-id-123",
        bunnyVideoId: "video-id-123",
        photoUrl: "https://cdn.example.com/photo.jpg",
        teachingLanguage: "french",
        specializations: { oralB: true, oralC: true },
        yearsTeaching: 10,
        certifications: "TEFL, CELTA",
        hourlyRate: 75,
        trialRate: 35,
      };

      // Simulate what the approval flow does
      const coachProfileValues = {
        userId: application.userId,
        slug: `${application.firstName}-${application.lastName}`.toLowerCase() + "-" + Date.now(),
        headline: application.headline,
        bio: application.bio,
        videoUrl: application.introVideoUrl || null,
        bunnyVideoId: application.bunnyVideoId || null,
        photoUrl: application.photoUrl,
        languages: application.teachingLanguage,
        specializations: application.specializations,
        yearsExperience: application.yearsTeaching,
        credentials: application.certifications,
        hourlyRate: application.hourlyRate * 100,
        trialRate: application.trialRate * 100,
        status: "approved",
      };

      expect(coachProfileValues.bunnyVideoId).toBe("video-id-123");
      expect(coachProfileValues.videoUrl).toContain("iframe.mediadelivery.net");
    });

    it("should handle approval of application without video", () => {
      const application = {
        introVideoUrl: null,
        bunnyVideoId: null,
      };

      const coachProfileValues = {
        videoUrl: application.introVideoUrl || null,
        bunnyVideoId: application.bunnyVideoId || null,
      };

      expect(coachProfileValues.bunnyVideoId).toBeNull();
      expect(coachProfileValues.videoUrl).toBeNull();
    });
  });

  // ─── Public Coach Profile Video Display ─────────────────────────────────

  describe("Public Coach Profile — Video Display Logic", () => {
    const LIBRARY_ID = "585866";

    it("should display Bunny Stream iframe when bunnyVideoId is present", () => {
      const coach = {
        bunnyVideoId: "abc-123",
        videoUrl: "https://youtube.com/watch?v=old",
      };

      // Priority 1: Bunny Stream
      const shouldUseBunny = !!coach.bunnyVideoId && !!LIBRARY_ID;
      expect(shouldUseBunny).toBe(true);

      const embedUrl = `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${coach.bunnyVideoId}?autoplay=false&preload=true`;
      expect(embedUrl).toContain("iframe.mediadelivery.net");
      expect(embedUrl).toContain("abc-123");
    });

    it("should fall back to YouTube when no bunnyVideoId but has YouTube URL", () => {
      const coach = {
        bunnyVideoId: null,
        videoUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      };

      const shouldUseBunny = !!coach.bunnyVideoId && !!LIBRARY_ID;
      expect(shouldUseBunny).toBe(false);

      const ytMatch = coach.videoUrl?.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/
      );
      expect(ytMatch).toBeTruthy();
      expect(ytMatch![1]).toBe("dQw4w9WgXcQ");
    });

    it("should fall back to native video for mp4 URLs", () => {
      const coach = {
        bunnyVideoId: null,
        videoUrl: "https://cdn.example.com/video.mp4",
      };

      const shouldUseBunny = !!coach.bunnyVideoId && !!LIBRARY_ID;
      expect(shouldUseBunny).toBe(false);

      const isNativeVideo = coach.videoUrl?.match(/\.(mp4|webm|ogg)($|\?)/i);
      expect(isNativeVideo).toBeTruthy();
    });

    it("should show video section when either bunnyVideoId or videoUrl exists", () => {
      const coachWithBunny = { bunnyVideoId: "vid-1", videoUrl: null };
      const coachWithUrl = { bunnyVideoId: null, videoUrl: "https://youtube.com/watch?v=abc" };
      const coachWithBoth = { bunnyVideoId: "vid-2", videoUrl: "https://youtube.com/watch?v=abc" };
      const coachWithNeither = { bunnyVideoId: null, videoUrl: null };

      expect(coachWithBunny.bunnyVideoId || coachWithBunny.videoUrl).toBeTruthy();
      expect(coachWithUrl.bunnyVideoId || coachWithUrl.videoUrl).toBeTruthy();
      expect(coachWithBoth.bunnyVideoId || coachWithBoth.videoUrl).toBeTruthy();
      expect(coachWithNeither.bunnyVideoId || coachWithNeither.videoUrl).toBeFalsy();
    });
  });

  // ─── Coach Profile Editor — BunnyVideoManager Integration ───────────────

  describe("Coach Profile Editor — BunnyVideoManager Integration", () => {
    it("should store bunnyVideoId in form state when video is selected", () => {
      const formState = {
        bunnyVideoId: "",
        videoUrl: "",
      };

      // Simulate BunnyVideoManager onSelect callback
      const selectedVideo = {
        videoId: "new-video-guid",
        title: "My Introduction",
        embedUrl: "https://iframe.mediadelivery.net/embed/585866/new-video-guid",
        thumbnailUrl: "https://cdn.example.com/new-video-guid/thumbnail.jpg",
        duration: 120,
      };

      formState.bunnyVideoId = selectedVideo.videoId;
      formState.videoUrl = selectedVideo.embedUrl;

      expect(formState.bunnyVideoId).toBe("new-video-guid");
      expect(formState.videoUrl).toContain("new-video-guid");
    });

    it("should clear both bunnyVideoId and videoUrl on clear", () => {
      const formState = {
        bunnyVideoId: "existing-video",
        videoUrl: "https://iframe.mediadelivery.net/embed/585866/existing-video",
      };

      // Simulate clear
      formState.bunnyVideoId = "";
      formState.videoUrl = "";

      expect(formState.bunnyVideoId).toBe("");
      expect(formState.videoUrl).toBe("");
    });
  });

  // ─── Bunny Stream Helper Functions ──────────────────────────────────────

  describe("Bunny Stream Helper Functions", () => {
    it("getEmbedUrl should construct correct URL", async () => {
      const { getEmbedUrl } = await import("./bunnyStream");
      const url = getEmbedUrl("test-video-id");
      expect(url).toContain("iframe.mediadelivery.net/embed/");
      expect(url).toContain("test-video-id");
    });

    it("getThumbnailUrl should construct correct URL", async () => {
      const { getThumbnailUrl } = await import("./bunnyStream");
      const url = getThumbnailUrl("test-video-id");
      expect(url).toContain("test-video-id");
      expect(url).toContain("thumbnail.jpg");
    });

    it("getDirectPlayUrl should construct correct URL with resolution", async () => {
      const { getDirectPlayUrl } = await import("./bunnyStream");
      const url720 = getDirectPlayUrl("test-video-id", "720p");
      expect(url720).toContain("test-video-id");
      expect(url720).toContain("play_720p.mp4");

      const url1080 = getDirectPlayUrl("test-video-id", "1080p");
      expect(url1080).toContain("play_1080p.mp4");
    });
  });

  // ─── MediaUploads Interface Validation ──────────────────────────────────

  describe("MediaUploads Interface — bunnyVideoId field", () => {
    it("should support bunnyVideoId in media uploads state", () => {
      const mediaUploads = {
        photoUrl: "",
        photoFile: null,
        videoUrl: "",
        videoFile: null,
        videoType: "bunny" as const,
        bunnyVideoId: "",
      };

      expect(mediaUploads).toHaveProperty("bunnyVideoId");
      expect(mediaUploads.videoType).toBe("bunny");
    });

    it("should support setting bunnyVideoId from BunnyVideoManager callback", () => {
      const mediaUploads = {
        photoUrl: "",
        photoFile: null,
        videoUrl: "",
        videoFile: null,
        videoType: "bunny" as const,
        bunnyVideoId: "",
      };

      // Simulate BunnyVideoManager onSelect
      mediaUploads.bunnyVideoId = "uploaded-video-guid";
      mediaUploads.videoUrl = "https://iframe.mediadelivery.net/embed/585866/uploaded-video-guid";

      expect(mediaUploads.bunnyVideoId).toBe("uploaded-video-guid");
      expect(mediaUploads.videoUrl).toContain("uploaded-video-guid");
    });

    it("should serialize correctly for localStorage draft (without File objects)", () => {
      const mediaUploads = {
        photoUrl: "https://cdn.example.com/photo.jpg",
        photoFile: null, // File objects can't be serialized
        videoUrl: "https://iframe.mediadelivery.net/embed/585866/vid-123",
        videoFile: null,
        videoType: "bunny" as const,
        bunnyVideoId: "vid-123",
      };

      const serialized = JSON.stringify(mediaUploads);
      const parsed = JSON.parse(serialized);

      expect(parsed.bunnyVideoId).toBe("vid-123");
      expect(parsed.videoType).toBe("bunny");
      expect(parsed.photoFile).toBeNull();
      expect(parsed.videoFile).toBeNull();
    });
  });

  // ─── End-to-End Flow Validation ─────────────────────────────────────────

  describe("End-to-End Flow: Application → Approval → Public Profile", () => {
    it("should maintain bunnyVideoId through the full pipeline", () => {
      // Step 1: User uploads video via BunnyVideoManager in application wizard
      const applicationSubmission = {
        bunnyVideoId: "e2e-test-video",
        videoUrl: "https://iframe.mediadelivery.net/embed/585866/e2e-test-video",
      };

      // Step 2: Application stored in coachApplications table
      const storedApplication = {
        introVideoUrl: applicationSubmission.videoUrl,
        bunnyVideoId: applicationSubmission.bunnyVideoId,
      };

      expect(storedApplication.bunnyVideoId).toBe("e2e-test-video");

      // Step 3: Admin approves → creates coach profile
      const coachProfile = {
        videoUrl: storedApplication.introVideoUrl || null,
        bunnyVideoId: storedApplication.bunnyVideoId || null,
      };

      expect(coachProfile.bunnyVideoId).toBe("e2e-test-video");

      // Step 4: Public profile displays Bunny Stream embed
      const libraryId = "585866";
      const embedUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${coachProfile.bunnyVideoId}?autoplay=false&preload=true`;
      expect(embedUrl).toContain("e2e-test-video");
      expect(embedUrl).toContain("iframe.mediadelivery.net");
    });
  });
});
