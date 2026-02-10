// Usage logging disabled in self-hosted mode

export async function logOpenRouterUsage(_args: {
  path: string;
  usage: unknown;
  userId?: string;
  model?: string;
}) {
  return;
}
