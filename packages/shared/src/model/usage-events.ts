// Usage-event tracking removed for self-hosted deployment.
// Stubs kept so existing imports don't break at compile time.

/** No-op – usage tracking disabled in self-hosted mode. */
export async function trackUsageEventBatched(_opts: {
  db: unknown;
  userId: string;
  events: {
    eventType: string;
    value: number;
    createdAt?: Date;
    tokenUsage?: {
      inputTokens?: number | null;
      cachedInputTokens?: number | null;
      cacheCreationInputTokens?: number | null;
      outputTokens?: number | null;
    };
    sku?: string | null;
  }[];
}): Promise<void> {}

/** Always returns empty array – usage tracking disabled in self-hosted mode. */
export async function getUserUsageEvents(_opts: {
  db: unknown;
  userId: string;
  eventType?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<never[]> {
  return [];
}

/** Always returns empty array – usage tracking disabled in self-hosted mode. */
export async function getUserUsageEventsAggregated(_opts: {
  db: unknown;
  userId: string;
  startDate: Date;
  endDate: Date;
  timezone?: string;
}): Promise<never[]> {
  return [];
}
