import type { SubscriptionRepository } from "src/domain/gateways/stripe/SubscriptionRepository";

export class CreatedSubsUseCase {
  constructor(private subscriptionRepository: SubscriptionRepository) { }

  async execute(userId) {
    await this.subscriptionRepository.create(userId);
  }
}