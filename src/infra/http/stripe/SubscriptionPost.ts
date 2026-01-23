import { Prisma } from 'generated/prisma/browser';
import { SubscriptionStatus } from 'generated/prisma/enums';
import type { SubscriptionRepository } from 'src/domain/gateways/stripe/SubscriptionRepository';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { stripe } from 'src/lib/stripe';

export class SubscriptionPost implements SubscriptionRepository {
  private readonly prisma;

  constructor(private readonly prismaService: PrismaService) {
    this.prisma = prismaService;
  }
  async create(userId: string) {
    try {
      const userEmail = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      const customer = await stripe.customers.create({
        email: userEmail.email,
      });

      await stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            price: process.env.PRICE_ID,
          },
        ],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

    } catch (error) {
      throw new Error('Error creating subscription');
    }
  }
}
