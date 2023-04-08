import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { Friend } from 'src/entity/friend.entity';

@Injectable()
export default class FriendRepository extends Repository<Friend> {
  constructor(private readonly dataSource: DataSource) {
    super(Friend, dataSource.createEntityManager());
  }


  // findFriend(column: string, value: any, operator = '='): Promise<Friend | null> {
  //   const query = this.createQueryBuilder('friends')
  //   .subQuery()
  //   .where(
  //     `friends.${column} ${operator} :value`,
  //     {
  //       value: value,
  //     },
  //   );
  //   return query.getOne();
  // }

  findFriends(userId : number) : Promise<Friend[] | null>{
    const query = this.createQueryBuilder('friends')
      .where('friends.source_id = :userId', {userId : userId})
      .orWhere('friends.target_id = :userId', {userId : userId})
      .getMany();
    return query;
  }

}
