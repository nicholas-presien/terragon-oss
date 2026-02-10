/**
 * Stripe credit top-ups tests - DISABLED in self-hosted mode.
 * Tests are skipped as the credit and billing system has been removed.
 */
import { describe, it, expect } from "vitest";

describe.skip("handleStripeCreditTopUpEvent", () => {
  it("tests skipped - billing system removed for self-hosted mode", () => {
    expect(true).toBe(true);
  });
});
