import { DomainEvent } from './DomainEvent';

export class SubscriptionCancelledEvent extends DomainEvent {
  constructor(
    public readonly subscriptionId: string,
    public readonly userId: string,
    public readonly reason: string,
    occurredAt?: Date,
  ) {
    super(subscriptionId, occurredAt);
  }

  getEventName(): string {
    return 'SubscriptionCancelledEvent';
  }
}
