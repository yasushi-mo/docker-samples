import { Email } from "../value-objects/Email";
import { UserId } from "../value-objects/UserId";
import { UserName } from "../value-objects/UserName";

export class User {
  private constructor(
    private readonly id: UserId | null,
    private email: Email,
    private name: UserName
  ) {}

  /** ファクトリーメソッド: 新規ユーザー作成（IDなし） */
  static create(email: Email, name: UserName): Omit<User, "id"> {
    return new User(null, email, name);
  }

  /** ファクトリーメソッド: 既存ユーザーの再構築（IDあり） */
  static reconstruct(id: UserId, email: Email, name: UserName): User {
    return new User(id, email, name);
  }

  getId(): UserId | null {
    return this.id;
  }

  getEmail(): Email {
    return this.email;
  }

  getName(): UserName {
    return this.name;
  }

  hasId(): boolean {
    return this.id !== null;
  }

  /** ビジネスロジック: メールアドレス変更 */
  changeEmail(newEmail: Email): void {
    if (this.email.equals(newEmail)) {
      throw new Error("New email is the same as current email");
    }
    this.email = newEmail;
  }

  /** ビジネスロジック: 名前変更 */
  changeName(newName: UserName): void {
    if (this.name.equals(newName)) {
      throw new Error("New name is the same as current name");
    }
    this.name = newName;
  }

  /** プリミティブ型への変換 */
  toObject() {
    if (!this.id) {
      throw new Error("Cannot convert user without ID to object");
    }
    return {
      id: this.id.getValue(),
      email: this.email.getValue(),
      name: this.name.getValue(),
    };
  }
}
