import { SubscriptionId } from '../value-objects/SubscriptionId';
import { Price } from '../value-objects/Price';
import { Status } from '../value-objects/Status';

export class Subscription {
  private id: SubscriptionId;
  private userId: string;
  private price: Price;
  private status: Status;
  private stripeSubscriptionId: string | null;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    id: SubscriptionId,
    userId: string,
    price: Price,
    status: Status,
    stripeSubscriptionId: string | null = null,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    this.id = id;
    this.userId = userId;
    this.price = price;
    this.status = status;
    this.stripeSubscriptionId = stripeSubscriptionId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  getId(): SubscriptionId {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getPrice(): Price {
    return this.price;
  }

  getStatus(): Status {
    return this.status;
  }

  getStripeSubscriptionId(): string | null {
    return this.stripeSubscriptionId;
  }

  setStripeSubscriptionId(id: string): void {
    this.stripeSubscriptionId = id;
    this.updatedAt = new Date();
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  updateStatus(newStatus: Status): void {
    this.status = newStatus;
    this.updatedAt = new Date();
  }

  updatePrice(newPrice: Price): void {
    this.price = newPrice;
    this.updatedAt = new Date();
  }

  isActive(): boolean {
    return this.status.isActive();
  }

  activate(): void {
    this.status = Status.active();
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.status = Status.inactive();
    this.updatedAt = new Date();
  }

  cancel(): void {
    this.status = Status.cancelled();
    this.updatedAt = new Date();
  }

  pause(): void {
    this.status = Status.paused();
    this.updatedAt = new Date();
  }

  static create(userId: string, price: Price, status: Status): Subscription {
    return new Subscription(SubscriptionId.create(), userId, price, status);
  }

  static reconstruct(
    id: string,
    userId: string,
    price: string | number,
    status: string,
    stripeSubscriptionId: string | null,
    createdAt: Date,
    updatedAt: Date,
  ): Subscription {
    return new Subscription(
      new SubscriptionId(id),
      userId,
      new Price(price),
      new Status(status),
      stripeSubscriptionId,
      createdAt,
      updatedAt,
    );
  }
}
