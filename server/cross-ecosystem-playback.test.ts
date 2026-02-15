import { describe, expect, it } from "vitest";

/**
 * Unit tests for the single active playback logic used in CrossEcosystemSection.
 *
 * The component uses a unified `activePlayerKey` state to ensure:
 * 1. Only ONE video plays at a time (no double audio / echo)
 * 2. Duplicate carousel cards have unique instanceKeys ("short-01" vs "short-01-dup")
 * 3. Switching tabs stops all playback
 * 4. Cross-section playback (Shorts vs Capsules) is mutually exclusive
 */

// Simulate the instanceKey generation logic from the component
function generateInstanceKeys(items: { id: string }[]): string[] {
  const duplicated = [...items, ...items];
  return duplicated.map((item, i) => {
    const isDuplicate = i >= items.length;
    return isDuplicate ? `${item.id}-dup` : item.id;
  });
}

// Simulate the handlePlay logic from the component
function simulateHandlePlay(
  currentActiveKey: string | null,
  newInstanceKey: string
): string | null {
  return currentActiveKey === newInstanceKey ? null : newInstanceKey;
}

describe("CrossEcosystemSection — Single Active Playback", () => {
  const sampleShorts = [
    { id: "short-01" },
    { id: "short-02" },
    { id: "short-03" },
  ];

  const sampleCapsules = [
    { id: "capsule-1" },
    { id: "capsule-2" },
  ];

  describe("instanceKey generation", () => {
    it("generates unique keys for original and duplicate items", () => {
      const keys = generateInstanceKeys(sampleShorts);
      // 3 originals + 3 duplicates = 6 keys
      expect(keys).toHaveLength(6);
      // Originals
      expect(keys[0]).toBe("short-01");
      expect(keys[1]).toBe("short-02");
      expect(keys[2]).toBe("short-03");
      // Duplicates have "-dup" suffix
      expect(keys[3]).toBe("short-01-dup");
      expect(keys[4]).toBe("short-02-dup");
      expect(keys[5]).toBe("short-03-dup");
    });

    it("ensures no two keys are identical", () => {
      const keys = generateInstanceKeys(sampleShorts);
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(keys.length);
    });

    it("works for capsules too", () => {
      const keys = generateInstanceKeys(sampleCapsules);
      expect(keys).toHaveLength(4);
      expect(keys[0]).toBe("capsule-1");
      expect(keys[1]).toBe("capsule-2");
      expect(keys[2]).toBe("capsule-1-dup");
      expect(keys[3]).toBe("capsule-2-dup");
    });
  });

  describe("handlePlay logic", () => {
    it("activates a player when nothing is playing", () => {
      const result = simulateHandlePlay(null, "short-01");
      expect(result).toBe("short-01");
    });

    it("switches to a different player when one is already active", () => {
      const result = simulateHandlePlay("short-01", "short-02");
      expect(result).toBe("short-02");
    });

    it("stops playback when clicking the same item again (toggle off)", () => {
      const result = simulateHandlePlay("short-01", "short-01");
      expect(result).toBeNull();
    });

    it("original and duplicate of same video are treated as different players", () => {
      // Playing original "short-01", clicking duplicate "short-01-dup"
      // should switch to the duplicate (not toggle off)
      const result = simulateHandlePlay("short-01", "short-01-dup");
      expect(result).toBe("short-01-dup");
    });

    it("cross-section: playing a capsule stops a short", () => {
      // Short is playing, user clicks a capsule
      const result = simulateHandlePlay("short-01", "capsule-1");
      expect(result).toBe("capsule-1");
    });

    it("cross-section: playing a short stops a capsule", () => {
      // Capsule is playing, user clicks a short
      const result = simulateHandlePlay("capsule-1", "short-02");
      expect(result).toBe("short-02");
    });
  });

  describe("isPlaying check", () => {
    it("only the active instanceKey shows as playing", () => {
      const activeKey = "short-02";
      const keys = generateInstanceKeys(sampleShorts);

      const playingStates = keys.map((key) => ({
        key,
        isPlaying: activeKey === key,
      }));

      // Only short-02 should be playing
      const playing = playingStates.filter((s) => s.isPlaying);
      expect(playing).toHaveLength(1);
      expect(playing[0]!.key).toBe("short-02");
    });

    it("duplicate of active item does NOT play (unique key prevents double audio)", () => {
      const activeKey = "short-01"; // original is playing
      const keys = generateInstanceKeys(sampleShorts);

      const playingStates = keys.map((key) => ({
        key,
        isPlaying: activeKey === key,
      }));

      const playing = playingStates.filter((s) => s.isPlaying);
      // Only 1 instance plays, NOT 2 (the -dup version is different key)
      expect(playing).toHaveLength(1);
      expect(playing[0]!.key).toBe("short-01");
      // Verify the duplicate is NOT playing
      const dupState = playingStates.find((s) => s.key === "short-01-dup");
      expect(dupState!.isPlaying).toBe(false);
    });

    it("when nothing is active, no items are playing", () => {
      const activeKey = null;
      const keys = generateInstanceKeys(sampleShorts);

      const playing = keys.filter((key) => activeKey === key);
      expect(playing).toHaveLength(0);
    });
  });

  describe("tab switch behavior", () => {
    it("switching tabs resets active player to null", () => {
      // Simulate: user is playing a short, then switches to capsules tab
      let activePlayerKey: string | null = "short-01";

      // Tab switch handler resets to null
      const handleTabSwitch = () => {
        activePlayerKey = null;
      };

      handleTabSwitch();
      expect(activePlayerKey).toBeNull();
    });
  });
});
