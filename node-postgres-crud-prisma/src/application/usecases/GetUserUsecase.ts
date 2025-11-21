import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { UserId } from "../../domain/value-objects/UserId";

export interface GetUserInput {
  id: number;
}

export interface GetUserOutput {
  id: number;
  email: string;
  name: string;
}

export class GetUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: GetUserInput): Promise<GetUserOutput | null> {
    const userId = new UserId(input.id);
    const user = await this.userRepository.findById(userId);

    if (!user) return null;

    return user.toObject();
  }
}
