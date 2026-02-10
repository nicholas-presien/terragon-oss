// Usage logging disabled in self-hosted mode

export async function logAnthropicUsage(_args: {
  path: string;
  usage: unknown;
  userId?: string;
  model?: string | null;
  messageId?: string | null;
}) {
  return;
}
