import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Block } from '@entity/block.entity';
import { Common } from '@entity/common/common.entity';
import { Friend } from '@entity/friend.entity';
import { GameLog } from '@entity/game_log.entity';
import { UserAchievement } from '@entity/user_achievement';

@Entity('users')
export class User extends Common {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column('varchar', { length: 20 })
  name: string;

  @Column('varchar', { length: 20 })
  nickname: string;

  @Column({ name: 'tw_factor', nullable: true })
  twoFactor: string;

  @Column('varchar', { length: 255 })
  profile: string;

  @Column({ name: 'first_access', default: false })
  firstAccess: boolean;

  @Column('varchar', { name: 'refresh_token', length: 255, nullable: true })
  refreshToken: string;

  //////////////////////////////////////////////

  @OneToMany(() => Friend, (firend) => firend.sourceUser, { cascade: true })
  sourceFriends: Friend[];

  @OneToMany(() => Friend, (firend) => firend.targetUser, { cascade: true })
  targetFriends: Friend[];

  @OneToMany(() => Block, (block) => block.sourceUser, { cascade: true })
  sourceBlocks: Block[];

  @OneToMany(() => Block, (block) => block.targetUser, { cascade: true })
  targetBlocks: Block[];

  @OneToMany(() => UserAchievement, (UserAchievement) => UserAchievement.user, {
    cascade: true,
  })
  achievements: UserAchievement[];

  @OneToMany(() => GameLog, (log) => log.winner, { cascade: true })
  winLogs: GameLog[];

  @OneToMany(() => GameLog, (log) => log.looser, { cascade: true })
  loseLogs: GameLog[];
}
