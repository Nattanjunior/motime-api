import { Injectable, Logger } from '@nestjs/common';
import { IEventPublisher } from 'src/domain/events/IEventPublisher';
import { IDomainEvent } from 'src/domain/events/IDomainEvent';
import { RabbitMQConnection } from '../rabbitmq.connection';

@Injectable()
export class SubsQueuePublisher implements IEventPublisher {
  private readonly logger = new Logger(SubsQueuePublisher.name);

  constructor(private readonly rabbit: RabbitMQConnection) {}

  async publish(event: IDomainEvent): Promise<void> {
    try {
      const channel = await this.rabbit.getChannel();
      const exchange = 'domain-events';
      const routingKey = event.getEventName();

      await channel.assertExchange(exchange, 'topic', { durable: true });

      const messagePayload = {
        eventName: event.getEventName(),
        aggregateId: event.getAggregateId(),
        occurredAt: event.getOccurredAt(),
        data: event,
      };

      channel.publish(
        exchange,
        routingKey,
        Buffer.from(JSON.stringify(messagePayload)),
        { persistent: true },
      );

      this.logger.log(
        `Event published: ${event.getEventName()} (${event.getAggregateId()})`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to publish event: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async publishBatch(events: IDomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }
}