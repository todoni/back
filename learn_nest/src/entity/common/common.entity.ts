import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class Common {
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  uodatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
