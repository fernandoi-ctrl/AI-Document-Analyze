import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { AuthUser } from '../../common/auth/auth-user.decorator';
import { RequestUser } from '../../common/auth/auth-user.types';
import { PaymentsService } from './payments.service';
import { CheckoutResponseDto } from './dto/checkout-response.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  async checkout(@AuthUser() user: RequestUser): Promise<CheckoutResponseDto> {
    const session = await this.payments.createCheckout(user);
    return { url: session.url };
  }

  @Get('credits')
  @UseGuards(JwtAuthGuard)
  async credits(@AuthUser() user: RequestUser): Promise<{ credits: number }> {
    return { credits: await this.payments.getCredits(user) };
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async webhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string | undefined,
  ): Promise<{ received: true }> {
    if (!signature) throw new BadRequestException('Missing signature');
    const raw = (req as Request & { rawBody?: Buffer }).rawBody;
    if (!raw) throw new BadRequestException('Missing raw body');
    await this.payments.handleWebhook(raw, signature);
    return { received: true };
  }
}
