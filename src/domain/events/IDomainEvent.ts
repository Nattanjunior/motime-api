export interface IDomainEvent {
  getEventName(): string;
  getAggregateId(): string;
  getOccurredAt(): Date;
}
