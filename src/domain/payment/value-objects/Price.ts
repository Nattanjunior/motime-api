export class Price {
  private readonly value: number | string;

  constructor(value: number | string) {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (numValue < 0) {
      throw new Error('Price cannot be negative');
    }
    this.value = numValue;
  }

  getValue(): number | string {
    return this.value;
  }

  equals(other: Price): boolean {
    return parseFloat(this.value.toString()) === parseFloat(other.getValue().toString());
  }

  getFormattedValue(): string {
    return parseFloat(this.value.toString()).toFixed(2);
  }
}
