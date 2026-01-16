import type { Subscription } from "src/types/Subscription";

export class SubscriptionRepository {
  async create(userId: string): Promise<Subscription> {
    throw new Error("Method not implemented.");
  }
} 