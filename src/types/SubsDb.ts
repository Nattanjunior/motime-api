import type { Decimal } from "@prisma/client/runtime/index-browser";
import type { SubscriptionStatus } from "generated/prisma/enums";

export interface SubsDb {
  id: string;
  price: Decimal;
  status: SubscriptionStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}