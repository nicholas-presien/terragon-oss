"use server";

import { userOnlyAction } from "@/lib/auth-server";

export const getUserCreditBalanceAction = userOnlyAction(
  async function getUserCreditBalanceAction(_userId: string) {
    // Self-hosted mode: unlimited credits
    return { balanceCents: 999_999_99 };
  },
  { defaultErrorMessage: "Failed to get credit balance" },
);
