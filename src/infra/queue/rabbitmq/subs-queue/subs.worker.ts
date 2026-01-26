import { RabbitMQConnection } from '../rabbitmq.connection';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class SubsWorker implements OnModuleInit {
  private readonly logger = new Logger(SubsWorker.name);

  constructor(
    private readonly rabbit: RabbitMQConnection,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async onModuleInit() {
    this.logger.log('SubsWorker initializing...');
    await this.start();
    this.logger.log('SubsWorker started.');
  }

  async start() {
    try {
      const channel = await this.rabbit.getChannel();
      const exchange = 'domain-events';
      const queue = 'domain-events.subs';
      const routingKey = 'Subscription*';

      await channel.assertExchange(exchange, 'topic', { durable: true });
      await channel.assertQueue(queue, { durable: true });

      await channel.bindQueue(queue, exchange, routingKey);

      channel.consume(queue, async (msg) => {
        if (!msg) return;

        try {
          const content = JSON.parse(msg.content.toString());
          this.logger.log(
            `Processing event: ${content.eventName} (${content.aggregateId})`,
          );

          // Emit event to application handlers
          this.eventEmitter.emit(content.eventName, content.data);

          channel.ack(msg);
          this.logger.log(`Event processed: ${content.eventName}`);
        } catch (err) {
          this.logger.error(
            `Error processing event: ${err.message}`,
            err.stack,
          );
          channel.nack(msg, false, true); // Requeue on error
        }
      });
    } catch (err) {
      this.logger.error('Error starting RabbitmqWorker:', err);
    }
  }
}