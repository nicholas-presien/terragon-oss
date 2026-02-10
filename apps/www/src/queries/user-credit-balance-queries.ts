// Credit balance queries stub for self-hosted mode.
// Credit system is not used in self-hosted deployments.

import { queryOptions, useQuery } from "@tanstack/react-query";

/**
 * Stub query options for user credit balance.
 * Always returns 0 in self-hosted mode.
 */
export function userCreditBalanceQueryOptions(userId: string) {
  return queryOptions({
    queryKey: ["userCreditBalance", userId],
    queryFn: async () => 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Stub hook for user credit balance query.
 * Always returns 0 in self-hosted mode.
 */
export function useUserCreditBalanceQuery(userId: string) {
  return useQuery(userCreditBalanceQueryOptions(userId));
}
