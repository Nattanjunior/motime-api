import { Controller, Post, RawBodyRequest, Req } from '@nestjs/common';
import { Request } from 'express';
import { Webhook } from '../stripe/webhook';

@Controller('api/stripe')
export class StripeController {
  constructor(private readonly webhookHandler: Webhook) {}

  @Post('webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
  ): Promise<{ received: boolean }> {
    const signature = req.headers['stripe-signature'] as string;
    const rawBody = req.rawBody;

    if (!signature || !rawBody) {
      return { received: false };
    }

    try {
      await this.webhookHandler.handle(rawBody, signature);
      return { received: true };
    } catch (error) {
      console.error('Webhook processing error:', error);
      throw error;
    }
  }
}
