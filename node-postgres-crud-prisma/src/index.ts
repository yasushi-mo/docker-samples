import { PrismaClient } from "@prisma/client";
import express from "express";
import { PrismaUserRepository } from "./infrastructure/prisma/PrismaUserRepository";
import { CreateUserUseCase } from "./application/usecases/CreateUserUseCase";
import { GetUserUseCase } from "./application/usecases/GetUserUseCase";
import { GetAllUsersUseCase } from "./application/usecases/GetAllUsersUseCase";
import { UpdateUserUseCase } from "./application/usecases/UpdateUserUseCase";
import { DeleteUserUseCase } from "./application/usecases/DeleteUserUseCase";
import { UserController } from "./presentation/controllers/UserController";
import { setupUserRoutes } from "./presentation/routes/UserRoutes";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// JSONリクエストボディをパースするミドルウェア
app.use(express.json());

// ヘルスチェック用エンドポイント
app.get("/", (_, res) => {
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
