// Loops email stub for self-hosted mode.
// Email marketing functionality is not available in self-hosted deployments.

/**
 * Stub for sending Loops events.
 * No-op in self-hosted mode.
 */
export async function sendLoopsEvent(
  email: string,
  eventName: string,
  eventProperties?: Record<string, any>,
): Promise<void> {
  // No-op for self-hosted
  return;
}

/**
 * Stub for updating Loops contact.
 * No-op in self-hosted mode.
 */
export async function updateLoopsContact(
  email: string,
  properties: Record<string, any>,
): Promise<void> {
  // No-op for self-hosted
  return;
}

/**
 * Stub for sending transactional emails via Loops.
 * No-op in self-hosted mode.
 */
export async function sendLoopsTransactionalEmail(params: {
  email: string;
  transactionalId: string;
  dataVariables?: Record<string, any>;
}): Promise<void> {
  // No-op for self-hosted
  return;
}
