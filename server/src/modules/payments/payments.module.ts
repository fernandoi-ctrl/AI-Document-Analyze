import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { CreditsService } from './credits.service';
import { CreditsRepository } from './credits.repository';
import { PAYMENTS_PROVIDER } from './providers/payments.tokens';
import { StripePaymentsProvider } from './providers/stripe-payments.provider';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';

@Module({
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    CreditsService,
    CreditsRepository,
    JwtAuthGuard,
    { provide: PAYMENTS_PROVIDER, useClass: StripePaymentsProvider },
  ],
  exports: [CreditsService],
})
export class PaymentsModule {}
