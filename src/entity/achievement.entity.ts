import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { Common } from '@entity/common/common.entity';

@Entity('achievements')
export class Achievement extends Common {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column('varchar', { length: 20 })
  title: string;
}
