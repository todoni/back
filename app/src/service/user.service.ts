import { Injectable } from '@nestjs/common';
import { Achievement } from 'src/entity/achievement.entity';
import { User } from 'src/entity/user.entity';
import UserRepository from 'src/repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  testAddUser(): void {
    this.userRepository.save({
      name: 'name1',
      nickname: 'nickname1',
      twoFactor: false,
      twoFactorUid: '123',
      profile: '',
    });
  }

  async testGetUser(user_id: number): Promise<User | null> {
    console.log(`user_id1 = ${user_id}`);
    const result = await this.userRepository.findOne({
      where: { id: user_id },
      relations: [
        'sourceFriends',
        'targetFriends',
        'sourceBlocks',
        'targetBlocks',
        'achievements',
        'winLogs',
        'loseLogs',
      ],
    });
    // const result = await this.userRepository.findUser('id', id);
    return result;
  }
}
