import { User } from '../entities/User';

export abstract class IUserRepository {
  abstract create(user: User): Promise<User>;
  abstract update(user: User): Promise<User>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByStripeCustomerId(stripeCustomerId: string): Promise<User | null>;
  abstract delete(id: string): Promise<void>;
  abstract findAll(): Promise<User[]>;
}
