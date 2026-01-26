import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Subscription } from '../../../domain/payment/entities/Subscription';
import { ISubscriptionRepository } from '../../../domain/payment/repositories/ISubscriptionRepository';

@Injectable()
export class SubscriptionRepository implements ISubscriptionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(subscription: Subscription): Promise<Subscription> {
    const createdSub = await this.prismaService.subscriptions.create({
      data: {
        id: subscription.getId().getValue(),
        userId: subscription.getUserId(),
        price: parseFloat(subscription.getPrice().getValue().toString()),
        status: subscription.getStatus().getValue() as any,
      },
    });

    return Subscription.reconstruct(
      createdSub.id,
      createdSub.userId,
      createdSub.price.toString(),
      createdSub.status,
      null,
      createdSub.createdAt,
      createdSub.updatedAt,
    );
  }

  async update(subscription: Subscription): Promise<Subscription> {
    const updatedSub = await this.prismaService.subscriptions.update({
      where: { id: subscription.getId().getValue() },
      data: {
        price: parseFloat(subscription.getPrice().getValue().toString()),
        status: subscription.getStatus().getValue() as any,
        updatedAt: subscription.getUpdatedAt(),
      },
    });

    return Subscription.reconstruct(
      updatedSub.id,
      updatedSub.userId,
      updatedSub.price.toString(),
      updatedSub.status,
      null,
      updatedSub.createdAt,
      updatedSub.updatedAt,
    );
  }

  async findById(id: string): Promise<Subscription | null> {
    const subscription = await this.prismaService.subscriptions.findUnique({
      where: { id },
    });

    if (!subscription) {
      return null;
    }

    return Subscription.reconstruct(
      subscription.id,
      subscription.userId,
      subscription.price.toString(),
      subscription.status,
      null,
      subscription.createdAt,
      subscription.updatedAt,
    );
  }

  async findByUserId(userId: string): Promise<Subscription[]> {
    const subscriptions = await this.prismaService.subscriptions.findMany({
      where: { userId },
    });

    return subscriptions.map((sub) =>
      Subscription.reconstruct(
        sub.id,
        sub.userId,
        sub.price.toString(),
        sub.status,
        null,
        sub.createdAt,
        sub.updatedAt,
      ),
    );
  }

  async findByStripeSubscriptionId(
    stripeSubscriptionId: string,
  ): Promise<Subscription | null> {
    const subscription = await this.prismaService.subscriptions.findFirst({
      where: {
        // Additional field to store stripe subscription ID would be needed
      },
    });

    if (!subscription) {
      return null;
    }

    return Subscription.reconstruct(
      subscription.id,
      subscription.userId,
      subscription.price.toString(),
      subscription.status,
      null,
      subscription.createdAt,
      subscription.updatedAt,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.subscriptions.delete({
      where: { id },
    });
  }

  async findAll(): Promise<Subscription[]> {
    const subscriptions = await this.prismaService.subscriptions.findMany();

    return subscriptions.map((sub) =>
      Subscription.reconstruct(
        sub.id,
        sub.userId,
        sub.price.toString(),
        sub.status,
        null,
        sub.createdAt,
        sub.updatedAt,
      ),
    );
  }
}
