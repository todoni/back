import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import ClientSocket from '@dto/socket/client.socket';
import ExceptionMessage from '@dto/socket/exception.message';
import ClientException from '@exception/client.exception';

interface GameAuthInterceptorParam {
  hasGame?: boolean;
  owner?: boolean;
  player?: boolean;
}

// todo: player 권한 조조회회
export class GameAuthInterceptor implements NestInterceptor {
  private readonly hasGame: boolean;
  private readonly owner: boolean;
  private readonly player: boolean;

  constructor(param: GameAuthInterceptorParam = {}) {
    this.hasGame = param.hasGame !== undefined ? param.hasGame : true;
    this.owner = param.owner !== undefined ? param.owner : false;
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const client: ClientSocket = context.switchToWs().getClient();

    if (
      (this.hasGame && !client.game.id) ||
      (!this.hasGame && client.game.id)
    ) {
      throw new ClientException(
        ExceptionMessage.FORBIDDEN,
        HttpStatus.FORBIDDEN,
      );
    }

    if (
      this.hasGame &&
      ((this.owner && !client.game.isOwner) ||
        (this.player && !client.game.isPlayer))
    ) {
      throw new ClientException(
        ExceptionMessage.FORBIDDEN,
        HttpStatus.FORBIDDEN,
      );
    }

    return next.handle();
  }
}
