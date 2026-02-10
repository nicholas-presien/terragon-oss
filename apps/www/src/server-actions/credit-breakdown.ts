"use server";

import { userOnlyAction } from "@/lib/auth-server";

export type UserCreditBreakdown = {
  totalCreditsCents: number;
  totalUsageCents: number;
  balanceCents: number;
  recentGrants: Array<{
    id: string;
    amountCents: number;
    description: string | null;
    referenceId: string | null;
    grantType: string | null;
    createdAt: string;
  }>;
};

export const getUserCreditBreakdownAction = userOnlyAction(
  async function getUserCreditBreakdownAction(
    _userId: string,
  ): Promise<UserCreditBreakdown> {
    return {
      totalCreditsCents: 0,
      totalUsageCents: 0,
      balanceCents: 0,
      recentGrants: [],
    };
  },
  { defaultErrorMessage: "Failed to get user credit breakdown" },
);
