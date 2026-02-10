// Credit balance stub for self-hosted mode.
// Credit system is not used in self-hosted deployments.

/**
 * Stub for getting user credit balance.
 * Always returns zero balance in self-hosted mode.
 */
export async function getCachedUserCreditBalance(userId: string): Promise<{
  totalCreditsCents: number;
  totalUsageCents: number;
  balanceCents: number;
}> {
  return {
    totalCreditsCents: 0,
    totalUsageCents: 0,
    balanceCents: 0,
  };
}
