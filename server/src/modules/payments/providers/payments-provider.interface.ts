export interface CheckoutInput {
  userId: string;
  userEmail: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutSession {
  url: string;
}

export type WebhookEventType = 'checkout.completed' | 'unknown';

export interface NormalizedWebhookEvent {
  type: WebhookEventType;
  userId?: string;
}

export interface PaymentsProvider {
  createCheckout(input: CheckoutInput): Promise<CheckoutSession>;
  parseWebhook(rawBody: Buffer, signature: string): NormalizedWebhookEvent;
}
