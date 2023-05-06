import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { UserDetailDto, UserDto } from '@dto/user/user.dto';
import { User } from '@entity/user.entity';
import BlockRepository from '@repository/block.repository';
import FriendRepository from '@repository/friend.repository';
import GameLogRepository from '@repository/game_log.repository';
import UserRepository from '@repository/user.repository';
import UserAchievementRepository from '@repository/user_achievement.repository';
import UserSession from '@session/user.session';
import UserSocketState from '@dto/user/user.socket.state';
import EncryptionService from '@service/encryption.service';
import ExceptionMessage from '@dto/socket/exception.message';

@Injectable()
export class UserService {
  constructor(
    private readonly userSession: UserSession,
    private readonly userRepository: UserRepository,
    private readonly friendRepository: FriendRepository,
    private readonly blockRepository: BlockRepository,
    private readonly gameLogRepository: GameLogRepository,
    private readonly userAchievementRepository: UserAchievementRepository,
    private readonly encryptionService: EncryptionService,
  ) {}

  getAllUserForSocket(userId: number) {
    return this.userSession
      .getAllUser()
      .filter(
        (userInfo) =>
          userInfo.userId !== userId &&
          userInfo.state !== UserSocketState.OFFLINE,
      );
  }

  getUserInfoForSocket(userId: number) {
    return this.userSession.getUserInfo(userId);
  }

  checkUserOnline(userId: number) {
    const user = this.userSession.get(userId, true);
    if (user && user.state !== UserSocketState.OFFLINE)
      throw new ForbiddenException(ExceptionMessage.FORBIDDEN);
  }

  setStateForSocket(userId: number, state: UserSocketState) {
    const user = this.userSession.get(userId);
    user.state = state;
  }

  async setUserForSocket(userId: number) {
    const user = await this.userRepository.findUser(userId);
    const friends = await this.friendRepository.findFriends(userId);
    const blocks = await this.blockRepository.findBlocks(userId);

    if (!user) throw new UnauthorizedException(ExceptionMessage.UNAUTHORIZED);

    this.userSession.set(userId, {
      userId: userId,
      username: user.name,
      state: UserSocketState.ONLINE,
      profile: user.profile,
      follows: friends.map((friend) => friend.sourceId),
      blocks: blocks.map((block) => block.sourceId),
      room: `room:user:${user.id}`,
    });
  }

  deleteUserForSocket(userId: number) {
    this.userSession.delete(userId);
  }

  async findByUserId(userId: number): Promise<User> {
    const result = await this.userRepository.findUser(userId);
    if (result == null) {
      throw new NotFoundException(ExceptionMessage.NOT_FOUND);
    }
    return result;
  }

  async findUserByUsername(
    username: string,
    isTest: boolean = true,
  ): Promise<User | null> {
    const result = await this.userRepository.findUserByName(username);
    if (isTest == false && result == null) {
      throw new NotFoundException(ExceptionMessage.NOT_FOUND);
    }
    return result;
  }

  async createUser(userDto: UserDto) {
    const user = this.userRepository.create();

    user.name = userDto.name;
    user.nickname = userDto.nickname;
    user.twoFactor = userDto.twoFactor;
    user.profile = userDto.profile;

    return await this.userRepository.save(userDto);
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
      throw new NotFoundException(ExceptionMessage.NOT_FOUND);
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

    const user = userList.find((e) => e.id === +userId);
    const result: UserDetailDto = UserDetailDto.fromData(
      user,
      userList,
      friendList,
      blockList,
      gameLogList,
      userAchievementList,
    );

    if (user == null) {
      throw new NotFoundException(ExceptionMessage.NOT_FOUND);
    }

    return result;
  }

  async hasNickname(nickname: string): Promise<boolean | null> {
    const userList = await this.userRepository.find();
    if (userList.some((e) => e.nickname === nickname)) return true;
    return false;
  }

  async firstAccess(user: User) {
    if (!user.firstAccess)
      throw new ForbiddenException(ExceptionMessage.FORBIDDEN);

    user.firstAccess = false;

    await this.userRepository.updateFirstAccess(user);
  }

  async deleteUserByEntity(user: User) {
    await this.userRepository.delete(user);
  }

  async updateDisplayName(userId: number, name: string) {
    await this.userRepository.updateDisplayName(userId, name);
  }

  async followUser(sourceId: number, targetId: number) {
    await this.friendRepository.followUser(sourceId, targetId);
  }

  async unFollowUser(sourceId: number, targetId: number) {
    await this.friendRepository.unFollowUser(sourceId, targetId);
  }

  async blockUser(sourceId: number, targetId: number) {
    await this.blockRepository.blockUser(sourceId, targetId);
  }

  async updateImage(userId: number, imageUrl: string) {
    await this.userRepository.updateImageUrl(userId, imageUrl);
  }

  async checkTwoFactor(user: User, code: string) {
    if (!(await this.encryptionService.compare(code, user.twoFactor)))
      throw new UnauthorizedException(ExceptionMessage.UNAUTHORIZED);
  }

  async updateTwoFactor(user: User, code: string) {
    const password = !code.length
      ? null
      : await this.encryptionService.hash(code);
    user.twoFactor = password;
    this.userRepository.save(user);
  }
}
