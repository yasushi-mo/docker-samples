import { describe, expect, it } from "vitest";
import { UserId } from "../../../src/domain/value-objects/UserId";

describe("UserId", () => {
  describe("constructor", () => {
    it("有効なユーザーIDでインスタンスを作成できる", () => {
      const id = new UserId(1);
      expect(id.getValue()).toBe(1);
    });

    it("0の場合はエラーをスローする", () => {
      expect(() => new UserId(0)).toThrow("User ID must be a positive number");
    });
  });

  describe("equals", () => {
    it("同じ値のUserIdオブジェクトはtrueを返す", () => {
      const id1 = new UserId(1);
      const id2 = new UserId(1);
      expect(id1.equals(id2)).toBe(true);
    });

    it("異なる値のUserIdオブジェクトはfalseを返す", () => {
      const id1 = new UserId(1);
      const id2 = new UserId(2);
      expect(id1.equals(id2)).toBe(false);
    });
  });
});
