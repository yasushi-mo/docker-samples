import { IUserRepository } from "../../src/domain/repositories/IUserRepository";
import { User } from "../../src/domain/entities/User";
import { UserId } from "../../src/domain/value-objects/UserId";
import { Email } from "../../src/domain/value-objects/Email";

export class InMemoryUserRepository implements IUserRepository {
  private users: Map<number, User> = new Map();
  private nextId = 1;

  async save(user: User): Promise<User> {
    // 新しいIDを割り当て
    const id = new UserId(this.nextId++);

    // IDを持つユーザーを再構築
    const savedUser = User.reconstruct(id, user.getEmail(), user.getName());

    // Mapに保存
    this.users.set(id.getValue(), savedUser);

    return savedUser;
  }

  async findById(id: UserId): Promise<User | null> {
    // Mapから取得
    return this.users.get(id.getValue()) || null;
  }

  async findAll(): Promise<User[]> {
    // Mapの全ての値を配列で返す
    return Array.from(this.users.values());
  }

  async update(user: User): Promise<User> {
    const userId = user.getId();
    if (!userId) {
      throw new Error("Cannot update user without ID");
    }

    // Mapを更新
    this.users.set(userId.getValue(), user);

    return user;
  }

  async delete(id: UserId): Promise<void> {
    // Mapから削除
    this.users.delete(id.getValue());
  }

  async existsByEmail(email: Email): Promise<boolean> {
    // 全ユーザーを走査してメールアドレスをチェック
    for (const user of this.users.values()) {
      if (user.getEmail().equals(email)) {
        return true;
      }
    }
    return false;
  }

  // テスト用のヘルパーメソッド
  clear(): void {
    this.users.clear();
    this.nextId = 1;
  }

  // テスト用: 現在のユーザー数を取得
  count(): number {
    return this.users.size;
  }
}
