/**
 * Credits tests - DISABLED in self-hosted mode.
 * Tests are skipped as the credit system has been removed.
 */
import { describe, it, expect } from "vitest";

describe.skip("credits", () => {
  it("tests skipped - credit system removed for self-hosted mode", () => {
    expect(true).toBe(true);
  });
});
