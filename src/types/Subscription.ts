import type Stripe from 'stripe';

export type SubscriptionStatus = 'active' | 'inactive';

export interface Subscription {
  subscription: Stripe.Subscription;
}
