export class UserId {
  private readonly value: number;

  constructor(value: number) {
    if (value <= 0) {
      throw new Error("User ID must be a positive number");
    }
    this.value = value;
  }

  getValue(): number {
    return this.value;
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }
}
