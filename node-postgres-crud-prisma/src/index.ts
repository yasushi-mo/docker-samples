import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import { validate } from "./middlewares/validate.middleware";
import {
  CreateUserInput,
  createUserSchema,
  UpdateUserInput,
  updateUserSchema,
  UserIdParam,
  userIdSchema,
} from "./schemas/user.schema";
import z from "zod";
import { PrismaUserRepository } from "./infrastructure/prisma/PrismaUserRepository";
import { CreateUserUseCase } from "./application/usecases/CreateUserUseCase";
import { GetUserUseCase } from "./application/usecases/GetUserUseCase";
import { GetAllUsersUseCase } from "./application/usecases/GetAllUsersUseCase";
import { UpdateUserUseCase } from "./application/usecases/UpdateUserUseCase";
import { DeleteUserUseCase } from "./application/usecases/DeleteUserUseCase";
import { UserController } from "./presentation/controllers/UserController";
import { setupUserRoutes } from "./presentation/routes/userRoutes";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// JSONリクエストボディをパースするミドルウェア
app.use(express.json());

// ヘルスチェック用エンドポイント
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

// =====================================
// 依存性注入の設定
// =====================================

// 1. インフラ層: リポジトリの生成
const userRepository = new PrismaUserRepository(prisma);

// 2. アプリケーション層: ユースケースの生成
const createUserUseCase = new CreateUserUseCase(userRepository);
const getUserUseCase = new GetUserUseCase(userRepository);
const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);

// 3. プレゼンテーション層: コントローラーの生成
const userController = new UserController(
  createUserUseCase,
  getUserUseCase,
  getAllUsersUseCase,
  updateUserUseCase,
  deleteUserUseCase
);

// 4. ルーティングの設定
setupUserRoutes(app, userController);

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// アプリケーション終了時にPrisma接続をクリーンアップ
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// ユーザー作成
app.post(
  "/users",
  validate(z.object({ body: createUserSchema })),
  async (req: Request<{}, {}, CreateUserInput>, res: Response) => {
    try {
      const { email, name } = req.body;

      if (!email || !name)
        return res.status(400).json({ error: "Email and name are required" });

      const user = await prisma.user.create({
        data: {
          email,
          name,
        },
      });

      res.status(201).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create user" });
    }
  }
);

// 全ユーザー取得
app.get("/users", async (_: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// 特定ユーザー取得
app.get(
  "/users/:id",
  validate(z.object({ params: userIdSchema })),
  async (req: Request<UserIdParam>, res: Response) => {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
      });

      if (!user) return res.status(404).json({ error: "User not found" });

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  }
);

// ユーザー更新
app.put(
  "/users/:id",
  validate(
    z.object({
      params: userIdSchema,
      body: updateUserSchema,
    })
  ),
  async (req: Request<UserIdParam, {}, UpdateUserInput>, res: Response) => {
    try {
      const { id } = req.params;
      const { email, name } = req.body;

      const user = await prisma.user.update({
        where: { id: Number(id) },
        data: {
          ...(email && { email }),
          ...(name && { name }),
        },
      });

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update user" });
    }
  }
);

// ユーザー削除
app.delete(
  "/users/:id",
  validate(
    z.object({
      params: userIdSchema,
    })
  ),
  async (req: Request<UserIdParam>, res: Response) => {
    try {
      const { id } = req.params;

      await prisma.user.delete({
        where: { id: Number(id) },
      });

      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  }
);
