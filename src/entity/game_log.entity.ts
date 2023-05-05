import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Common } from '@entity/common/common.entity';
import { User } from '@entity/user.entity';

@Entity('game_logs')
export class GameLog extends Common {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column('bigint', { name: 'winner_id' })
  winnerId: number;

  @Column('bigint', { name: 'looser_id' })
  looserId: number;

  @Column('smallint')
  score: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'winner_id', referencedColumnName: 'id' })
  winner: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'looser_id', referencedColumnName: 'id' })
  looser: User;
}
