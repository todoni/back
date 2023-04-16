import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { UserAchievement } from 'src/entity/user_achievement';

@Injectable()
export default class UserAchievementRepository extends Repository<UserAchievement> {
  constructor(private readonly dataSource: DataSource) {
    super(UserAchievement, dataSource.createEntityManager());
  }

  findUserAchievement(userId: number): Promise<UserAchievement[]> {
    const query = this.createQueryBuilder('user_achievements')
      .where('user_achievements.user_id = :userId', { userId: userId })
      .getMany();
    return query;
  }
  c;
}
