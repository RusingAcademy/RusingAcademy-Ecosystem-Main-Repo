import { describe, it, expect } from "vitest";
import {
  PRONUNCIATION_AUDIO,
  getAudioByLevel,
  getAudioByCategory,
  getAudioById,
  getSLEPracticeAudio,
  getLessonAudio,
  LESSON_AUDIO_MAP,
} from "@shared/audioContent";

describe("Audio Content Library", () => {
  describe("PRONUNCIATION_AUDIO", () => {
    it("should have 16 total pronunciation phrases", () => {
      expect(PRONUNCIATION_AUDIO.length).toBe(16);
    });

    it("should have phrases for all SLE levels", () => {
      const levelA = PRONUNCIATION_AUDIO.filter((p) => p.level === "A");
      const levelB = PRONUNCIATION_AUDIO.filter((p) => p.level === "B");
      const levelC = PRONUNCIATION_AUDIO.filter((p) => p.level === "C");

      expect(levelA.length).toBeGreaterThan(0);
      expect(levelB.length).toBeGreaterThan(0);
      expect(levelC.length).toBeGreaterThan(0);
    });

    it("should have valid audio URLs for all phrases", () => {
      PRONUNCIATION_AUDIO.forEach((phrase) => {
        expect(phrase.audioUrl).toMatch(/^\/audio\/pronunciation\/.*\.mp3$/);
      });
    });

    it("should have both English and French text for all phrases", () => {
      PRONUNCIATION_AUDIO.forEach((phrase) => {
        expect(phrase.text).toBeTruthy();
        expect(phrase.textFr).toBeTruthy();
      });
    });
  });

  describe("getAudioByLevel", () => {
    it("should return only Level A phrases", () => {
      const levelA = getAudioByLevel("A");
      expect(levelA.every((p) => p.level === "A")).toBe(true);
      expect(levelA.length).toBe(3);
    });

    it("should return only Level B phrases", () => {
      const levelB = getAudioByLevel("B");
      expect(levelB.every((p) => p.level === "B")).toBe(true);
      expect(levelB.length).toBe(4);
    });

    it("should return only Level C phrases", () => {
      const levelC = getAudioByLevel("C");
      expect(levelC.every((p) => p.level === "C")).toBe(true);
      expect(levelC.length).toBe(9);
    });
  });

  describe("getAudioByCategory", () => {
    it("should return phrases by category", () => {
      const presentation = getAudioByCategory("presentation");
      expect(presentation.every((p) => p.category === "presentation")).toBe(true);
      expect(presentation.length).toBeGreaterThan(0);
    });

    it("should return negotiation phrases", () => {
      const negotiation = getAudioByCategory("negotiation");
      expect(negotiation.every((p) => p.category === "negotiation")).toBe(true);
      expect(negotiation.length).toBeGreaterThan(0);
    });
  });

  describe("getAudioById", () => {
    it("should return a phrase by ID", () => {
      const phrase = getAudioById("intro_federal_employee");
      expect(phrase).toBeDefined();
      expect(phrase?.id).toBe("intro_federal_employee");
    });

    it("should return undefined for non-existent ID", () => {
      const phrase = getAudioById("non_existent_id");
      expect(phrase).toBeUndefined();
    });
  });

  describe("getSLEPracticeAudio", () => {
    it("should return only Level A phrases for SLE Level A", () => {
      const audio = getSLEPracticeAudio("A");
      expect(audio.every((p) => p.level === "A")).toBe(true);
    });

    it("should return Level A and B phrases for SLE Level B", () => {
      const audio = getSLEPracticeAudio("B");
      const levels = new Set(audio.map((p) => p.level));
      expect(levels.has("A")).toBe(true);
      expect(levels.has("B")).toBe(true);
      expect(levels.has("C")).toBe(false);
    });

    it("should return all levels for SLE Level C", () => {
      const audio = getSLEPracticeAudio("C");
      const levels = new Set(audio.map((p) => p.level));
      expect(levels.has("A")).toBe(true);
      expect(levels.has("B")).toBe(true);
      expect(levels.has("C")).toBe(true);
    });
  });

  describe("LESSON_AUDIO_MAP", () => {
    it("should have mappings for Path I lessons", () => {
      expect(LESSON_AUDIO_MAP["path1_m1_l1"]).toBeDefined();
      expect(LESSON_AUDIO_MAP["path1_m1_l2"]).toBeDefined();
      expect(LESSON_AUDIO_MAP["path1_m2_l1"]).toBeDefined();
    });

    it("should have mappings for Path II lessons", () => {
      expect(LESSON_AUDIO_MAP["path2_m1_l1"]).toBeDefined();
      expect(LESSON_AUDIO_MAP["path2_m1_l2"]).toBeDefined();
      expect(LESSON_AUDIO_MAP["path2_m2_l1"]).toBeDefined();
    });

    it("should have mappings for SLE practice sessions", () => {
      expect(LESSON_AUDIO_MAP["sle_level_a"]).toBeDefined();
      expect(LESSON_AUDIO_MAP["sle_level_b"]).toBeDefined();
      expect(LESSON_AUDIO_MAP["sle_level_c"]).toBeDefined();
    });
  });

  describe("getLessonAudio", () => {
    it("should return audio phrases for a lesson", () => {
      const audio = getLessonAudio("path1_m1_l1");
      expect(audio.length).toBeGreaterThan(0);
      expect(audio[0].id).toBe("intro_federal_employee");
    });

    it("should return empty array for non-existent lesson", () => {
      const audio = getLessonAudio("non_existent_lesson");
      expect(audio).toEqual([]);
    });

    it("should return all SLE Level C audio phrases", () => {
      const audio = getLessonAudio("sle_level_c");
      expect(audio.length).toBe(9);
    });
  });
});
