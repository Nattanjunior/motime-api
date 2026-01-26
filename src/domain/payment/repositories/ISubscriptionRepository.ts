import { Subscription } from '../entities/Subscription';

export abstract class ISubscriptionRepository {
  abstract create(subscription: Subscription): Promise<Subscription>;
  abstract update(subscription: Subscription): Promise<Subscription>;
  abstract findById(id: string): Promise<Subscription | null>;
  abstract findByUserId(userId: string): Promise<Subscription[]>;
  abstract findByStripeSubscriptionId(
    stripeSubscriptionId: string,
  ): Promise<Subscription | null>;
  abstract delete(id: string): Promise<void>;
  abstract findAll(): Promise<Subscription[]>;
}
