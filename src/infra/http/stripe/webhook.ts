import type Stripe from 'stripe';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { SubscriptionStatus } from 'generated/prisma/client';
import {
  constructStripeEvent,
  extractUserIdFromPaymentIntent,
  amountCentsFromPaymentIntent,
  centsToDecimalString,
  extractStripeCustomerId,
  findUserByStripeCustomerId,
  updateSubscriptionsStatus,
  updateSubscriptionsPriceAndStatus,
  createSubscriptionRecord,
} from 'src/utils/stripe';

export class Webhook {
  constructor(private readonly prisma: PrismaService) {}

  async handle(payload: Buffer | string, signature: string): Promise<void> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('Missing STRIPE_WEBHOOK_SECRET');
    }

    const rawPayload =
      typeof payload === 'string' ? Buffer.from(payload) : payload;
    const stripeEvent = constructStripeEvent(
      rawPayload,
      signature,
      webhookSecret,
    );

    switch (stripeEvent.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentIntentSucceeded(stripeEvent.data.object);
        break;

      case 'invoice.payment_succeeded':
        await this.handleInvoicePaymentSucceeded(stripeEvent.data.object);
        break;

      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(stripeEvent.data.object);
        break;

      default:
        break;
    }
  }

  private async handlePaymentIntentSucceeded(
    paymentIntent: Stripe.PaymentIntent,
  ): Promise<void> {
    const userId = extractUserIdFromPaymentIntent(paymentIntent);
    if (!userId) return;
    const amountCents = amountCentsFromPaymentIntent(paymentIntent);
    const amountDecimalString = centsToDecimalString(amountCents);
    await createSubscriptionRecord(
      this.prisma,
      userId,
      amountDecimalString,
      SubscriptionStatus.active,
    );
  }

  private async handleSubscriptionDeleted(
    subscription: Stripe.Subscription,
  ): Promise<void> {
    const stripeCustomerId = extractStripeCustomerId(subscription);
    if (!stripeCustomerId) return;
    const matchedUser = await findUserByStripeCustomerId(
      this.prisma,
      stripeCustomerId,
    );
    if (!matchedUser) {
      await updateSubscriptionsPriceAndStatus(
        this.prisma,
        'unknown',
        '0',
        SubscriptionStatus.inactive,
      );
      return;
    }
    await updateSubscriptionsStatus(
      this.prisma,
      matchedUser.id,
      SubscriptionStatus.inactive,
    );
  }

  private async handleInvoicePaymentSucceeded(
    invoice: Stripe.Invoice,
  ): Promise<void> {
    const stripeCustomerId = extractStripeCustomerId(invoice);
    if (!stripeCustomerId) return;
    const matchedUser = await findUserByStripeCustomerId(
      this.prisma,
      stripeCustomerId,
    );
    if (!matchedUser) return;
    const totalCents = typeof invoice.total === 'number' ? invoice.total : 0;
    const totalDecimalString = centsToDecimalString(totalCents);
    await updateSubscriptionsPriceAndStatus(
      this.prisma,
      matchedUser.id,
      totalDecimalString,
      SubscriptionStatus.active,
    );
  }
}
