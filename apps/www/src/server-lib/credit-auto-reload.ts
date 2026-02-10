// Credit auto-reload has been removed for self-hosted deployment.
// This stub preserves the export to prevent import errors.

export async function maybeTriggerCreditAutoReload(_opts: {
  userId: string;
  balanceCents: number;
}): Promise<void> {
  // No-op in self-hosted mode
}
