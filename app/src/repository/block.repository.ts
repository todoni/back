import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { Block } from '@entity/block.entity';

@Injectable()
export default class BlockRepository extends Repository<Block> {
  constructor(private readonly dataSource: DataSource) {
    super(Block, dataSource.createEntityManager());
  }

  async findBlocks(userId: number): Promise<Block[]> {
    const query = await this.createQueryBuilder('blocks')
      .where('blocks.source_id = :userId', { userId: userId })
      .orWhere('blocks.target_id = :userId', { userId: userId })
      .getMany();
    return query;
  }
}
