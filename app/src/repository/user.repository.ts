import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { User } from '@entity/user.entity';
import { UserAccessDto } from '@dto/user/user.dto';

@Injectable()
export default class UserRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findUser(userId: number): Promise<User | null> {
    const query = await this.createQueryBuilder('users')
      .where('users.id = :userId', { userId: userId })
      .getOne();
    return query;
  }

  async findUserByName(name: string): Promise<User | null> {
    const query = await this.createQueryBuilder('users')
      .where('users.name = :username', { username: name })
      .getOne();
    return query;
  }

  async updateFirstAccess(user:User) {
    await this.createQueryBuilder('users')
      .update(user)
      .where('users.id = :id', { id: user.id })
      .execute();
  }
}
