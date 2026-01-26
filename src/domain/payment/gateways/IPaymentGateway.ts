export interface PaymentDetails {
  customerId: string;
  paymentMethodId: string;
  amount: number;
  currency: string;
}

export interface StripeSubscriptionDetails {
  customerId: string;
  priceId: string;
  metadata?: Record<string, string>;
}

export abstract class IPaymentGateway {
  abstract createCustomer(email: string, name: string): Promise<string>;
  abstract createSubscription(details: StripeSubscriptionDetails): Promise<string>;
  abstract cancelSubscription(subscriptionId: string): Promise<void>;
  abstract updateSubscription(
    subscriptionId: string,
    priceId: string,
  ): Promise<void>;
  abstract retrieveCustomer(customerId: string): Promise<any>;
}
