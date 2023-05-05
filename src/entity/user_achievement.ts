import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Achievement } from '@entity/achievement.entity';
import { Common } from '@entity/common/common.entity';
import { User } from '@entity/user.entity';

@Entity('user_achievements')
export class UserAchievement extends Common {
  @PrimaryColumn('int', { name: 'user_id' })
  userId: number;

  @PrimaryColumn('int', { name: 'achievement_id' })
  achievementId: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Achievement, (achievement) => achievement.id)
  @JoinColumn({ name: 'achievement_id', referencedColumnName: 'id' })
  achievement: Achievement;
}
