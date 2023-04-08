import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { GameLog } from 'src/entity/game_log.entity';

@Injectable()
export default class GameLogRepository extends Repository<GameLog> {
  constructor(private readonly dataSource: DataSource) {
    super(GameLog, dataSource.createEntityManager());
  }

  findGameLogs(userId : number) : Promise<GameLog[] | null>{
    const query = this.createQueryBuilder('game_logs')
      .where('game_logs.winner_id = :userId', {userId : userId})
      .orWhere('game_logs.looser_id = :userId', {userId : userId})
      .getMany();
    return query;
  }
}
