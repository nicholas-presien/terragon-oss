"use server";

import { adminOnly } from "@/lib/auth-server";

export type CancelAllResult = {
  success: number;
  failed: number;
  errors: Array<{ id: string; error: string }>;
};

export const getActiveSubscriptionCount = adminOnly(
  async function getActiveSubscriptionCount(): Promise<number> {
    return 0;
  },
);

export const cancelAllSubscriptionsAtPeriodEnd = adminOnly(
  async function cancelAllSubscriptionsAtPeriodEnd(): Promise<CancelAllResult> {
    throw new Error("Not available in self-hosted mode");
  },
);
