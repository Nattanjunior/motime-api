import { DomainEvent } from './DomainEvent';

export class UserRegisteredEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly name: string,
    public readonly phone: string,
    occurredAt?: Date,
  ) {
    super(userId, occurredAt);
  }

  getEventName(): string {
    return 'UserRegisteredEvent';
  }
}
