import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { UserId } from "../../domain/value-objects/UserId";

export interface DeleteUserInput {
  id: number;
}

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: DeleteUserInput): Promise<void> {
    const userId = new UserId(input.id);

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    await this.userRepository.delete(userId);
  }
}
