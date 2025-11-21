import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { Email } from "../../domain/value-objects/Email";
import { UserName } from "../../domain/value-objects/UserName";
import { User } from "../../domain/entities/User";

export interface CreateUserInput {
  email: string;
  name: string;
}

export interface CreateUserOutput {
  id: number;
  email: string;
  name: string;
}

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    // 値オブジェクトの生成
    const email = new Email(input.email);
    const name = new UserName(input.name);

    // ビジネスルール: メールアドレスの重複チェック
    const exists = await this.userRepository.existsByEmail(email);
    if (exists) {
      throw new Error("Email already exists");
    }

    // エンティティの生成
    const user = User.create(email, name);

    // データ永続化
    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.getId()!.getValue(),
      email: savedUser.getEmail().getValue(),
      name: savedUser.getName().getValue(),
    };
  }
}
