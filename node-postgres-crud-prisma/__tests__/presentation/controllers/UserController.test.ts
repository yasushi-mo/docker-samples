import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserController } from "../../../src/presentation/controllers/UserController";
import { CreateUserUseCase } from "../../../src/application/usecases/CreateUserUseCase";
import { GetUserUseCase } from "../../../src/application/usecases/GetUserUseCase";
import { GetAllUsersUseCase } from "../../../src/application/usecases/GetAllUsersUseCase";
import { UpdateUserUseCase } from "../../../src/application/usecases/UpdateUserUseCase";
import { DeleteUserUseCase } from "../../../src/application/usecases/DeleteUserUseCase";
import { Request, Response } from "express";
import {
  CreateUserInput,
  UpdateUserInput,
  UserIdParam,
} from "../../../src/schemas/user.schema";

describe("UserController", () => {
  let mockCreateUserUseCase: CreateUserUseCase;
  let mockGetUserUseCase: GetUserUseCase;
  let mockGetAllUsersUseCase: GetAllUsersUseCase;
  let mockUpdateUserUseCase: UpdateUserUseCase;
  let mockDeleteUserUseCase: DeleteUserUseCase;

  let controller: UserController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    // モックユースケースの作成
    mockCreateUserUseCase = {
      execute: vi.fn(),
    } as unknown as CreateUserUseCase;

    mockGetUserUseCase = {
      execute: vi.fn(),
    } as unknown as GetUserUseCase;

    mockGetAllUsersUseCase = {
      execute: vi.fn(),
    } as unknown as GetAllUsersUseCase;

    mockUpdateUserUseCase = {
      execute: vi.fn(),
    } as unknown as UpdateUserUseCase;

    mockDeleteUserUseCase = {
      execute: vi.fn(),
    } as unknown as DeleteUserUseCase;

    // コントローラーの作成
    controller = new UserController(
      mockCreateUserUseCase,
      mockGetUserUseCase,
      mockGetAllUsersUseCase,
      mockUpdateUserUseCase,
      mockDeleteUserUseCase
    );
  });

  describe("create", () => {
    it("ユーザーを作成して201を返す", async () => {
      // Arrange
      const mockRequest = {
        body: {
          email: "test@example.com",
          name: "Test User",
        },
      } as Request<{}, {}, CreateUserInput>;

      const mockResponse = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
      } as unknown as Response;

      vi.mocked(mockCreateUserUseCase.execute).mockResolvedValue({
        id: 1,
        email: "test@example.com",
        name: "Test User",
      });

      // Act
      await controller.create(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        id: 1,
        email: "test@example.com",
        name: "Test User",
      });
    });

    it("ユースケースがエラーをスローした場合は400を返す", async () => {
      // Arrange
      const mockRequest = {
        body: {
          email: "test@example.com",
          name: "Test User",
        },
      } as Request<{}, {}, CreateUserInput>;

      const mockResponse = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
      } as unknown as Response;

      vi.mocked(mockCreateUserUseCase.execute).mockRejectedValue(
        new Error("Email already exists")
      );

      // Act
      await controller.create(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Email already exists",
      });
    });

    it("予期しないエラーの場合は500を返す", async () => {
      // Arrange
      const mockRequest = {
        body: {
          email: "test@example.com",
          name: "Test User",
        },
      } as Request<{}, {}, CreateUserInput>;

      const mockResponse = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
      } as unknown as Response;

      vi.mocked(mockCreateUserUseCase.execute).mockRejectedValue(
        "Unknown error"
      );

      // Act
      await controller.create(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Failed to create user",
      });
    });
  });

  describe("getAll", () => {
    it("全てのユーザーを取得して200を返す", async () => {
      // Arrange
      const mockRequest = {} as Request;

      const mockResponse = {
        json: vi.fn(),
      } as unknown as Response;

      vi.mocked(mockGetAllUsersUseCase.execute).mockResolvedValue({
        users: [
          { id: 1, email: "user1@example.com", name: "User 1" },
          { id: 2, email: "user2@example.com", name: "User 2" },
        ],
      });

      // Act
      await controller.getAll(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith({
        users: [
          { id: 1, email: "user1@example.com", name: "User 1" },
          { id: 2, email: "user2@example.com", name: "User 2" },
        ],
      });
    });

    it("ユーザーが存在しない場合は空配列を返す", async () => {
      // Arrange
      const mockRequest = {} as Request;

      const mockResponse = {
        json: vi.fn(),
      } as unknown as Response;

      vi.mocked(mockGetAllUsersUseCase.execute).mockResolvedValue({
        users: [],
      });

      // Act
      await controller.getAll(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith({
        users: [],
      });
    });
  });

  describe("getById", () => {
    it("ユーザーが存在する場合は200を返す", async () => {
      // Arrange
      const mockRequest = {
        params: { id: "1" },
      } as Request<UserIdParam>;

      const mockResponse = {
        json: vi.fn(),
      } as unknown as Response;

      vi.mocked(mockGetUserUseCase.execute).mockResolvedValue({
        id: 1,
        email: "test@example.com",
        name: "Test User",
      });

      // Act
      await controller.getById(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith({
        id: 1,
        email: "test@example.com",
        name: "Test User",
      });
      // status(200)は明示的に呼ばれないため、検証しない
    });

    it("ユーザーが存在しない場合は404を返す", async () => {
      // Arrange
      const mockRequest = {
        params: { id: "999" },
      } as Request<UserIdParam>;

      const mockResponse = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      vi.mocked(mockGetUserUseCase.execute).mockResolvedValue(null);

      // Act
      await controller.getById(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "User not found",
      });
    });

    it("ユースケースがエラーをスローした場合は400を返す", async () => {
      // Arrange
      const mockRequest = {
        params: { id: "invalid" },
      } as Request<UserIdParam>;

      const mockResponse = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      vi.mocked(mockGetUserUseCase.execute).mockRejectedValue(
        new Error("User ID must be a positive number")
      );

      // Act
      await controller.getById(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "User ID must be a positive number",
      });
    });
  });

  describe("update", () => {
    it("ユーザー情報を更新して200を返す", async () => {
      // Arrange
      const mockRequest = {
        params: { id: "1" },
        body: {
          email: "new@example.com",
          name: "New Name",
        },
      } as Request<UserIdParam, {}, UpdateUserInput>;

      const mockResponse = {
        json: vi.fn(),
      } as unknown as Response;

      vi.mocked(mockUpdateUserUseCase.execute).mockResolvedValue({
        id: 1,
        email: "new@example.com",
        name: "New Name",
      });

      // Act
      await controller.update(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith({
        id: 1,
        email: "new@example.com",
        name: "New Name",
      });
    });

    it("ユーザーが存在しない場合は400を返す", async () => {
      // Arrange
      const mockRequest = {
        params: { id: "999" },
        body: {
          email: "test@example.com",
          name: "Test User",
        },
      } as Request<UserIdParam, {}, UpdateUserInput>;

      const mockResponse = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      vi.mocked(mockUpdateUserUseCase.execute).mockRejectedValue(
        new Error("User not found")
      );

      // Act
      await controller.update(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "User not found",
      });
    });
  });

  describe("delete", () => {
    it("ユーザーを削除して204を返す", async () => {
      // Arrange
      const mockRequest = {
        params: { id: "1" },
      } as Request<UserIdParam>;

      const mockResponse = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      } as unknown as Response;

      vi.mocked(mockDeleteUserUseCase.execute).mockResolvedValue(undefined);

      // Act
      await controller.delete(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it("ユーザーが存在しない場合は400を返す", async () => {
      // Arrange
      const mockRequest = {
        params: { id: "999" },
      } as Request<UserIdParam>;

      const mockResponse = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      vi.mocked(mockDeleteUserUseCase.execute).mockRejectedValue(
        new Error("User not found")
      );

      // Act
      await controller.delete(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "User not found",
      });
    });
  });
});
