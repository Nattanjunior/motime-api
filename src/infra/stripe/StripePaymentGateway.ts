import { Injectable, Logger } from '@nestjs/common';
import { stripe } from '../../lib/stripe';
import {
  IPaymentGateway,
  PaymentDetails,
  StripeSubscriptionDetails,
} from '../../domain/payment/gateways/IPaymentGateway';
import { StripeIntegrationError } from '../../domain/payment/errors/PaymentErrors';

@Injectable()
export class StripePaymentGateway implements IPaymentGateway {
  private readonly logger = new Logger(StripePaymentGateway.name);

  async createCustomer(email: string, name: string): Promise<string> {
    try {
      this.logger.log(`Creating Stripe customer for ${email}`);
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          createdAt: new Date().toISOString(),
        },
      });
      this.logger.log(`Stripe customer created: ${customer.id}`);
      return customer.id;
    } catch (error) {
      this.logger.error(`Failed to create Stripe customer: ${error.message}`);
      throw new StripeIntegrationError(`Failed to create customer: ${error.message}`);
    }
  }

  async createSubscription(
    details: StripeSubscriptionDetails,
  ): Promise<string> {
    try {
      this.logger.log(
        `Creating Stripe subscription for customer ${details.customerId}`,
      );

      const subscription = await stripe.subscriptions.create({
        customer: details.customerId,
        items: [{ price: details.priceId }],
        metadata: details.metadata || {},
      });

      this.logger.log(`Stripe subscription created: ${subscription.id}`);
      return subscription.id;
    } catch (error) {
      this.logger.error(
        `Failed to create Stripe subscription: ${error.message}`,
      );
      throw new StripeIntegrationError(
        `Failed to create subscription: ${error.message}`,
      );
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      this.logger.log(`Cancelling Stripe subscription ${subscriptionId}`);
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
      this.logger.log(`Stripe subscription cancelled: ${subscriptionId}`);
    } catch (error) {
      this.logger.error(
        `Failed to cancel Stripe subscription: ${error.message}`,
      );
      throw new StripeIntegrationError(
        `Failed to cancel subscription: ${error.message}`,
      );
    }
  }

  async updateSubscription(
    subscriptionId: string,
    priceId: string,
  ): Promise<void> {
    try {
      this.logger.log(
        `Updating Stripe subscription ${subscriptionId} with price ${priceId}`,
      );

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      if (subscription.items.data.length > 0) {
        await stripe.subscriptionItems.update(
          subscription.items.data[0].id,
          { price: priceId },
        );
      }

      this.logger.log(`Stripe subscription updated: ${subscriptionId}`);
    } catch (error) {
      this.logger.error(
        `Failed to update Stripe subscription: ${error.message}`,
      );
      throw new StripeIntegrationError(
        `Failed to update subscription: ${error.message}`,
      );
    }
  }

  async retrieveCustomer(customerId: string): Promise<any> {
    try {
      this.logger.log(`Retrieving Stripe customer ${customerId}`);
      const customer = await stripe.customers.retrieve(customerId);
      return customer;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve Stripe customer: ${error.message}`,
      );
      throw new StripeIntegrationError(
        `Failed to retrieve customer: ${error.message}`,
      );
    }
  }
}
