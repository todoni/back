import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Achievement } from './achievement.entity';
import { Common } from './common/common.entity';
import { User } from './user.entity';

@Entity('user_achievements')
export class UserAchievement extends Common {
  @PrimaryColumn('bigint', { name: 'user_id' })
  userId: number;

  @PrimaryColumn('bigint', { name: 'achievement_id' })
  achievementId: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Achievement, (achievement) => achievement.id)
  @JoinColumn({ name: 'achievement_id', referencedColumnName: 'id' })
  achievement: Achievement;
}
