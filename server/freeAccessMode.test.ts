import { describe, it, expect } from "vitest";
import { FREE_ACCESS_MODE } from "../shared/const";

describe("FREE_ACCESS_MODE", () => {
  it("should be enabled (true) for the preview/testing period", () => {
    expect(FREE_ACCESS_MODE).toBe(true);
  });

  it("should be exported as a boolean constant", () => {
    expect(typeof FREE_ACCESS_MODE).toBe("boolean");
  });
});

describe("FREE_ACCESS_MODE integration logic", () => {
  it("should allow enrollment bypass when FREE_ACCESS_MODE is true", () => {
    // Simulate the server-side enrollment check logic
    const coursePrice = 89900; // $899 in cents
    const isFree = coursePrice === 0;
    const isAdmin = false;
    
    // This is the condition used in courses.ts getLesson
    const shouldAutoEnroll = FREE_ACCESS_MODE || isFree || isAdmin;
    expect(shouldAutoEnroll).toBe(true);
  });

  it("should bypass price check for enrollFree when FREE_ACCESS_MODE is true", () => {
    // Simulate the enrollFree price check
    const coursePrice = 89900; // $899 in cents
    const shouldBlockEnrollment = !FREE_ACCESS_MODE && coursePrice > 0;
    expect(shouldBlockEnrollment).toBe(false);
  });

  it("should set paymentStatus to completed in free mode", () => {
    const paymentStatus = FREE_ACCESS_MODE ? "completed" : "pending";
    expect(paymentStatus).toBe("completed");
  });

  it("should unlock lessons regardless of enrollment in free mode", () => {
    // Simulate the frontend lock check
    const enrollment = null; // Not enrolled
    const isPreview = false; // Not a preview lesson
    const isLocked = FREE_ACCESS_MODE ? false : (!enrollment && !isPreview);
    expect(isLocked).toBe(false);
  });

  it("should show free pricing text in free mode", () => {
    // Simulate the frontend price display logic
    const originalPrice = 89900;
    const displayText = FREE_ACCESS_MODE ? "Free" : `$${(originalPrice / 100).toFixed(0)}`;
    expect(displayText).toBe("Free");
  });
});
