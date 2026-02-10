// Stripe has been removed for self-hosted deployment.
// These stubs preserve export names to prevent import errors.

export function isStripeConfigured(): boolean {
  return false;
}

export function isStripeConfiguredForCredits(): boolean {
  return false;
}

export function assertStripeConfigured(): void {
  throw new Error("Stripe is not configured in self-hosted mode");
}

export function assertStripeConfiguredForCredits(): void {
  throw new Error("Stripe is not configured in self-hosted mode");
}

export function getStripeClient(): never {
  throw new Error("Stripe is not available in self-hosted mode");
}

export const STRIPE_PLAN_CONFIGS: { name: string; priceId: string }[] = [];

export function getStripeWebhookSecret(): string {
  throw new Error("Stripe is not configured in self-hosted mode");
}

export function getStripeCreditPackPriceId(): string {
  throw new Error("Stripe is not configured in self-hosted mode");
}

export async function stripeCheckoutSessionsCreate(
  _params: unknown,
): Promise<never> {
  throw new Error("Stripe is not available in self-hosted mode");
}

export async function stripeCustomersCreate(_params: unknown): Promise<never> {
  throw new Error("Stripe is not available in self-hosted mode");
}

export function stripeInvoicesCreate(_params: unknown): never {
  throw new Error("Stripe is not available in self-hosted mode");
}

export function stripeInvoiceItemsCreate(_params: unknown): never {
  throw new Error("Stripe is not available in self-hosted mode");
}

export function stripeInvoicesFinalizeInvoice(_invoiceId: string): never {
  throw new Error("Stripe is not available in self-hosted mode");
}

export function stripeInvoicesPay(_invoiceId: string, _params: unknown): never {
  throw new Error("Stripe is not available in self-hosted mode");
}

export function stripeCouponsCreate(_params: unknown): never {
  throw new Error("Stripe is not available in self-hosted mode");
}

export function stripePromotionCodesCreate(
  _params: unknown,
  _options?: unknown,
): never {
  throw new Error("Stripe is not available in self-hosted mode");
}
