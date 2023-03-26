import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { GameLog } from 'src/entity/game_log.entity';

@Injectable()
export default class GameLogRepository extends Repository<GameLog> {
  constructor(private readonly dataSource: DataSource) {
    super(GameLog, dataSource.createEntityManager());
  }
}
