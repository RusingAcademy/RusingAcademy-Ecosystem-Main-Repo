import { describe, it, expect, vi } from "vitest";
import { withRetry, retry } from "./resilience";

describe("Resilience Utility", () => {
  describe("withRetry", () => {
    it("should succeed on first attempt without retrying", async () => {
      const fn = vi.fn().mockResolvedValue("success");

      const result = await withRetry(fn, { label: "test.firstAttempt", maxRetries: 3 });

      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should retry on transient failure and succeed", async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error("ECONNRESET"))
        .mockResolvedValue("recovered");

      const result = await withRetry(fn, {
        label: "test.retrySuccess",
        maxRetries: 3,
        initialDelayMs: 10, // Fast for tests
      });

      expect(result).toBe("recovered");
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it("should throw after exhausting all retries", async () => {
      const fn = vi.fn().mockRejectedValue(new Error("persistent failure"));

      await expect(
        withRetry(fn, {
          label: "test.exhausted",
          maxRetries: 2,
          initialDelayMs: 10,
        })
      ).rejects.toThrow("persistent failure");

      expect(fn).toHaveBeenCalledTimes(3); // initial + 2 retries
    });

    it("should not retry non-retryable errors (401 unauthorized)", async () => {
      const error = Object.assign(new Error("Unauthorized"), { statusCode: 401 });
      const fn = vi.fn().mockRejectedValue(error);

      await expect(
        withRetry(fn, {
          label: "test.nonRetryable",
          maxRetries: 3,
          initialDelayMs: 10,
        })
      ).rejects.toThrow("Unauthorized");

      expect(fn).toHaveBeenCalledTimes(1); // No retries
    });

    it("should not retry Stripe card_error", async () => {
      const error = Object.assign(new Error("Card declined"), { type: "card_error" });
      const fn = vi.fn().mockRejectedValue(error);

      await expect(
        withRetry(fn, {
          label: "test.stripeCard",
          maxRetries: 3,
          initialDelayMs: 10,
        })
      ).rejects.toThrow("Card declined");

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should retry 429 Too Many Requests", async () => {
      const error429 = Object.assign(new Error("Rate limited"), { statusCode: 429 });
      const fn = vi
        .fn()
        .mockRejectedValueOnce(error429)
        .mockResolvedValue("ok");

      const result = await withRetry(fn, {
        label: "test.rateLimit",
        maxRetries: 3,
        initialDelayMs: 10,
      });

      expect(result).toBe("ok");
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it("should call onRetry callback on each retry", async () => {
      const onRetry = vi.fn();
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error("fail1"))
        .mockRejectedValueOnce(new Error("fail2"))
        .mockResolvedValue("ok");

      await withRetry(fn, {
        label: "test.onRetry",
        maxRetries: 3,
        initialDelayMs: 10,
        onRetry,
      });

      expect(onRetry).toHaveBeenCalledTimes(2);
      expect(onRetry.mock.calls[0][0]).toBe(1); // first retry attempt
      expect(onRetry.mock.calls[1][0]).toBe(2); // second retry attempt
    });

    it("should respect custom isRetryable function", async () => {
      const fn = vi.fn().mockRejectedValue(new Error("custom error"));
      const isRetryable = vi.fn().mockReturnValue(false);

      await expect(
        withRetry(fn, {
          label: "test.customRetryable",
          maxRetries: 3,
          initialDelayMs: 10,
          isRetryable,
        })
      ).rejects.toThrow("custom error");

      expect(fn).toHaveBeenCalledTimes(1);
      expect(isRetryable).toHaveBeenCalledTimes(1);
    });
  });

  describe("pre-configured retry helpers", () => {
    it("retry.stripe should succeed on transient failure", async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error("ECONNRESET"))
        .mockResolvedValue({ id: "cs_123" });

      const result = await retry.stripe(fn, "createCheckout");
      expect(result).toEqual({ id: "cs_123" });
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it("retry.email should succeed on transient failure", async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error("ETIMEDOUT"))
        .mockResolvedValue({ messageId: "msg_123" });

      const result = await retry.email(fn, "sendWelcome");
      expect(result).toEqual({ messageId: "msg_123" });
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it("retry.analytics should only retry once", async () => {
      const fn = vi.fn().mockRejectedValue(new Error("timeout"));

      await expect(retry.analytics(fn, "trackEvent")).rejects.toThrow("timeout");
      expect(fn).toHaveBeenCalledTimes(2); // initial + 1 retry
    });
  });
});
