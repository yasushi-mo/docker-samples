export class Email {
  private readonly value: string;

  constructor(value: string) {
    if (!value) {
      throw new Error("Email is required");
    }
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
