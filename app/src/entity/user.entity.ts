import {
  Column,
  CreateDateColumn,
  Entity,
  Long,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Achievement } from './achievement.entity';
import { Block } from './block.entity';
import { Common } from './common/common.entity';
import { Friend } from './friend.entity';
import { GameLog } from './game_log.entity';
import { UserAchievement } from './user_achievement';

@Entity('users')
export class User extends Common {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column('varchar', { length: 20 })
  name: string;

  @Column('varchar', { length: 20 })
  nickname: string;

  @Column({ name: 'tw_factor', default: false })
  twoFactor: boolean;

  @Column('varchar', { name: 'tw_factor_uid', length: 100, nullable: true })
  twoFactorUid: string;

  @Column('varchar', { length: 255 })
  profile: string;

  //////////////////////////////////////////////

  @OneToMany(() => Friend, (firend) => firend.sourceUser, { cascade: true })
  sourceFriends: Friend[];

  @OneToMany(() => Friend, (firend) => firend.targetUser, { cascade: true })
  targetFriends: Friend[];

  @OneToMany(() => Block, (block) => block.sourceUser, { cascade: true })
  sourceBlocks: Block[];

  @OneToMany(() => Block, (block) => block.targetUser, { cascade: true })
  targetBlocks: Block[];

  @OneToMany(
    () => UserAchievement,
    (UserAchievement) => UserAchievement.achievement,
    { cascade: true },
  )
  achievements: UserAchievement[];

  @OneToMany(() => GameLog, (log) => log.winner, { cascade: true })
  winLogs: GameLog[];

  @OneToMany(() => GameLog, (log) => log.looser, { cascade: true })
  loseLogs: GameLog[];
}
