import type Stripe from "stripe";

export interface Subscription {
  subscription: Stripe.Subscription
}