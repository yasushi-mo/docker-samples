import { PrismaClient } from "@prisma/client";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { UserId } from "../../domain/value-objects/UserId";
import { Email } from "../../domain/value-objects/Email";
import { UserName } from "../../domain/value-objects/UserName";

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(user: User): Promise<User> {
    const data = await this.prisma.user.create({
      data: {
        email: user.getEmail().getValue(),
        name: user.getName().getValue(),
      },
    });

    return User.reconstruct(
      new UserId(data.id),
      new Email(data.email),
      new UserName(data.name)
    );
  }

  async findById(id: UserId): Promise<User | null> {
    const data = await this.prisma.user.findUnique({
      where: { id: id.getValue() },
    });

    if (!data) {
      return null;
    }

    return User.reconstruct(
      new UserId(data.id),
      new Email(data.email),
      new UserName(data.name)
    );
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();

    return users.map((data) =>
      User.reconstruct(
        new UserId(data.id),
        new Email(data.email),
        new UserName(data.name)
      )
    );
  }

  async update(user: User): Promise<User> {
    const userId = user.getId();
    if (!userId) {
      throw new Error("Cannot update user without ID");
    }

    const data = await this.prisma.user.update({
      where: { id: userId.getValue() },
      data: {
        email: user.getEmail().getValue(),
        name: user.getName().getValue(),
      },
    });

    return User.reconstruct(
      new UserId(data.id),
      new Email(data.email),
      new UserName(data.name)
    );
  }

  async delete(id: UserId): Promise<void> {
    await this.prisma.user.delete({
      where: { id: id.getValue() },
    });
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email: email.getValue() },
    });

    return count > 0;
  }
}
