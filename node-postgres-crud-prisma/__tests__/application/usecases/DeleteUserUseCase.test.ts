import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeleteUserUseCase } from "../../../src/application/usecases/DeleteUserUseCase";
import { IUserRepository } from "../../../src/domain/repositories/IUserRepository";
import { User } from "../../../src/domain/entities/User";
import { Email } from "../../../src/domain/value-objects/Email";
import { UserName } from "../../../src/domain/value-objects/UserName";
import { UserId } from "../../../src/domain/value-objects/UserId";

describe("DeleteUserUseCase", () => {
  let mockRepository: IUserRepository;
  let useCase: DeleteUserUseCase;

  beforeEach(() => {
    mockRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      existsByEmail: vi.fn(),
    };

    useCase = new DeleteUserUseCase(mockRepository);
  });

  it("ユーザーを削除できる", async () => {
    // Arrange
    const input = { id: 1 };

    const user = User.reconstruct(
      new UserId(1),
      new Email("test@example.com"),
      new UserName("Test User")
    );

    vi.mocked(mockRepository.findById).mockResolvedValue(user);
    vi.mocked(mockRepository.delete).mockResolvedValue(undefined);

    // Act
    await useCase.execute(input);

    // Assert
    expect(mockRepository.findById).toHaveBeenCalledWith(
      expect.objectContaining({ value: 1 })
    );
    expect(mockRepository.delete).toHaveBeenCalledWith(
      expect.objectContaining({ value: 1 })
    );
  });

  it("存在しないユーザーを削除しようとするとエラーをスローする", async () => {
    // Arrange
    const input = { id: 999 };

    vi.mocked(mockRepository.findById).mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute(input)).rejects.toThrow("User not found");
    expect(mockRepository.delete).not.toHaveBeenCalled();
  });
});
