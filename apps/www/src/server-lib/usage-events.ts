// Usage event tracking has been removed for self-hosted deployment.
// This stub preserves the export to prevent import errors.

export async function trackUsageEvents(_opts: {
  userId: string;
  costUsd?: number;
  agentDurationMs?: number;
  applicationDurationMs?: number;
}): Promise<void> {
  // No-op in self-hosted mode
}
