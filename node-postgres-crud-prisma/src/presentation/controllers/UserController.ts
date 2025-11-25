import { Request, Response } from "express";
import { CreateUserUseCase } from "../../application/usecases/CreateUserUseCase";
import { DeleteUserUseCase } from "../../application/usecases/DeleteUserUseCase";
import { GetAllUsersUseCase } from "../../application/usecases/GetAllUsersUseCase";
import { GetUserUseCase } from "../../application/usecases/GetUserUseCase";
import { UpdateUserUseCase } from "../../application/usecases/UpdateUserUseCase";
import {
  CreateUserInput,
  UpdateUserInput,
  UserIdParam,
} from "../../schemas/user.schema";

export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase
  ) {}

  async create(
    req: Request<{}, {}, CreateUserInput>,
    res: Response
  ): Promise<void> {
    try {
      const { email, name } = req.body;
      const result = await this.createUserUseCase.execute({ email, name });
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      }

      res.status(500).json({ error: "Failed to create user" });
    }
  }

  async getAll(_: Request, res: Response): Promise<void> {
    try {
      const result = await this.getAllUsersUseCase.execute();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  }

  async getById(req: Request<UserIdParam>, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.getUserUseCase.execute({ id: Number(id) });

      if (!result) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      }

      res.status(500).json({ error: "Failed to fetch user" });
    }
  }

  async update(
    req: Request<UserIdParam, {}, UpdateUserInput>,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { email, name } = req.body;
      const result = await this.updateUserUseCase.execute({
        id: Number(id),
        email,
        name,
      });
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      }

      res.status(500).json({ error: "Failed to update user" });
    }
  }

  async delete(req: Request<UserIdParam>, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteUserUseCase.execute({ id: Number(id) });
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      }

      res.status(500).json({ error: "Failed to delete user" });
    }
  }
}
