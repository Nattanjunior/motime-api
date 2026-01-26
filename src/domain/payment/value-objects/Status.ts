export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CANCELLED = 'cancelled',
  PAUSED = 'paused',
}

export class Status {
  private readonly value: SubscriptionStatus;

  constructor(value: SubscriptionStatus | string) {
    if (!Object.values(SubscriptionStatus).includes(value as SubscriptionStatus)) {
      throw new Error(`Invalid subscription status: ${value}`);
    }
    this.value = value as SubscriptionStatus;
  }

  getValue(): SubscriptionStatus {
    return this.value;
  }

  isActive(): boolean {
    return this.value === SubscriptionStatus.ACTIVE;
  }

  isInactive(): boolean {
    return this.value === SubscriptionStatus.INACTIVE;
  }

  equals(other: Status): boolean {
    return this.value === other.getValue();
  }

  static active(): Status {
    return new Status(SubscriptionStatus.ACTIVE);
  }

  static inactive(): Status {
    return new Status(SubscriptionStatus.INACTIVE);
  }

  static cancelled(): Status {
    return new Status(SubscriptionStatus.CANCELLED);
  }

  static paused(): Status {
    return new Status(SubscriptionStatus.PAUSED);
  }
}
