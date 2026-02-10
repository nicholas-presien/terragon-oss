import type {
  AccessInfo,
  AccessTier,
  BillingInfo,
} from "@terragon/shared/db/types";

// Self-hosted mode: always grant "pro" tier access, no billing.

export async function getAccessInfoForUser(
  _userId: string,
): Promise<AccessInfo> {
  return { tier: "pro" };
}

export async function getBillingInfo(): Promise<BillingInfo> {
  return {
    hasActiveSubscription: true,
    subscription: null,
    signupTrial: null,
    unusedPromotionCode: false,
    isShutdownMode: false,
  };
}

export async function getBillingInfoForUser(_: {
  userId: string;
}): Promise<BillingInfo> {
  return getBillingInfo();
}
