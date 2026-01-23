import { SubscriptionStatus } from '../types';

export class SubscriptionResponseDto {
  id: string;
  status: SubscriptionStatus;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}
