import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreditsService } from './credits.service';
import {
  CheckoutSession,
  NormalizedWebhookEvent,
  PaymentsProvider,
} from './providers/payments-provider.interface';
import { PAYMENTS_PROVIDER } from './providers/payments.tokens';
import { RequestUser } from '../../common/auth/auth-user.types';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @Inject(PAYMENTS_PROVIDER) private readonly provider: PaymentsProvider,
    private readonly credits: CreditsService,
    private readonly config: ConfigService,
  ) {}

  createCheckout(user: RequestUser): Promise<CheckoutSession> {
    return this.provider.createCheckout({
      userId: user.id,
      userEmail: user.email,
      successUrl: this.config.get<string>('CHECKOUT_SUCCESS_URL') ?? 'http://localhost:3000/success',
      cancelUrl: this.config.get<string>('CHECKOUT_CANCEL_URL') ?? 'http://localhost:3000/analyze',
    });
  }

  async handleWebhook(rawBody: Buffer, signature: string): Promise<void> {
    const event: NormalizedWebhookEvent = this.provider.parseWebhook(rawBody, signature);
    if (event.type !== 'checkout.completed' || !event.userId) return;

    const amount = Number(this.config.get<string>('CREDITS_PER_PURCHASE') ?? 3);
    try {
      await this.credits.grant(event.userId, amount);
    } catch (err) {
      this.logger.error(`Failed to grant credits: ${(err as Error).message}`);
    }
  }

  getCredits(user: RequestUser): Promise<number> {
    return this.credits.read(user.id);
  }
}
