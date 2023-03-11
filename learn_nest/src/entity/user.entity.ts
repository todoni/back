import {
  Column,
  CreateDateColumn,
  Entity,
  Long,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column('varchar', { length: 20 })
  name: string;

  @Column({ default: false })
  tw_factor: boolean;

  @Column('varchar', { length: 100, nullable: true })
  tw_factor_uid: string;

  @Column('varchar', { length: 255 })
  profile: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  uodatedAt: Date;
}
