import { RabbitMQConnection } from '../rabbitmq.connection';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';


@Injectable()
export class SubsWorker implements OnModuleInit {
  constructor(
    // private readonly handler: SubsEventHandler,
    private readonly rabbit: RabbitMQConnection,
  ) { }

  async onModuleInit() {
    console.log('SubsWorker initializing...');
    await this.start();
    console.log('SubsWorker started.');
  }

  async start() {
    try {
      const channel = await this.rabbit.getChannel();
      const exchange = 'subs.request';
      const queue = 'subs.queue';
      const routingKey = 'subs.key';

      await channel.assertExchange(exchange, 'direct', { durable: true });
      await channel.assertQueue(queue, { durable: true });

      await channel.bindQueue(queue, exchange, routingKey);

      channel.consume(queue, async (msg) => {
        if (!msg) return;

        const data = JSON.parse(msg.content.toString());

        try {
          // await this.handler.handle(data);
          channel.ack(msg);
        } catch (err) {
          channel.nack(msg);
        }
      });
    } catch (err) {
      console.error('Error starting RabbitmqWorker:', err);
    }
  }
}