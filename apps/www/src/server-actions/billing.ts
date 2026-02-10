"use server";

import { userOnlyAction } from "@/lib/auth-server";
import { getBillingInfo as getBillingInfoInternal } from "@/lib/subscription";
import { UserFacingError } from "@/lib/server-actions";
import { AccessTier } from "@terragon/shared";

export const getBillingInfoAction = userOnlyAction(
  async function getBillingInfoAction() {
    return await getBillingInfoInternal();
  },
  { defaultErrorMessage: "Failed to get billing info" },
);

export const getStripeCheckoutUrl = userOnlyAction(
  async function getStripeCheckoutUrl(
    _userId: string,
    _opts?: { plan?: AccessTier },
  ): Promise<string> {
    throw new UserFacingError("Billing is not available in self-hosted mode.");
  },
  { defaultErrorMessage: "Failed to get Stripe checkout URL" },
);

export const getStripeBillingPortalUrl = userOnlyAction(
  async function getStripeBillingPortalUrl(): Promise<string> {
    throw new UserFacingError("Billing is not available in self-hosted mode.");
  },
  { defaultErrorMessage: "Failed to get Stripe billing portal URL" },
);

export const setSignupTrialPlan = userOnlyAction(
  async function setSignupTrialPlan(_userId: string, _plan: AccessTier) {
    // No-op in self-hosted mode
  },
  { defaultErrorMessage: "Failed to set signup trial plan" },
);
