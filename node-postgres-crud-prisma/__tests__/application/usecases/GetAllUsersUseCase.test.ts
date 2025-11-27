import { beforeEach, describe, expect, it, vi } from "vitest";
import { IUserRepository } from "../../../src/domain/repositories/IUserRepository";
import { GetAllUsersUseCase } from "../../../src/application/usecases/GetAllUsersUseCase";
import { User } from "../../../src/domain/entities/User";
import { UserId } from "../../../src/domain/value-objects/UserId";
import { Email } from "../../../src/domain/value-objects/Email";
import { UserName } from "../../../src/domain/value-objects/UserName";

describe("GetAllUsersUseCase", () => {
  let mockRepository: IUserRepository;
  let useCase: GetAllUsersUseCase;

  beforeEach(() => {
    mockRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      existsByEmail: vi.fn(),
    };

    useCase = new GetAllUsersUseCase(mockRepository);
  });

  it("ユーザーを取得できる", async () => {
    // Arrange: テストデータの準備
    const users = [
      {
        id: 1,
        email: "test@example.com",
        name: "Test User",
      },
      {
        id: 2,
        email: "test2@example.com",
        name: "Test User2",
      },
    ].map((user) =>
      User.reconstruct(
        new UserId(user.id),
        new Email(user.email),
        new UserName(user.name)
      )
    );

    vi.mocked(mockRepository.findAll).mockResolvedValue(users);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toEqual({
      users: [
        {
          id: 1,
          email: "test@example.com",
          name: "Test User",
        },
        {
          id: 2,
          email: "test2@example.com",
          name: "Test User2",
        },
      ],
    });
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
