import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Long,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('blocks')
export class Block {
  @PrimaryColumn('bigint', { name: 'source_id' })
  // @Column('bigint', { name: 'source_id' })
  sourceId: number;

  @PrimaryColumn('bigint', { name: 'target_id' })
  // @Column('bigint', { name: 'target_id' })
  targetId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  uodatedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'source_id', referencedColumnName: 'id' })
  sourceUser: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'target_id', referencedColumnName: 'id' })
  targetUser: User;
}
