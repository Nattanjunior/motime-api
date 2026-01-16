import type { SubscriptionRepository } from "src/domain/subscription/SubscriptionRepository";
import { PrismaService } from "src/infra/database/prisma/prisma.service";
import { stripe } from "src/lib/stripe";

export class SubscriptionPost implements SubscriptionRepository {
  private readonly prisma;

  constructor(private readonly prismaService: PrismaService) {
    this.prisma = prismaService
  }
  async create(userId: string) {

    try {

      const userEmail = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      })

      const customer = await stripe.customers.create({
        email: userEmail.email
      })

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price: process.env.PRICE_ID,
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      })

      return { subscription }

    } catch (error) {
      throw new Error('Error creating subscription')
    }

  }
}