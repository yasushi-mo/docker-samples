import express, { Request, Response } from "express";
import z from "zod";
import { validate } from "../../middlewares/validate.middleware";
import {
  CreateUserInput,
  createUserSchema,
  UpdateUserInput,
  updateUserSchema,
  UserIdParam,
  userIdSchema,
} from "../../schemas/user.schema";
import { UserController } from "../controllers/UserController";

export function setupUserRoutes(
  router: express.Router,
  userController: UserController
) {
  // ユーザー作成
  router.post(
    "/users",
    validate(z.object({ body: createUserSchema })),
    (req: Request<{}, {}, CreateUserInput>, res: Response) =>
      userController.create(req, res)
  );

  // 全ユーザー取得
  router.get("/users", (req: Request, res: Response) =>
    userController.getAll(req, res)
  );

  // 特定ユーザー取得
  router.get(
    "/users/:id",
    validate(z.object({ params: userIdSchema })),
    (req: Request<UserIdParam>, res: Response) =>
      userController.getById(req, res)
  );

  // ユーザー更新
  router.put(
    "/users/:id",
    validate(
      z.object({
        params: userIdSchema,
        body: updateUserSchema,
      })
    ),
    (req: Request<UserIdParam, {}, UpdateUserInput>, res: Response) =>
      userController.update(req, res)
  );

  // ユーザー削除
  router.delete(
    "/users/:id",
    validate(z.object({ params: userIdSchema })),
    (req: Request<UserIdParam>, res: Response) =>
      userController.delete(req, res)
  );
}
