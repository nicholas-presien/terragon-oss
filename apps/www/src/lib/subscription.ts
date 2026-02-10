// Subscription stub for self-hosted mode.
// All users are treated as "pro" tier with full access.

import type { AccessTier } from "@terragon/shared/db/types";

export interface AccessInfo {
  tier: AccessTier;
}

export interface BillingInfo {
  tier: AccessTier;
  stripeCustomerId: string | null;
  trialDaysRemaining: number | null;
  subscription: null;
}

/**
 * Returns access tier information for a user.
 * In self-hosted mode, all users are treated as "pro" tier.
 */
export async function getAccessInfoForUser(
  userId: string,
): Promise<AccessInfo> {
  return {
    tier: "pro",
  };
}

/**
 * Returns billing information for a user.
 * In self-hosted mode, returns stub data with "pro" tier.
 */
export async function getBillingInfoForUser({
  userId,
}: {
  userId: string;
}): Promise<BillingInfo> {
  return {
    tier: "pro",
    stripeCustomerId: null,
    trialDaysRemaining: null,
    subscription: null,
  };
}
