import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { GameLog } from '@entity/game_log.entity';
import { GamePlayerDto } from '@dto/game/game.session.dto';

@Injectable()
export default class GameLogRepository extends Repository<GameLog> {
  constructor(private readonly dataSource: DataSource) {
    super(GameLog, dataSource.createEntityManager());
  }

  async findGameLogs(userId: number): Promise<GameLog[]> {
    const query = await this.createQueryBuilder('game_logs')
      .where('game_logs.winner_id = :userId', { userId: userId })
      .orWhere('game_logs.looser_id = :userId', { userId: userId })
      .getMany();
    return query;
  }

  async createGameLogs(players: GamePlayerDto[]) {
    await this.createQueryBuilder('game_logs')
      .insert()
      .into(GameLog)
      .values({
        winnerId: players[0].userId,
        looserId: players[1].userId,
        score: (players[0].score << 4) + players[1].score,
      })
      .execute();
  }
}
