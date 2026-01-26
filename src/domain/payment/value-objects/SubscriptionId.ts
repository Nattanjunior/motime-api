export class SubscriptionId {
  private readonly value: string;

  constructor(value: string) {
    if (!value) {
      throw new Error('SubscriptionId cannot be empty');
    }
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: SubscriptionId): boolean {
    return this.value === other.getValue();
  }

  static create(): SubscriptionId {
    return new SubscriptionId(this.generateUUID());
  }

  private static generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
