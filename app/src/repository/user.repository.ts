import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { Friend } from 'src/entity/friend.entity';
import { UserAccessDto } from '@dto/user/user.dto';

@Injectable()
export default class UserRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  findUser(userId: number): Promise<User | null> {
    const query = this.createQueryBuilder('users')
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

  async updateFirstAccess(userId: number, userAccessDto: UserAccessDto) {
    await this.createQueryBuilder('users')
      .update(userAccessDto)
      .where('users.id = :id', { id: userId })
      .execute();
  }
}
