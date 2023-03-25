import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Common } from './common/common.entity';
import { UserAchievement } from './user_achievement';

@Entity('achievements')
export class Achievement extends Common {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column('varchar', { length: 20 })
  title: string;
}
