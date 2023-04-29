import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
} from '@nestjs/websockets';

import BaseGateway, { GatewayInjector } from '@gateway/base.gateway';
import ClientSocket, { IC_TYPE } from '@dto/socket/client.socket';
import GameService from '@service/game.service';
import UserSocketState from '@dto/user/user.socket.state';
import GameSessionDto, { GamePlayerDto } from '@dto/game/game.session.dto';

@GatewayInjector('game')
class GameGateway extends BaseGateway {
  /**
   * == 게임방 ==
   * B - 생성
   * G - 참여
   * G - 나가기
   * G - 관전
   * S - 초대
   * == 게임중 ==
   * G - 게임 시작
   * G - 게임 종료
   * G - 공 움직이기
   */

  constructor(private readonly gameService: GameService) {
    super();
  }

  /* ================================= */
  /*             Broadcast             */
  /* ================================= */

  @SubscribeMessage('createGame')
  createGame(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody('speed') speed: number,
  ) {
    const gameSession = this.gameService.createGame(client.user.id, speed);
    client.set(IC_TYPE.GAME, gameSession.public.gameId);

    this.changeState(client, UserSocketState.WAIT_GAME);
    this.server.emit('broadcast:game:createGame', gameSession.public);
    client.emit('single:game:createGame', gameSession);
  }

  /* ============================= */
  /*             Group             */
  /* ============================= */

  @SubscribeMessage('joinGame')
  joinGame(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody('gameId') gameId: number,
  ) {
    const gameSession = this.gameService.joinGame(gameId, client.user.id);
    client.set(IC_TYPE.GAME, gameId);

    this.changeState(client, UserSocketState.WAIT_GAME);
    this.server
      .to(client.game.room)
      .except(client.user.room)
      .emit('group:game:joinGame', gameSession.private.players[1]);
    client.emit('single:game:joinGame', gameSession);
  }

  @SubscribeMessage('watchGame')
  watchGame(@ConnectedSocket() client: ClientSocket, gameId: number) {
    const gameSession = this.gameService.waitGame(gameId, client.user.id);
    client.set(IC_TYPE.GAME, gameId);

    this.changeState(client, UserSocketState.WATChING_GAME);
    this.server
      .to(client.game.room)
      .except(client.user.room)
      .emit('group:game:watchGame', { userId: client.user.id });
    client.emit('single:game:watchGame', gameSession);
  }

  @SubscribeMessage('leaveGame')
  leaveGame(@ConnectedSocket() client: ClientSocket) {
    const isOwner = this.gameService.leaveGame(client.game.id, client.user.id);

    this.changeState(client, UserSocketState.ONLINE);
    if (isOwner) {
      this.server
        .except(client.game.room)
        .emit('broadcast:game:deleteGame', { gameId: client.game.id });
      this.server.to(client.game.room).emit('group:game:deleteGame');
    } else {
      this.server
        .to(client.game.room)
        .emit('group:game:leaveGame', { userId: client.user.id });
    }
    client.clear(IC_TYPE.GAME);
  }

  // todo: message로 받을 지 다시 생각
  // todo: 구현하면서 로직 다시 생각해보자
  // todo: owner 권한
  @SubscribeMessage('startGame')
  startGame(@ConnectedSocket() client: ClientSocket) {
    const gameSession = this.gameService.get(client.game.id);

    this.changePlayerState(gameSession.private.players);
    this.server.to(client.game.room).emit('group:game:startGame');

    this.gameService.initialGameSetting(gameSession);
    gameSession.private.gameInterval = setInterval(async () => {
      if (
        !this.gameService.monitGame(gameSession.private) ||
        !gameSession.private.onGame
      ) {
        clearInterval(gameSession.private.gameInterval);
        const gameReult = this.gameService.endGame(gameSession.private.players);
        this.server.to(client.game.room).emit('group:game:endGame', {
          winner: gameReult.winner,
          loser: gameReult.loser,
        });
        return;
      }

      if (!gameSession.private.onRound) this.startRound(gameSession);
    }, 100);
  }

  // todo: message로 받을 지 다시 생각
  // todo: 구현하면서 로직 다시 생각해보자
  @SubscribeMessage('movePaddle')
  moveBall(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody('keyCode') keyCode: number,
  ) {
    if (keyCode !== 38 && keyCode !== 40) return;

    const position = this.gameService.movePaddle(
      client.game.id,
      client.user.id,
      keyCode,
    );

    this.server.to(client.game.room).emit('group:game:movePaddle', {
      userId: client.user.id,
      position: position,
    });
  }

  /* ============================== */
  /*             Single             */
  /* ============================== */

  @SubscribeMessage('inviteGame')
  inviteGame(@ConnectedSocket() client: ClientSocket) {}

  /* =============================== */
  /*             Private             */
  /* =============================== */

  async startRound(gameSession: GameSessionDto) {
    this.gameService.initialRoundSetting(gameSession.private);
    this.server.to(gameSession.private.room).emit('group:game:initRound', {
      players: gameSession.private.players,
      ball: gameSession.private.ball,
    });

    await this.waitAsync(3, this.countDownRound, gameSession.private.room);

    this.server.to(gameSession.private.room).emit('group:game:startRound');
    gameSession.private.roundInterval = setInterval(() => {
      if (!this.gameService.monitRound(gameSession.private.ball)) {
        clearInterval(gameSession.private.roundInterval);
        this.endRound(gameSession);
        return;
      }

      this.gameService.moveBall(
        gameSession.private.ball,
        gameSession.private.players,
      );
      this.server.to(gameSession.private.room).emit('group:game:moveBall', {
        position: gameSession.private.ball.position,
      });
    }, 1000 / gameSession.private.ball.speed);
  }

  endRound(gameSession: GameSessionDto) {
    this.gameService.endRound(gameSession.private);
    this.server.to(gameSession.private.room).emit('group:game:endRound');
  }

  countDownRound(count: number, room: string) {
    this.server.to(room).emit('group:game:coundDownRound', { count: count });
  }

  changePlayerState(players: GamePlayerDto[]) {
    players.forEach((player) => {
      const playerSocket = this.socketSession.get(player.userId);
      this.changeState(playerSocket, UserSocketState.IN_GAME);
    });
  }

  async waitAsync(condition: number, callback: Function, ...args: any) {
    return await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!condition) {
          clearInterval(interval);
          resolve(undefined);
          return;
        }
        callback(condition, ...args);
        condition--;
      }, 1000);
    });
  }
}

export default GameGateway;
