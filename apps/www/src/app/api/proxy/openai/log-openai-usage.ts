// Usage logging disabled in self-hosted mode

export async function logOpenAIUsage(_args: {
  path: string;
  usage: unknown;
  responseId?: string;
  userId?: string;
  model?: string;
}) {
  return;
}
