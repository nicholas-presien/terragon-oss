// Billing/credits functionality removed for self-hosted deployment.
// Stubs kept so existing imports don't break at compile time.

export type UserBalanceSummary = {
  totalCreditsCents: number;
  totalUsageCents: number;
  balanceCents: number;
};

export type UserCreditGrant = {
  userId: string;
  amountCents: number;
  description?: string | null;
  referenceId?: string | null;
  grantType: string;
};

export const BILLABLE_EVENT_TYPES: string[] = [];

/** No-op – credits disabled in self-hosted mode. */
export async function grantUserCredits(_opts: {
  db: unknown;
  grants: UserCreditGrant;
}): Promise<void> {}

/** Always returns zero balances – credits disabled in self-hosted mode. */
export async function getUserCreditBalance(_opts: {
  db: unknown;
  userId: string;
  skipAggCache?: boolean;
}): Promise<UserBalanceSummary> {
  return { totalCreditsCents: 0, totalUsageCents: 0, balanceCents: 0 };
}

export function decimalValueToCents(
  _value: string | number | null | undefined,
): number {
  return 0;
}

export function usdNumberToCents(_value: number): number {
  return 0;
}

export function sumAggregatedUsageCents(_aggregates: unknown[]): number {
  return 0;
}

/** Always returns empty array – credits disabled in self-hosted mode. */
export async function getUserCredits(_opts: {
  db: unknown;
  userId: string;
  grantType?: string;
  referenceId?: string;
  limit?: number;
}): Promise<never[]> {
  return [];
}

/** No-op – credits disabled in self-hosted mode. */
export async function updateUsageEventsAggCacheForUser(_opts: {
  db: unknown;
  userId: string;
  upToDate: Date;
}): Promise<void> {}
