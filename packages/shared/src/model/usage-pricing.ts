// Usage-pricing functionality removed for self-hosted deployment.
// Stubs kept so existing imports don't break at compile time.

export type UsageTokenUsage = {
  inputTokens?: number | string | null;
  cachedInputTokens?: number | string | null;
  cacheCreationInputTokens?: number | string | null;
  outputTokens?: number | string | null;
};

export type UsageSkuPricing = {
  currency: "usd";
  inputRatePerToken: number;
  cachedInputRatePerToken: number;
  cacheCreationRatePerToken: number;
  outputRatePerToken: number;
};

export const USAGE_SKU_PRICING: Record<string, UsageSkuPricing> = {};

/** Always returns 0 – pricing disabled in self-hosted mode. */
export function calculateUsageCostUsd(_opts: {
  sku: string;
  usage: UsageTokenUsage;
}): number {
  return 0;
}

/** Returns a default SKU string. */
export function getOpenAIResponsesSkuForModel(_model?: string | null): string {
  return "openai_responses_gpt_5";
}

/** Returns a default SKU string. */
export function getAnthropicMessagesSkuForModel(
  _model?: string | null,
): string {
  return "anthropic_messages_default";
}

/** Returns a default SKU string. */
export function getOpenRouterSkuForModel(_model?: string | null): string {
  return "openrouter_default";
}

/** Returns a default SKU string. */
export function getGoogleSkuForModel(_model?: string | null): string {
  return "google_default";
}
