import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';

import { Common } from '@entity/common/common.entity';
import { User } from '@entity/user.entity';

@Entity('friends')
export class Friend extends Common {
  @PrimaryColumn('bigint', { name: 'source_id' })
  sourceId: number;

  @PrimaryColumn('bigint', { name: 'target_id' })
  targetId: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'source_id', referencedColumnName: 'id' })
  sourceUser: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'target_id', referencedColumnName: 'id' })
  targetUser: User;
}
