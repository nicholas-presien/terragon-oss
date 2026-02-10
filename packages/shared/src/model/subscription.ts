// Billing/subscription functionality removed for self-hosted deployment.
// Stubs kept so existing imports don't break at compile time.

import type { AccessTier, SignupTrialInfo } from "../db/types";

export type { SignupTrialInfo };

/** Always returns null – no signup trial in self-hosted mode. */
export function getSignupTrialInfo(_user: {
  createdAt?: Date | null;
  signupTrialPlan?: string | null;
}): SignupTrialInfo | null {
  return null;
}

/** Always returns null – no signup trial in self-hosted mode. */
export async function getSignupTrialInfoForUser(_opts: {
  db: unknown;
  userId: string;
}): Promise<SignupTrialInfo | null> {
  return null;
}

/** Always returns null – no subscriptions in self-hosted mode. */
export async function getSubscriptionInfoForUser(_opts: {
  db: unknown;
  userId: string;
  isActive?: boolean;
}): Promise<null> {
  return null;
}

/** Always returns null – no promotion codes in self-hosted mode. */
export async function getUnusedPromotionCodeForUser(_opts: {
  db: unknown;
  userId: string;
}): Promise<null> {
  return null;
}

/** No-op – no signup trials in self-hosted mode. */
export async function setSignupTrialPlanForUser(_opts: {
  db: unknown;
  userId: string;
  plan: AccessTier;
}): Promise<void> {}
