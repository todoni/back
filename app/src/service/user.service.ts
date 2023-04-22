import { UserAccessDto, UserDetailDto, UserDto } from '@dto/user.dto';
import { User } from '@entity/user.entity';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import BlockRepository from '@repository/block.repository';
import FriendRepository from '@repository/friend.repository';
import GameLogRepository from '@repository/game_log.repository';
import UserRepository from '@repository/user.repository';
import UserAchievementRepository from '@repository/user_achievement.repository';

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

  async findByUserId(userId: number): Promise<User> {
    const result = await this.userRepository.findUser(userId);
    if (result == null) {
      throw new NotFoundException();
    }
    return result;
  }

  async findUserByUsername(
    username: string,
    isTest: boolean = true,
  ): Promise<User | null> {
    const result = await this.userRepository.findUserByName(username);
    if (isTest == false && result == null) {
      throw new NotFoundException();
    }
    return result;
  }

  async createUser(userDto: UserDto) {
    const user = this.userRepository.create();

    user.id = userDto.id;
    user.name = userDto.name;
    user.nickname = userDto.nickname;
    user.twoFactor = userDto.twFactor;
    user.twoFactorUid = userDto.twFactorUid;
    user.profile = userDto.profile;

    await this.userRepository.save(userDto);

    return user;
  }

  async getUserDetail(user: User): Promise<UserDetailDto> {
    const userList = await this.userRepository.find();
    const friendList = await this.friendRepository.findFriends(user.id);
    const blockList = await this.blockRepository.findBlocks(user.id);
    const gameLogList = await this.gameLogRepository.findGameLogs(user.id);
    const userAchievementList =
      await this.userAchievementRepository.findUserAchievement(user.id);

    const result: UserDetailDto = UserDetailDto.fromData(
      user,
      userList,
      friendList,
      blockList,
      gameLogList,
      userAchievementList,
    );

    if (user == null) {
      throw new NotFoundException();
    }

    return result;
  }

  async getUserDetailById(userId: number): Promise<UserDetailDto | null> {
    const userList = await this.userRepository.find();
    const friendList = await this.friendRepository.findFriends(userId);
    const blockList = await this.blockRepository.findBlocks(userId);
    const gameLogList = await this.gameLogRepository.findGameLogs(userId);
    const userAchievementList =
      await this.userAchievementRepository.findUserAchievement(userId);

    const user = userList.find((e) => e.id === userId);

    const result: UserDetailDto = UserDetailDto.fromData(
      user,
      userList,
      friendList,
      blockList,
      gameLogList,
      userAchievementList,
    );

    if (user == null) {
      throw new NotFoundException();
    }

    return result;
  }

  async hasNickname(nickname: string): Promise<boolean | null> {
    const userList = await this.userRepository.find();
    if (userList.some((e) => e.nickname === nickname)) return true;
    return false;
  }

  async firstAccess(user: User, userAccessDto: UserAccessDto) {
    if (!user.firstAccess) throw new ForbiddenException();

    userAccessDto.firstAccess = false;

    await this.userRepository.updateFirstAccess(user.id, userAccessDto);
  }

  async deleteUserByEntity(user: User) {
    await this.userRepository.delete(user);
  }
}
