import { Expose } from 'class-transformer';

export interface UserDetailDto {
  name: string;
  nickname: string;
  twFactor: boolean;
  twFactorUid: string;
  profile: string;
  level: number;
  winPercent: number;
  userLogs: UserLog[];
  achivements: UserAchievement[];
}

interface UserLog {
  name: string;
  nickname: string;
  twFactor: boolean;
  twFactorUid: string;
  profile: string;
}

interface UserAchievement {
  achivementTitle: string;
  isDone: boolean;
}
