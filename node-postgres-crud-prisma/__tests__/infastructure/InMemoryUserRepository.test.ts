import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryUserRepository } from "../mocks/InMemoryUserRepository";
import { User } from "../../src/domain/entities/User";
import { Email } from "../../src/domain/value-objects/Email";
import { UserName } from "../../src/domain/value-objects/UserName";
import { UserId } from "../../src/domain/value-objects/UserId";

describe("InMemoryUserRepository", () => {
  let repository: InMemoryUserRepository;

  beforeEach(() => {
    // 各テストの前に新しいリポジトリを作成
    repository = new InMemoryUserRepository();
  });

  describe("save", () => {
    it("ユーザーを保存できる", async () => {
      // Arrange
      const user = User.create(
        new Email("test@example.com"),
        new UserName("Test User")
      );

      // Act
      const savedUser = await repository.save(user);

      // Assert
      expect(savedUser.hasId()).toBe(true);
      expect(savedUser.getId()?.getValue()).toBe(1);
      expect(savedUser.getEmail().getValue()).toBe("test@example.com");
      expect(savedUser.getName().getValue()).toBe("Test User");
    });

    it("複数のユーザーを保存すると異なるIDが割り当てられる", async () => {
      // Arrange
      const user1 = User.create(
        new Email("user1@example.com"),
        new UserName("User 1")
      );
      const user2 = User.create(
        new Email("user2@example.com"),
        new UserName("User 2")
      );

      // Act
      const savedUser1 = await repository.save(user1);
      const savedUser2 = await repository.save(user2);

      // Assert
      expect(savedUser1.getId()?.getValue()).toBe(1);
      expect(savedUser2.getId()?.getValue()).toBe(2);
    });
  });

  describe("findById", () => {
    it("IDでユーザーを取得できる", async () => {
      // Arrange
      const user = User.create(
        new Email("test@example.com"),
        new UserName("Test User")
      );
      const savedUser = await repository.save(user);
      const userId = savedUser.getId()!;

      // Act
      const foundUser = await repository.findById(userId);

      // Assert
      expect(foundUser).not.toBeNull();
      expect(foundUser!.getId()!.getValue()).toBe(userId.getValue());
      expect(foundUser!.getEmail().getValue()).toBe("test@example.com");
    });

    it("存在しないIDの場合はnullを返す", async () => {
      // Arrange
      const userId = new UserId(999);

      // Act
      const foundUser = await repository.findById(userId);

      // Assert
      expect(foundUser).toBeNull();
    });
  });

  describe("findAll", () => {
    it("全てのユーザーを取得できる", async () => {
      // Arrange
      const user1 = User.create(
        new Email("user1@example.com"),
        new UserName("User 1")
      );
      const user2 = User.create(
        new Email("user2@example.com"),
        new UserName("User 2")
      );

      await repository.save(user1);
      await repository.save(user2);

      // Act
      const users = await repository.findAll();

      // Assert
      expect(users).toHaveLength(2);
      expect(users[0].getEmail().getValue()).toBe("user1@example.com");
      expect(users[1].getEmail().getValue()).toBe("user2@example.com");
    });

    it("ユーザーが存在しない場合は空配列を返す", async () => {
      // Act
      const users = await repository.findAll();

      // Assert
      expect(users).toHaveLength(0);
    });
  });

  describe("update", () => {
    it("ユーザー情報を更新できる", async () => {
      // Arrange
      const user = User.create(
        new Email("old@example.com"),
        new UserName("Old Name")
      );
      const savedUser = await repository.save(user);

      // メールアドレスと名前を変更
      savedUser.changeEmail(new Email("new@example.com"));
      savedUser.changeName(new UserName("New Name"));

      // Act
      const updatedUser = await repository.update(savedUser);

      // Assert
      expect(updatedUser.getEmail().getValue()).toBe("new@example.com");
      expect(updatedUser.getName().getValue()).toBe("New Name");

      // 再取得して確認
      const foundUser = await repository.findById(savedUser.getId()!);
      expect(foundUser!.getEmail().getValue()).toBe("new@example.com");
      expect(foundUser!.getName().getValue()).toBe("New Name");
    });

    it("IDがないユーザーの更新はエラーをスローする", async () => {
      // Arrange
      const user = User.create(
        new Email("test@example.com"),
        new UserName("Test User")
      );

      // Act & Assert
      await expect(repository.update(user)).rejects.toThrow(
        "Cannot update user without ID"
      );
    });
  });

  describe("delete", () => {
    it("ユーザーを削除できる", async () => {
      // Arrange
      const user = User.create(
        new Email("test@example.com"),
        new UserName("Test User")
      );
      const savedUser = await repository.save(user);
      const userId = savedUser.getId()!;

      // Act
      await repository.delete(userId);

      // Assert
      const foundUser = await repository.findById(userId);
      expect(foundUser).toBeNull();
    });

    it("存在しないユーザーの削除でもエラーにならない", async () => {
      // Arrange
      const userId = new UserId(999);

      // Act & Assert
      await expect(repository.delete(userId)).resolves.not.toThrow();
    });
  });

  describe("existsByEmail", () => {
    it("メールアドレスが存在する場合はtrueを返す", async () => {
      // Arrange
      const user = User.create(
        new Email("test@example.com"),
        new UserName("Test User")
      );
      await repository.save(user);

      // Act
      const exists = await repository.existsByEmail(
        new Email("test@example.com")
      );

      // Assert
      expect(exists).toBe(true);
    });

    it("メールアドレスが存在しない場合はfalseを返す", async () => {
      // Act
      const exists = await repository.existsByEmail(
        new Email("nonexistent@example.com")
      );

      // Assert
      expect(exists).toBe(false);
    });

    it("複数のユーザーがいても正しく判定できる", async () => {
      // Arrange
      await repository.save(
        User.create(new Email("user1@example.com"), new UserName("User 1"))
      );
      await repository.save(
        User.create(new Email("user2@example.com"), new UserName("User 2"))
      );

      // Act
      const exists1 = await repository.existsByEmail(
        new Email("user1@example.com")
      );
      const exists2 = await repository.existsByEmail(
        new Email("user2@example.com")
      );
      const exists3 = await repository.existsByEmail(
        new Email("user3@example.com")
      );

      // Assert
      expect(exists1).toBe(true);
      expect(exists2).toBe(true);
      expect(exists3).toBe(false);
    });
  });

  describe("clear", () => {
    it("全てのデータをクリアできる", async () => {
      // Arrange
      await repository.save(
        User.create(new Email("user1@example.com"), new UserName("User 1"))
      );
      await repository.save(
        User.create(new Email("user2@example.com"), new UserName("User 2"))
      );

      // Act
      repository.clear();

      // Assert
      const users = await repository.findAll();
      expect(users).toHaveLength(0);
      expect(repository.count()).toBe(0);

      // 次に保存するユーザーのIDは1から始まる
      const newUser = await repository.save(
        User.create(new Email("new@example.com"), new UserName("New User"))
      );
      expect(newUser.getId()?.getValue()).toBe(1);
    });
  });
});
