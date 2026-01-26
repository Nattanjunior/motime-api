export abstract class DomainEvent {
  public readonly occurredAt: Date;
  public readonly aggregateId: string;

  constructor(aggregateId: string, occurredAt?: Date) {
    this.aggregateId = aggregateId;
    this.occurredAt = occurredAt || new Date();
  }

  abstract getEventName(): string;
}
