import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RabbitMQConnection } from './rabbitmq/rabbitmq.connection';
import { SubsQueuePublisher } from './rabbitmq/subs-queue/subs.publish';
import { SubsWorker } from './rabbitmq/subs-queue/subs.worker';
import { IEventPublisher } from '../domain/events/IEventPublisher';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [
    RabbitMQConnection,
    SubsQueuePublisher,
    SubsWorker,
    {
      provide: IEventPublisher,
      useClass: SubsQueuePublisher,
    },
  ],
  exports: [RabbitMQConnection, IEventPublisher],
})
export class QueueModule {}
