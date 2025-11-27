import { describe, it, expect } from "vitest";
import { User } from "../../../src/domain/entities/User";
import { Email } from "../../../src/domain/value-objects/Email";
import { UserName } from "../../../src/domain/value-objects/UserName";
import { UserId } from "../../../src/domain/value-objects/UserId";

describe("User", () => {
  describe("create", () => {
    it("新規ユーザーを作成できる", () => {
      const email = new Email("test@example.com");
      const name = new UserName("Test User");

      const user = User.create(email, name);

      expect(user.getEmail().getValue()).toBe("test@example.com");
      expect(user.getName().getValue()).toBe("Test User");
      expect(user.hasId()).toBe(false);
    });
  });

  describe("reconstruct", () => {
    it("既存ユーザーを再構築できる", () => {
      const id = new UserId(1);
      const email = new Email("test@example.com");
      const name = new UserName("Test User");

      const user = User.reconstruct(id, email, name);

      expect(user.getId()?.getValue()).toBe(1);
      expect(user.getEmail().getValue()).toBe("test@example.com");
      expect(user.getName().getValue()).toBe("Test User");
      expect(user.hasId()).toBe(true);
    });
  });

  describe("changeEmail", () => {
    it("メールアドレスを変更できる", () => {
      const id = new UserId(1);
      const email = new Email("old@example.com");
      const name = new UserName("Test User");
      const user = User.reconstruct(id, email, name);

      const newEmail = new Email("new@example.com");
      user.changeEmail(newEmail);

      expect(user.getEmail().getValue()).toBe("new@example.com");
    });

    it("同じメールアドレスへの変更はエラーをスローする", () => {
      const id = new UserId(1);
      const email = new Email("test@example.com");
      const name = new UserName("Test User");
      const user = User.reconstruct(id, email, name);

      const sameEmail = new Email("test@example.com");
      expect(() => user.changeEmail(sameEmail)).toThrow(
        "New email is the same as current email"
      );
    });
  });

  describe("changeName", () => {
    it("名前を変更できる", () => {
      const id = new UserId(1);
      const email = new Email("test@example.com");
      const name = new UserName("Old Name");
      const user = User.reconstruct(id, email, name);

      const newName = new UserName("New Name");
      user.changeName(newName);

      expect(user.getName().getValue()).toBe("New Name");
    });

    it("同じ名前への変更はエラーをスローする", () => {
      const id = new UserId(1);
      const email = new Email("test@example.com");
      const name = new UserName("Test User");
      const user = User.reconstruct(id, email, name);

      const sameName = new UserName("Test User");
      expect(() => user.changeName(sameName)).toThrow(
        "New name is the same as current name"
      );
    });
  });

  describe("toObject", () => {
    it("プリミティブ型に変換できる", () => {
      const id = new UserId(1);
      const email = new Email("test@example.com");
      const name = new UserName("Test User");
      const user = User.reconstruct(id, email, name);

      const obj = user.toObject();

      expect(obj).toEqual({
        id: 1,
        email: "test@example.com",
        name: "Test User",
      });
    });

    it("IDがない場合はエラーをスローする", () => {
      const email = new Email("test@example.com");
      const name = new UserName("Test User");
      const user = User.create(email, name);

      expect(() => user.toObject()).toThrow(
        "Cannot convert user without ID to object"
      );
    });
  });
});
