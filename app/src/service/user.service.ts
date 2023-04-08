import { Injectable } from '@nestjs/common';
import { Achievement } from 'src/entity/achievement.entity';
import { User } from 'src/entity/user.entity';
import UserRepository from 'src/repository/user.repository';
import FriendRepository from 'src/repository/friend.repository';
import BlockRepository from 'src/repository/block.repository';
import GameLogRepository from 'src/repository/game_log.repository';
import UserAchievementRepository from 'src/repository/user_achievement.repository';
import { UserDetailDto } from 'src/dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly friendRepository: FriendRepository,
    private readonly blockRepository: BlockRepository,
    private readonly gameLogRepository: GameLogRepository,
    private readonly userAchievementRepository: UserAchievementRepository,
  ) {}
  testAddUser(): void {
    this.userRepository.save({
      name: 'name1',
      nickname: 'nickname1',
      twoFactor: false,
      twoFactorUid: '123',
      profile: '',
    });
  }

  async getUserDetail(userId: number): Promise<UserDetailDto | null> {
    const userList = await this.userRepository.find();
    const friendList = await this.friendRepository.findFriends(userId);
    const blockList = await this.blockRepository.findBlocks(userId);
    const gameLogList = await this.gameLogRepository.findGameLogs(userId);
    const userAchievementList =
      await this.userAchievementRepository.findUserAchievement(userId);
    const user = userList.find((e) => e.id == userId);

    console.log('===========================');
    console.log(userList);
    console.log(friendList);
    console.log(blockList);
    console.log(gameLogList);
    console.log(userAchievementList);
    console.log('===========================');

    const result: UserDetailDto = UserDetailDto.fromData(
      user,
      userList,
      friendList,
      blockList,
      gameLogList,
      userAchievementList,
    );

    return result;
  }
}
