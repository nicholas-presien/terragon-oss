/**
 * Reengagement emails tests - DISABLED in self-hosted mode.
 * Tests are skipped as the feature is not available.
 */
import { describe, it, expect } from "vitest";

describe.skip("reengagement-emails", () => {
  it("tests skipped - feature disabled in self-hosted mode", () => {
    expect(true).toBe(true);
  });
});
