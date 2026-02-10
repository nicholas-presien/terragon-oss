/**
 * Onboarding completion emails module - DISABLED in self-hosted mode.
 * All functions are stubs.
 */
import type { DB } from "../db/index.js";

interface OnboardingCompletionRecipient {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export async function getEligibleOnboardingCompletionRecipients({
  db,
}: {
  db: DB;
}): Promise<OnboardingCompletionRecipient[]> {
  return [];
}

export async function hasOnboardingCompletionEmailBeenSent({
  db,
  userId,
}: {
  db: DB;
  userId: string;
}): Promise<boolean> {
  return false;
}

export async function recordOnboardingCompletionEmail({
  db,
  userId,
  email,
  sentByUserId,
}: {
  db: DB;
  userId: string;
  email: string;
  sentByUserId: string;
}): Promise<void> {
  // No-op in self-hosted mode
}
