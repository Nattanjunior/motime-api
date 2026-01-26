import { IDomainEvent } from './IDomainEvent';

export abstract class IEventPublisher {
  abstract publish(event: IDomainEvent): Promise<void>;
  abstract publishBatch(events: IDomainEvent[]): Promise<void>;
}
