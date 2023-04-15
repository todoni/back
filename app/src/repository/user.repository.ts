import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { Friend } from 'src/entity/friend.entity';

@Injectable()
export default class UserRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  findUser(userId: number): Promise<User | null> {
    const query = this.createQueryBuilder('users')
      .where('users.id =  :userId', { userId: userId })
      .getOne();
    return query;
  }

  findUserByName(name: string): Promise<User | null> {
    const query = this.createQueryBuilder('users')
      .where('users.name =  :username', { username: name })
      .getOne();
    return query;
  }
}
