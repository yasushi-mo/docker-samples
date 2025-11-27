import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateUserUseCase } from "../../../src/application/usecases/UpdateUserUseCase";
import { IUserRepository } from "../../../src/domain/repositories/IUserRepository";
import { User } from "../../../src/domain/entities/User";
import { Email } from "../../../src/domain/value-objects/Email";
import { UserName } from "../../../src/domain/value-objects/UserName";
import { UserId } from "../../../src/domain/value-objects/UserId";

describe("UpdateUserUseCase", () => {
  let mockRepository: IUserRepository;
  let useCase: UpdateUserUseCase;

  beforeEach(() => {
    mockRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      existsByEmail: vi.fn(),
    };

    useCase = new UpdateUserUseCase(mockRepository);
  });

  it("ユーザー情報を更新できる", async () => {
    // Arrange
    const existingUser = User.reconstruct(
      new UserId(1),
      new Email("old@example.com"),
      new UserName("Old Name")
    );

    const input = {
      id: 1,
      email: "new@example.com",
      name: "New Name",
    };

    vi.mocked(mockRepository.findById).mockResolvedValue(existingUser);
    vi.mocked(mockRepository.existsByEmail).mockResolvedValue(false);
    vi.mocked(mockRepository.update).mockResolvedValue(existingUser);

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.email).toBe("new@example.com");
    expect(result.name).toBe("New Name");
    expect(mockRepository.update).toHaveBeenCalledTimes(1);
  });

  it("存在しないユーザーを更新しようとするとエラーをスローする", async () => {
    // Arrange
    const input = {
      id: 999,
      email: "test@example.com",
      name: "Test User",
    };

    vi.mocked(mockRepository.findById).mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute(input)).rejects.toThrow("User not found");
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it("メールアドレスが既に使用されている場合はエラーをスローする", async () => {
    // Arrange
    const existingUser = User.reconstruct(
      new UserId(1),
      new Email("old@example.com"),
      new UserName("Test User")
    );

    const input = {
      id: 1,
      email: "existing@example.com",
      name: "Test User",
    };

    vi.mocked(mockRepository.findById).mockResolvedValue(existingUser);
    vi.mocked(mockRepository.existsByEmail).mockResolvedValue(true);

    // Act & Assert
    await expect(useCase.execute(input)).rejects.toThrow(
      "Email already exists"
    );
    expect(mockRepository.update).not.toHaveBeenCalled();
  });
});
