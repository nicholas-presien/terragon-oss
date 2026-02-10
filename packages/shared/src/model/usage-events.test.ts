/**
 * Usage events tests - DISABLED in self-hosted mode.
 * Tests are skipped as the usage tracking system has been removed.
 */
import { describe, it, expect } from "vitest";

describe.skip("usage-events", () => {
  it("tests skipped - usage tracking removed for self-hosted mode", () => {
    expect(true).toBe(true);
  });
});
