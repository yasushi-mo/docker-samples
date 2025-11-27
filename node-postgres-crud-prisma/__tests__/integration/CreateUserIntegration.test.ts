import { describe, it, expect, beforeEach } from "vitest";
import { CreateUserUseCase } from "../../src/application/usecases/CreateUserUseCase";
import { InMemoryUserRepository } from "../mocks/InMemoryUserRepository";

describe("CreateUserUseCase 結合テスト", () => {
  let repository: InMemoryUserRepository;
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    useCase = new CreateUserUseCase(repository);
  });

  it("ユーザーを作成できる", async () => {
    // Act
    const result = await useCase.execute({
      email: "test@example.com",
      name: "Test User",
    });

    // Assert
    expect(result.id).toBe(1);
    expect(result.email).toBe("test@example.com");
    expect(result.name).toBe("Test User");

    // リポジトリに保存されているか確認
    const users = await repository.findAll();
    expect(users).toHaveLength(1);
  });

  it("重複したメールアドレスの場合はエラーになる", async () => {
    // Arrange: 1人目を作成
    await useCase.execute({
      email: "test@example.com",
      name: "User 1",
    });

    // Act & Assert: 2人目（同じメールアドレス）でエラー
    await expect(
      useCase.execute({
        email: "test@example.com",
        name: "User 2",
      })
    ).rejects.toThrow("Email already exists");

    // リポジトリには1人だけ
    const users = await repository.findAll();
    expect(users).toHaveLength(1);
  });
});
