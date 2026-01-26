import { DomainEvent } from './DomainEvent';

export class PaymentProcessedEvent extends DomainEvent {
  constructor(
    public readonly subscriptionId: string,
    public readonly userId: string,
    public readonly amount: number,
    public readonly status: string,
    occurredAt?: Date,
  ) {
    super(subscriptionId, occurredAt);
  }

  getEventName(): string {
    return 'PaymentProcessedEvent';
  }
}
