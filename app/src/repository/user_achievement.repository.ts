import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { UserAchievement } from '@entity/user_achievement';

@Injectable()
export default class UserAchievementRepository extends Repository<UserAchievement> {
  constructor(private readonly dataSource: DataSource) {
    super(UserAchievement, dataSource.createEntityManager());
  }

  async findUserAchievement(userId: number): Promise<UserAchievement[]> {
    const query = await this.createQueryBuilder('user_achievements')
      .where('user_achievements.user_id = :userId', { userId: userId })
      .getMany();
    return query;
  }
}
