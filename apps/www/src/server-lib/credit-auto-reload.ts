// Credit auto-reload stub for self-hosted mode.
// Credit system and auto-reload functionality are not used in self-hosted deployments.

/**
 * Stub for triggering credit auto-reload.
 * No-op in self-hosted mode as credit system is disabled.
 */
export async function maybeTriggerCreditAutoReload(
  userId: string,
): Promise<void> {
  // No-op for self-hosted - credit system not used
  return;
}
