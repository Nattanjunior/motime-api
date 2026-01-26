export class UserId {
  private readonly value: string;

  constructor(value: string) {
    if (!value) {
      throw new Error('UserId cannot be empty');
    }
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: UserId): boolean {
    return this.value === other.getValue();
  }

  static create(): UserId {
    return new UserId(this.generateUUID());
  }

  private static generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
