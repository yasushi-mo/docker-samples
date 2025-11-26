import { describe, it, expect } from "vitest";
import { Email } from "../../../src/domain/value-objects/Email";

describe("Email", () => {
  describe("constructor", () => {
    it("有効なメールアドレスでインスタンスを作成できる", () => {
      const email = new Email("test@example.com");
      expect(email.getValue()).toBe("test@example.com");
    });

    it("空文字列の場合はエラーをスローする", () => {
      expect(() => new Email("")).toThrow("Email is required");
    });
  });

  describe("equals", () => {
    it("同じ値のEmailオブジェクトはtrueを返す", () => {
      const email1 = new Email("test@example.com");
      const email2 = new Email("test@example.com");
      expect(email1.equals(email2)).toBe(true);
    });

    it("異なる値のEmailオブジェクトはfalseを返す", () => {
      const email1 = new Email("test1@example.com");
      const email2 = new Email("test2@example.com");
      expect(email1.equals(email2)).toBe(false);
    });
  });
});
