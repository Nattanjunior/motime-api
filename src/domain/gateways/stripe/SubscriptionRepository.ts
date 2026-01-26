import type { Subscription } from 'src/types/Subscription';
import type { SubsDb } from 'src/types/SubsDb';

export class SubscriptionRepository {
  async create(userId: string, priceId: string): Promise<SubsDb> {
    throw new Error('Method not implemented.');
  }
}

