// Billing queries stub for self-hosted mode.
// Billing system is not used in self-hosted deployments.

import { queryOptions, useQuery } from "@tanstack/react-query";

export type BillingInfo = {
  tier: "pro";
  hasActiveSubscription: boolean;
  subscription: null;
  signupTrial: null;
};

/**
 * Stub query options for billing info.
 * Always returns pro tier in self-hosted mode.
 */
export function billingInfoQueryOptions() {
  return queryOptions({
    queryKey: ["billingInfo"],
    queryFn: async (): Promise<BillingInfo> => ({
      tier: "pro",
      hasActiveSubscription: true,
      subscription: null,
      signupTrial: null,
    }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Stub hook for billing info query.
 * Always returns pro tier in self-hosted mode.
 */
export function useBillingInfoQuery() {
  return useQuery(billingInfoQueryOptions());
}
