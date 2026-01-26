import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../../../domain/auth/entities/User';
import { IUserRepository } from '../../../domain/auth/repositories/IUserRepository';
import { UserNotFoundError } from '../../../domain/auth/errors/AuthErrors';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(user: User): Promise<User> {
    const createdUser = await this.prismaService.user.create({
      data: {
        id: user.getId().getValue(),
        name: user.getName(),
        email: user.getEmail().getValue(),
        password: user.getPassword().getValue(),
        phone: user.getPhone().getValue(),
        stripeCustomerId: user.getStripeCustomerId(),
      },
    });

    return User.reconstruct(
      createdUser.id,
      createdUser.name,
      createdUser.email,
      createdUser.password,
      createdUser.phone,
      createdUser.stripeCustomerId,
      createdUser.createdAt,
      createdUser.updatedAt,
    );
  }

  async update(user: User): Promise<User> {
    const updatedUser = await this.prismaService.user.update({
      where: { id: user.getId().getValue() },
      data: {
        name: user.getName(),
        email: user.getEmail().getValue(),
        password: user.getPassword().getValue(),
        phone: user.getPhone().getValue(),
        stripeCustomerId: user.getStripeCustomerId(),
        updatedAt: user.getUpdatedAt(),
      },
    });

    return User.reconstruct(
      updatedUser.id,
      updatedUser.name,
      updatedUser.email,
      updatedUser.password,
      updatedUser.phone,
      updatedUser.stripeCustomerId,
      updatedUser.createdAt,
      updatedUser.updatedAt,
    );
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return User.reconstruct(
      user.id,
      user.name,
      user.email,
      user.password,
      user.phone,
      user.stripeCustomerId,
      user.createdAt,
      user.updatedAt,
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return User.reconstruct(
      user.id,
      user.name,
      user.email,
      user.password,
      user.phone,
      user.stripeCustomerId,
      user.createdAt,
      user.updatedAt,
    );
  }

  async findByStripeCustomerId(stripeCustomerId: string): Promise<User | null> {
    // Note: Prisma unique constraint needs to be updated in schema for this to work
    // For now, we'll query using a findFirst approach
    const user = await this.prismaService.user.findFirst({
      where: { stripeCustomerId },
    });

    if (!user) {
      return null;
    }

    return User.reconstruct(
      user.id,
      user.name,
      user.email,
      user.password,
      user.phone,
      user.stripeCustomerId,
      user.createdAt,
      user.updatedAt,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.user.delete({
      where: { id },
    });
  }

  async findAll(): Promise<User[]> {
    const users = await this.prismaService.user.findMany();

    return users.map((user) =>
      User.reconstruct(
        user.id,
        user.name,
        user.email,
        user.password,
        user.phone,
        user.stripeCustomerId,
        user.createdAt,
        user.updatedAt,
      ),
    );
  }
}
