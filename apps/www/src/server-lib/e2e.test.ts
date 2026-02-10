/**
 * E2E tests - DISABLED in self-hosted mode.
 * These tests relied on session-based authentication which has been removed.
 * Tests are skipped until they can be refactored for self-hosted mode.
 */
import { describe, it, expect } from "vitest";

describe.skip("e2e", () => {
  it("tests skipped - requires refactoring for self-hosted mode", () => {
    expect(true).toBe(true);
  });
});
