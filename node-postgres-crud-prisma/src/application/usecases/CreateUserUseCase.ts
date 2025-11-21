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

    // 2. ビジネスルール: メールアドレスの重複チェック
    const exists = await this.userRepository.existsByEmail(email);
    if (exists) {
      throw new Error("Email already exists");
    }

    // 3. エンティティの生成
    const user = User.create(email, name);

    // 4. 永続化
    const savedUser = await this.userRepository.save(user);

    // 5. 結果の返却
    return savedUser.toObject();
  }
}
