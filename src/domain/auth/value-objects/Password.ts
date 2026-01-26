export class Password {
  private readonly value: string;

  constructor(value: string) {
    if (!this.isStrongPassword(value)) {
      throw new Error('Password must be at least 6 characters');
    }
    this.value = value;
  }

  private isStrongPassword(password: string): boolean {
    return password.length >= 6;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Password): boolean {
    return this.value === other.getValue();
  }
}
