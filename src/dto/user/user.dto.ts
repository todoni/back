import { Block } from '@entity/block.entity';
import { Friend } from '@entity/friend.entity';
import { GameLog } from '@entity/game_log.entity';
import { User } from '@entity/user.entity';
import { UserAchievement } from '@entity/user_achievement';

export class UserDto {
  id: number;
  name: string;
  nickname: string;
  twoFactor: string;
  profile: string;
  firstAccess: boolean;
}

export class UserDetailDto {
  id: number;
  name: string;
  nickname: string;
  twoFactor: string;
  profile: string;
  level: number;
  firstAccess: boolean;

  friends: User[];
  blocks: User[];
  winPercent: number;
  userLogs: UserLog[];
  achivements: UserAchievementDto[];

  public static fromData(
    user: User,
    userList: User[],
    friendList: Friend[],
    blockList: Block[],
    gameLogList: GameLog[],
    userAchievementList: UserAchievement[],
  ): UserDetailDto {
    const temp = new UserDetailDto();
    temp.id = user.id;
    temp.name = user.name;
    temp.nickname = user.nickname;
    temp.twoFactor = user.twoFactor;
    temp.profile = user.profile;
    temp.firstAccess = user.firstAccess;
    temp.level = gameLogList.length * 10;
    //////////////////////////////////////////////////////////
    const friendSourceList = friendList.filter(
      (ele) => ele.sourceId === user.id,
    );
    temp.friends = friendSourceList.map((value) =>
      userList.find((ele) => ele.id === value.targetId),
    );
    //////////////////////////////////////////////////////////
    const blockSourceList = blockList.filter((ele) => ele.sourceId === user.id);
    temp.blocks = blockSourceList.map((value) =>
      userList.find((ele) => ele.id === value.targetId),
    );
    //////////////////////////////////////////////////////////
    temp.winPercent =
      (gameLogList.filter((ele) => ele.winnerId === user.id).length /
        gameLogList.length) *
      100;
    temp.userLogs = [];
    temp.achivements = [];

    return temp;
  }
}

export class UserLog {
  name: string;
  nickname: string;
  twoFactor: boolean;
  twoFactorUid: string;
  profile: string;
}

export class UserAchievementDto {
  achivementTitle: string;
  isDone: boolean;
}

export class UserAccessDto {
  displayName: string;

  email: string;

  firstAccess?: boolean;

  twoFactor: boolean;
}
