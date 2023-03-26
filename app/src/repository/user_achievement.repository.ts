import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { UserAchievement } from 'src/entity/user_achievement';

@Injectable()
export default class UserAchievementRepository extends Repository<UserAchievement> {
  constructor(private readonly dataSource: DataSource) {
    super(UserAchievement, dataSource.createEntityManager());
  }
}
