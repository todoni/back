import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('game_logs')
export class GameLog {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column('bigint', { name: 'winner_id' })
  winnerId: number;

  @Column('bigint', { name: 'looser_id' })
  looserId: number;

  @Column('varchar', { length: 20 })
  title: string;

  @Column('smallint')
  score: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  uodatedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'winner_id', referencedColumnName: 'id' })
  winner: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'looser_id', referencedColumnName: 'id' })
  looser: User;
}
