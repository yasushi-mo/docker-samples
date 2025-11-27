import { describe, it, expect } from "vitest";
import { UserName } from "../../../src/domain/value-objects/UserName";

describe("UserName", () => {
  describe("constructor", () => {
    it("有効な名前でインスタンスを作成できる", () => {
      const name = new UserName("John Doe");
      expect(name.getValue()).toBe("John Doe");
    });

    it("空文字列の場合はエラーをスローする", () => {
      expect(() => new UserName("")).toThrow("Name is required");
    });
  });

  describe("equals", () => {
    it("同じ値のUserNameオブジェクトはtrueを返す", () => {
      const name1 = new UserName("John Doe");
      const name2 = new UserName("John Doe");
      expect(name1.equals(name2)).toBe(true);
    });

    it("異なる値のUserNameオブジェクトはfalseを返す", () => {
      const name1 = new UserName("John Doe");
      const name2 = new UserName("Jane Doe");
      expect(name1.equals(name2)).toBe(false);
    });
  });
});
