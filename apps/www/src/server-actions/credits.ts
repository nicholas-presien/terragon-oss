"use server";

import { userOnlyAction } from "@/lib/auth-server";
import { UserFacingError } from "@/lib/server-actions";

export const createCreditTopUpCheckoutSession = userOnlyAction(
  async function createCreditTopUpCheckoutSession(_userId: string) {
    throw new UserFacingError("Credits are not available in self-hosted mode.");
  },
  { defaultErrorMessage: "Failed to create Stripe checkout session" },
);

export const createManagePaymentsSession = userOnlyAction(
  async function createManagePaymentsSession(_userId: string) {
    throw new UserFacingError("Billing is not available in self-hosted mode.");
  },
  { defaultErrorMessage: "Failed to create Stripe billing portal session" },
);
