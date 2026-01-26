import { DomainEvent } from './DomainEvent';

export class SubscriptionCreatedEvent extends DomainEvent {
  constructor(
    public readonly subscriptionId: string,
    public readonly userId: string,
    public readonly price: string,
    public readonly status: string,
    occurredAt?: Date,
  ) {
    super(subscriptionId, occurredAt);
  }

  getEventName(): string {
    return 'SubscriptionCreatedEvent';
  }
}
