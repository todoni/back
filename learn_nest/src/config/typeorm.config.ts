import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Achievement } from 'src/entity/achievement.entity';
import { Block } from 'src/entity/block.entity';
import { Friend } from 'src/entity/fiend.entity';
import { GameLog } from 'src/entity/game_log.entity';
import { User } from 'src/entity/user.entity';
import { UserAchievement } from 'src/entity/user_achievement';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'seunpark',
  password: '',
  database: 'test_nest',
  entities: [User, Friend, Block, Achievement, UserAchievement, GameLog],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: true,
};
