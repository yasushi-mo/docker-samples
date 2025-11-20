export class UserName {
  private readonly value: string;

  constructor(value: string) {
    if (!value) {
      throw new Error("Name is required");
    }
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: UserName): boolean {
    return this.value === other.value;
  }
}
