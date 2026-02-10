// Credits stub for self-hosted mode.
// Credit system is not used in self-hosted deployments.

/**
 * Stub for granting user credits.
 * No-op in self-hosted mode as credit system is disabled.
 */
export async function grantUserCredits({
  db,
  userId,
  credits,
  reason,
}: {
  db: any;
  userId: string;
  credits: number;
  reason: string;
}): Promise<void> {
  // No-op for self-hosted - credit system not used
  return;
}
