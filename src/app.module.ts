import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infra/database/prisma/prisma.module';
import { AuthModule } from './application/use-cases/auth/auth.module';
import { AuthController } from './infra/http/controllers/auth.controller';
import { SubscriptionsController } from './infra/http/controllers/subscriptions.controller';
import { SubscriptionRepository } from './domain/prisma/subscription.repository';
import { CreatedSubsUseCase } from './application/use-cases/subscription/createdSubsUseCase';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AppController, AuthController, SubscriptionsController],
  providers: [AppService, SubscriptionRepository, CreatedSubsUseCase],
})
export class AppModule {}
