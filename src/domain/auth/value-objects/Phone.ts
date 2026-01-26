export class Phone {
  private readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Phone): boolean {
    return this.value === other.getValue();
  }
}
