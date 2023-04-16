import { Expose } from 'class-transformer';
import { Block } from 'src/entity/block.entity';
import { Friend } from 'src/entity/friend.entity';
import { GameLog } from 'src/entity/game_log.entity';
import { User } from 'src/entity/user.entity';
import { UserAchievement } from 'src/entity/user_achievement';

export class UserDto {
  id: number;
  name: string;
  nickname: string;
  twFactor: boolean;
  twFactorUid: string;
  profile: string;
  firstAccess: boolean;
}

export class UserDetailDto {
  name: string;
  nickname: string;
  twFactor: boolean;
  twFactorUid: string;
  profile: string;
  level: number;

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
    temp.name = user.name;
    temp.nickname = user.nickname;
    temp.twFactor = user.twoFactor;
    temp.twFactorUid = user.twoFactorUid;
    temp.profile = user.profile;
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
  twFactor: boolean;
  twFactorUid: string;
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
