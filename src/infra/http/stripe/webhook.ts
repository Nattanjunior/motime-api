import { Injectable, Logger } from '@nestjs/common';
import type Stripe from 'stripe';
import { IUserRepository } from 'src/domain/auth/repositories/IUserRepository';
import { ISubscriptionRepository } from 'src/domain/payment/repositories/ISubscriptionRepository';
import { IEventPublisher } from 'src/domain/events/IEventPublisher';
import { PaymentProcessedEvent } from 'src/domain/payment/events/PaymentProcessedEvent';
import { SubscriptionCancelledEvent } from 'src/domain/payment/events/SubscriptionCancelledEvent';
import { Status } from 'src/domain/payment/value-objects/Status';
import { Price } from 'src/domain/payment/value-objects/Price';
import {
  constructStripeEvent,
  extractUserIdFromPaymentIntent,
  amountCentsFromPaymentIntent,
  centsToDecimalString,
  extractStripeCustomerId,
  findUserByStripeCustomerId,
} from 'src/utils/stripe';

@Injectable()
export class Webhook {
  private readonly logger = new Logger(Webhook.name);

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly eventPublisher: IEventPublisher,
  ) {}

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
    try {
      this.logger.log(`Processing payment intent: ${paymentIntent.id}`);
      const userId = extractUserIdFromPaymentIntent(paymentIntent);
      if (!userId) {
        this.logger.warn('No userId found in payment intent metadata');
        return;
      }

      const user = await this.userRepository.findById(userId);
      if (!user) {
        this.logger.warn(`User not found: ${userId}`);
        return;
      }

      const amountCents = amountCentsFromPaymentIntent(paymentIntent);
      const amountDecimal = centsToDecimalString(amountCents);

      this.logger.log(`Payment processed for user ${userId}: ${amountDecimal}`);

      // Publish event
      const event = new PaymentProcessedEvent(
        paymentIntent.id,
        userId,
        amountCents / 100,
        'succeeded',
      );
      await this.eventPublisher.publish(event);
    } catch (error) {
      this.logger.error(
        `Error handling payment intent: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async handleSubscriptionDeleted(
    subscription: Stripe.Subscription,
  ): Promise<void> {
    try {
      this.logger.log(`Processing subscription deletion: ${subscription.id}`);
      const stripeCustomerId = extractStripeCustomerId(subscription);
      if (!stripeCustomerId) {
        this.logger.warn('No customer ID found in subscription');
        return;
      }

      const user = await this.userRepository.findByStripeCustomerId(
        stripeCustomerId,
      );
      if (!user) {
        this.logger.warn(
          `User not found for Stripe customer: ${stripeCustomerId}`,
        );
        return;
      }

      // Find and update subscription
      const subscriptions = await this.subscriptionRepository.findByUserId(
        user.getId().getValue(),
      );
      for (const sub of subscriptions) {
        sub.cancel();
        await this.subscriptionRepository.update(sub);

        this.logger.log(
          `Subscription cancelled: ${sub.getId().getValue()}`,
        );

        // Publish event
        const event = new SubscriptionCancelledEvent(
          sub.getId().getValue(),
          user.getId().getValue(),
          'Stripe subscription deleted',
        );
        await this.eventPublisher.publish(event);
      }
    } catch (error) {
      this.logger.error(
        `Error handling subscription deletion: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async handleInvoicePaymentSucceeded(
    invoice: Stripe.Invoice,
  ): Promise<void> {
    try {
      this.logger.log(`Processing invoice payment: ${invoice.id}`);
      const stripeCustomerId = extractStripeCustomerId(invoice);
      if (!stripeCustomerId) {
        this.logger.warn('No customer ID found in invoice');
        return;
      }

      const user = await this.userRepository.findByStripeCustomerId(
        stripeCustomerId,
      );
      if (!user) {
        this.logger.warn(
          `User not found for Stripe customer: ${stripeCustomerId}`,
        );
        return;
      }

      const totalCents = typeof invoice.total === 'number' ? invoice.total : 0;
      const totalDecimal = centsToDecimalString(totalCents);

      this.logger.log(
        `Invoice payment processed for user ${user.getId().getValue()}: ${totalDecimal}`,
      );

      // Update subscription if exists
      const subscriptions = await this.subscriptionRepository.findByUserId(
        user.getId().getValue(),
      );
      for (const sub of subscriptions) {
        if (!sub.isActive()) {
          sub.activate();
          await this.subscriptionRepository.update(sub);
        }
      }

      // Publish event
      const event = new PaymentProcessedEvent(
        invoice.id,
        user.getId().getValue(),
        totalCents / 100,
        'succeeded',
      );
      await this.eventPublisher.publish(event);
    } catch (error) {
      this.logger.error(
        `Error handling invoice payment: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
