import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { Achievement } from 'src/entity/achievement.entity';

@Injectable()
export default class AchievementRepository extends Repository<Achievement> {
  constructor(private readonly dataSource: DataSource) {
    super(Achievement, dataSource.createEntityManager());
  }
}
