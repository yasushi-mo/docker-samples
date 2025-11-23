import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { Email } from "../../domain/value-objects/Email";
import { UserId } from "../../domain/value-objects/UserId";
import { UserName } from "../../domain/value-objects/UserName";

export interface UpdateUserInput {
  id: number;
  email?: string;
  name?: string;
}

export interface UpdateUserOutput {
  id: number;
  email: string;
  name: string;
}

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: UpdateUserInput): Promise<UpdateUserOutput> {
    const userId = new UserId(input.id);

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (input.email) {
      const newEmail = new Email(input.email);
      const exists = await this.userRepository.existsByEmail(newEmail);
      if (exists && !user.getEmail().equals(newEmail)) {
        throw new Error("Email already exists");
      }
      user.changeEmail(newEmail);
    }

    if (input.name) {
      const newName = new UserName(input.name);
      user.changeName(newName);
    }

    const updatedUser = await this.userRepository.update(user);

    return updatedUser.toObject();
  }
}
