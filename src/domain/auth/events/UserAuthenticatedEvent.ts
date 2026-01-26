import { DomainEvent } from './DomainEvent';

export class UserAuthenticatedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly timestamp: Date = new Date(),
    occurredAt?: Date,
  ) {
    super(userId, occurredAt);
  }

  getEventName(): string {
    return 'UserAuthenticatedEvent';
  }
}
