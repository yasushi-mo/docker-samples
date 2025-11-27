import { beforeEach, describe, expect, it, vi } from "vitest";
import { IUserRepository } from "../../../src/domain/repositories/IUserRepository";
import { CreateUserUseCase } from "../../../src/application/usecases/CreateUserUseCase";
import { User } from "../../../src/domain/entities/User";
import { UserId } from "../../../src/domain/value-objects/UserId";
import { Email } from "../../../src/domain/value-objects/Email";
import { UserName } from "../../../src/domain/value-objects/UserName";

describe("CreateUserUseCase", () => {
  let mockRepository: IUserRepository;
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    // 各テストの前にモックを初期化（前のテストの影響を受けないようにする）
    // vi.fn()で全てのメソッドをモック関数に
    mockRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      existsByEmail: vi.fn(),
    };

    useCase = new CreateUserUseCase(mockRepository);
  });

  it("ユーザーを作成できる", async () => {
    // AAA（Arrange-Act-Assert）パターンでテスト
    // Arrange: テストデータの準備
    const input = {
      email: "test@example.com",
      name: "Test User",
    };

    /** 保存後に返されるユーザー（IDが割り当てられている） */
    const savedUser = User.reconstruct(
      new UserId(1),
      new Email("test@example.com"),
      new UserName("Test User")
    );

    // モックの振る舞いを定義
    vi.mocked(mockRepository.existsByEmail).mockResolvedValue(false);
    vi.mocked(mockRepository.save).mockResolvedValue(savedUser);

    // Act: ユースケースの実行
    const result = await useCase.execute(input);

    // Assert: 結果の検証
    expect(result).toEqual({
      id: 1,
      email: "test@example.com",
      name: "Test User",
    });

    // モックが正しく呼ばれたか検証
    expect(mockRepository.existsByEmail).toHaveBeenCalledTimes(1);
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
  });

  it("メールアドレスが既に存在する場合はエラーをスローする", async () => {
    // Arrange
    const input = {
      email: "existing@example.com",
      name: "Test User",
    };

    // メールアドレスが既に存在する場合
    vi.mocked(mockRepository.existsByEmail).mockResolvedValue(true);

    // Act & Assert
    await expect(useCase.execute(input)).rejects.toThrow(
      "Email already exists"
    );

    // saveは呼ばれないことを検証
    expect(mockRepository.save).not.toHaveBeenCalled();
  });
});
