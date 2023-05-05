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

  async followUser(sourceId: number, targetId: number) {
    await this.createQueryBuilder('friends')
      .insert()
      .into(Friend)
      .values({
        sourceId: sourceId,
        targetId: targetId,
      })
      .execute();
  }

  async unFollowUser(sourceId: number, targetId: number) {
    await this.createQueryBuilder('friends')
      .delete()
      .from(Friend)
      .where(
        'friends.source_id = :sourceId and friends.target_id = :targetId',
        {
          sourceId: sourceId,
          targetId: targetId,
        },
      )
      .execute();
  }
}
