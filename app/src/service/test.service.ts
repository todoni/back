import { Injectable } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import AchievementRepository from 'src/repository/achievement.repository';
import BlockRepository from 'src/repository/block.repository';
import FriendRepository from 'src/repository/friend.repository';
import GameLogRepository from 'src/repository/game_log.repository';
import UserRepository from 'src/repository/user.repository';
import UserAchievementRepository from 'src/repository/user_achievement.repository';

@Injectable()
export class TestService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly friendRepository: FriendRepository,
    private readonly blockRepository: BlockRepository,
    private readonly gameLogRepository: GameLogRepository,
    private readonly achievementRepository: AchievementRepository,
    private readonly userAchievementRepository: UserAchievementRepository,
  ) {}

  async initData(): Promise<void> {
    // //User
    await this.userRepository.save({
      name: 'name1',
      nickname: 'nickname1',
      twoFactor: false,
      twoFactorUid: '123',
      profile: '111',
    });
    await this.userRepository.save({
      name: 'name2',
      nickname: 'nickname2',
      twoFactor: false,
      twoFactorUid: '123',
      profile: '222',
    });

    console.log('@@@ user 2명 추가');

    const user1 = await this.userRepository.findOne({
      where: { name: 'name1' },
    });
    const user2 = await this.userRepository.findOne({
      where: { name: 'name2' },
    });

    console.log('@@@ user 2명 불러오기');
    console.log(user1);
    console.log(user2.id);

    // Friend
    this.friendRepository.save({
      sourceId: user1.id,
      targetId: user2.id,
    });

    console.log('@@@ friend 설정 완');

    //Block
    this.blockRepository.save({
      sourceId: user1.id,
      targetId: user2.id,
    });

    console.log('@@@ block 설정 완');

    //GameLog
    this.gameLogRepository.save({
      winnerId: user1.id,
      looserId: user2.id,
      score: 29,
    });

    console.log('@@@ log 설정 완');

    //Achievement
    await this.achievementRepository.save({
      title: '업적1',
    });
    await this.achievementRepository.save({
      title: '업적2',
    });
    await this.achievementRepository.save({
      title: '업적3',
    });

    console.log('@@@ 업적 3개 저장 완');

    const ach1 = await this.achievementRepository.findOne({
      where: { title: '업적1' },
    });

    const ach2 = await this.achievementRepository.findOne({
      where: { title: '업적2' },
    });

    console.log('@@@ 업적 중 1, 2 불러오기');
    console.log(ach1);
    console.log(ach2);

    //UserAchievement
    await this.userAchievementRepository.save({
      userId: user1.id,
      achievementId: ach1.id,
    });

    await this.userAchievementRepository.save({
      userId: user1.id,
      achievementId: ach2.id,
    });
    await this.userAchievementRepository.save({
      userId: user2.id,
      achievementId: ach1.id,
    });

    console.log('@@@ 업적 설정 완');
  }
}
