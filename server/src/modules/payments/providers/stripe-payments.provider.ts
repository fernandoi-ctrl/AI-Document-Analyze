import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import {
  CheckoutInput,
  CheckoutSession,
  NormalizedWebhookEvent,
  PaymentsProvider,
} from './payments-provider.interface';

@Injectable()
export class StripePaymentsProvider implements PaymentsProvider, OnModuleInit {
  private stripe!: Stripe;
  private priceId!: string;
  private webhookSecret!: string;

  constructor(private readonly config: ConfigService) {}

  onModuleInit(): void {
    const apiKey = this.config.get<string>('STRIPE_SECRET_KEY');
    const priceId = this.config.get<string>('STRIPE_PRICE_ANALYSIS');
    const webhookSecret = this.config.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!apiKey || !priceId || !webhookSecret) {
      throw new InternalServerErrorException('Stripe credentials are not configured');
    }
    this.stripe = new Stripe(apiKey);
    this.priceId = priceId;
    this.webhookSecret = webhookSecret;
  }

  async createCheckout(input: CheckoutInput): Promise<CheckoutSession> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: this.priceId, quantity: 1 }],
      mode: 'payment',
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      customer_email: input.userEmail,
      metadata: { user_id: input.userId },
    });
    if (!session.url) {
      throw new InternalServerErrorException('Stripe did not return a checkout URL');
    }
    return { url: session.url };
  }

  parseWebhook(rawBody: Buffer, signature: string): NormalizedWebhookEvent {
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, this.webhookSecret);
    } catch {
      throw new BadRequestException('Invalid signature');
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      return { type: 'checkout.completed', userId: session.metadata?.user_id ?? undefined };
    }
    return { type: 'unknown' };
  }
}
