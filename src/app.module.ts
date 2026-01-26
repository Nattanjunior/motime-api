import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infra/database/prisma/prisma.module';
import { QueueModule } from './infra/queue/queue.module';
import { AuthModule } from './application/use-cases/auth/auth.module';
import { AuthController } from './infra/http/controllers/auth.controller';
import { SubscriptionsController } from './infra/http/controllers/subscriptions.controller';
import { StripeController } from './infra/http/controllers/stripe.controller';
import { CreatedSubsUseCase } from './application/use-cases/subscription/createdSubsUseCase';
import { JwtStrategy } from './shared/strategies/jwt.strategy';
import { Webhook } from './infra/http/stripe/webhook';
import { SubscriptionRepository } from './infra/database/repositories/SubscriptionRepository';
import { StripePaymentGateway } from './infra/stripe/StripePaymentGateway';
import { ISubscriptionRepository } from './domain/payment/repositories/ISubscriptionRepository';
import { IPaymentGateway } from './domain/payment/gateways/IPaymentGateway';

@Module({
  imports: [
    PrismaModule,
    QueueModule,
    AuthModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AppController, AuthController, SubscriptionsController, StripeController],
  providers: [
    AppService,
    CreatedSubsUseCase,
    JwtStrategy,
    Webhook,
    {
      provide: ISubscriptionRepository,
      useClass: SubscriptionRepository,
    },
    {
      provide: IPaymentGateway,
      useClass: StripePaymentGateway,
    },
  ],
})
export class AppModule {}
