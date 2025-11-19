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

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// JSONリクエストボディをパースするミドルウェア
app.use(express.json());

// ヘルスチェック用エンドポイント
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

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
