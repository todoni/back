import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';

@Injectable()
export default class UserRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  // findUser(column: string, value: any, operator = '='): Promise<User | null> {
  //   const query = this.createQueryBuilder('users').where(
  //     `users.${column} ${operator} :value`,
  //     {
  //       value: value,
  //     },
  //   );
  //   return query.getOne();
  // }
}
