import { IUserRepository } from "../../domain/repositories/IUserRepository";

export interface GetAllUsersOutput {
  users: {
    id: number;
    email: string;
    name: string;
  }[];
}

export class GetAllUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<GetAllUsersOutput> {
    const users = await this.userRepository.findAll();

    return {
      users: users.map((user) => user.toObject()),
    };
  }
}
