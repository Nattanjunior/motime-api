export class PaymentFailedError extends Error {
  constructor(reason: string) {
    super(`Payment failed: ${reason}`);
    this.name = 'PaymentFailedError';
  }
}

export class SubscriptionNotFoundError extends Error {
  constructor(identifier: string) {
    super(`Subscription with identifier ${identifier} not found`);
    this.name = 'SubscriptionNotFoundError';
  }
}

export class SubscriptionAlreadyActiveError extends Error {
  constructor(subscriptionId: string) {
    super(`Subscription ${subscriptionId} is already active`);
    this.name = 'SubscriptionAlreadyActiveError';
  }
}

export class InvalidPriceError extends Error {
  constructor(price: string) {
    super(`Invalid price: ${price}`);
    this.name = 'InvalidPriceError';
  }
}

export class StripeIntegrationError extends Error {
  constructor(message: string) {
    super(`Stripe integration error: ${message}`);
    this.name = 'StripeIntegrationError';
  }
}
