import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetUserUseCase } from "../../../src/application/usecases/GetUserUseCase";
import { IUserRepository } from "../../../src/domain/repositories/IUserRepository";
import { User } from "../../../src/domain/entities/User";
import { Email } from "../../../src/domain/value-objects/Email";
import { UserName } from "../../../src/domain/value-objects/UserName";
import { UserId } from "../../../src/domain/value-objects/UserId";

describe("GetUserUseCase", () => {
  let mockRepository: IUserRepository;
  let useCase: GetUserUseCase;

  beforeEach(() => {
    mockRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      existsByEmail: vi.fn(),
    };

    useCase = new GetUserUseCase(mockRepository);
  });

  it("ユーザーを取得できる", async () => {
    // Arrange
    const input = { id: 1 };

    const user = User.reconstruct(
      new UserId(1),
      new Email("test@example.com"),
      new UserName("Test User")
    );

    vi.mocked(mockRepository.findById).mockResolvedValue(user);

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result).toEqual({
      id: 1,
      email: "test@example.com",
      name: "Test User",
    });
    expect(mockRepository.findById).toHaveBeenCalledWith(
      expect.objectContaining({ value: 1 })
    );
  });

  it("ユーザーが存在しない場合はnullを返す", async () => {
    // Arrange
    const input = { id: 999 };

    vi.mocked(mockRepository.findById).mockResolvedValue(null);

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result).toBeNull();
  });
});
