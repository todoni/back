import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { Block } from 'src/entity/block.entity';

@Injectable()
export default class BlockRepository extends Repository<Block> {
  constructor(private readonly dataSource: DataSource) {
    super(Block, dataSource.createEntityManager());
  }
}
