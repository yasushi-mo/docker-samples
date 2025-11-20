import { User } from "../entities/User";
import { Email } from "../value-objects/Email";
import { UserId } from "../value-objects/UserId";

export interface IUserRepository {
  save(user: User): Promise<User>;
  findById(id: UserId): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(user: User): Promise<User>;
  delete(id: UserId): Promise<void>;
  existsByEmail(email: Email): Promise<boolean>;
}
