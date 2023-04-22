import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Friend } from '@entity/friend.entity';

@Injectable()
export default class FriendRepository extends Repository<Friend> {
  constructor(private readonly dataSource: DataSource) {
    super(Friend, dataSource.createEntityManager());
  }

  async findFriends(userId: number): Promise<Friend[]> {
    const query = await this.createQueryBuilder('friends')
      .where('friends.source_id = :userId', { userId: userId })
      .getMany();
    return query;
  }
}
