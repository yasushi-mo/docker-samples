import { PrismaClient } from "@prisma/client";
import express from "express";

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
