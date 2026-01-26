import { Injectable } from '@nestjs/common';
import { ISubscriptionRepository } from 'src/domain/payment/repositories/ISubscriptionRepository';
import { IPaymentGateway } from 'src/domain/payment/gateways/IPaymentGateway';
import { IUserRepository } from 'src/domain/auth/repositories/IUserRepository';
import { Subscription } from 'src/domain/payment/entities/Subscription';
import { Price } from 'src/domain/payment/value-objects/Price';
import { Status } from 'src/domain/payment/value-objects/Status';
import { UserNotFoundError } from 'src/domain/auth/errors/AuthErrors';
import { StripeIntegrationError } from 'src/domain/payment/errors/PaymentErrors';
import { SubscriptionStatus } from 'generated/prisma/enums';
import type { SubsDb } from 'src/types/SubsDb';

export interface CreateSubscriptionInput {
  userId: string;
  priceId: string;
}

@Injectable()
export class CreatedSubsUseCase {
  constructor(
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly userRepository: IUserRepository,
    private readonly paymentGateway: IPaymentGateway,
  ) {}

  async execute(input: CreateSubscriptionInput): Promise<SubsDb> {
    const { userId, priceId } = input;

    // Verify user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }

    try {
      // Ensure Stripe customer exists
      let stripeCustomerId = user.getStripeCustomerId();
      if (!stripeCustomerId) {
        stripeCustomerId = await this.paymentGateway.createCustomer(
          user.getEmail().getValue(),
          user.getName(),
        );
        user.setStripeCustomerId(stripeCustomerId);
        await this.userRepository.update(user);
      }

      // Create Stripe subscription
      const stripeSubscriptionId =
        await this.paymentGateway.createSubscription({
          customerId: stripeCustomerId,
          priceId,
          metadata: { userId },
        });

      // Create domain subscription entity
      const subscription = Subscription.create(
        userId,
        new Price(0), // Price will be determined by Stripe
        Status.active(),
      );
      subscription.setStripeSubscriptionId(stripeSubscriptionId);

      // Persist to repository
      const createdSub = await this.subscriptionRepository.create(subscription);

      return {
        id: createdSub.getId().getValue(),
        userId: createdSub.getUserId(),
        price: parseFloat(createdSub.getPrice().getValue().toString()),
        status: SubscriptionStatus.active,
        createdAt: createdSub.getCreatedAt(),
        updatedAt: createdSub.getUpdatedAt(),
      };
    } catch (error) {
      if (error.name === 'UserNotFoundError') {
        throw error;
      }
      throw new StripeIntegrationError(error.message);
    }
  }
}