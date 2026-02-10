// Credit balance has been removed for self-hosted deployment.
// Returns a large balance stub so credit checks never block usage.

export const creditsTagFor = (userId: string) => `credits:user:${userId}`;

export async function getCachedUserCreditBalance(
  _userId: string,
): Promise<{ balanceCents: number }> {
  // Self-hosted mode: unlimited credits
  return { balanceCents: 999_999_99 };
}
