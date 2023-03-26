import { Injectable } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import FriendRepository from 'src/repository/friend.repository';
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

  async testGetUser(id: number): Promise<User | null> {
    const result = await this.userRepository.findOne({ where: { id: id } });
    return result;
  }
}
