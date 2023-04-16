import { Module } from '@nestjs/common';
import { UserController } from 'src/controller/user.controller';
import AchievementRepository from 'src/repository/achievement.repository';
import BlockRepository from 'src/repository/block.repository';
import FriendRepository from 'src/repository/friend.repository';
import GameLogRepository from 'src/repository/game_log.repository';
import UserRepository from 'src/repository/user.repository';
import UserAchievementRepository from 'src/repository/user_achievement.repository';
import { TestService } from '@src/service/test.service';
import { UserService } from 'src/service/user.service';
import repositories from 'src/util/repository';

@Module({
  controllers: [UserController],
  providers: [UserService, ...repositories],
  exports: [UserService],
})
export class UserModule {}
