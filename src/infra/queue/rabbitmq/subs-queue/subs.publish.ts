import type { EventPublisher } from 'src/domain/rabbitmq/publish';
import { RabbitMQConnection } from '../rabbitmq.connection';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SubsQueuePublisher implements EventPublisher {
  constructor(private readonly rabbit: RabbitMQConnection) { }

  async publish(event: string) {
    const channel = await this.rabbit.getChannel();

    const exchange = 'subs.request';
    const routingKey = 'subs.key';

    await channel.assertExchange(exchange, 'direct', { durable: true });

    channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(event)),
      { persistent: true },
    );
  }
}