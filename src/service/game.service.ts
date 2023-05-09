import { Injectable, HttpStatus } from '@nestjs/common';

import GameSession from '@session/game.session';
import GameSessionDto, {
  GameBallDto,
  GamePlayerDto,
  GamePrivateDto,
} from '@dto/game/game.session.dto';
import ExceptionMessage from '@dto/socket/exception.message';
import ClientSocket from '@dto/socket/client.socket';
import ClientException from '@exception/client.exception';
import GameLogRepository from '@repository/game_log.repository';

@Injectable()
class GameService {
  private readonly rowSize = 10;
  private readonly colSize = 20;
  private readonly upKey = 38;
  private readonly downKey = 40;
  private readonly paddle = [0, 1, 2];

  constructor(
    private readonly gameSession: GameSession,
    private readonly gameLogRepository: GameLogRepository,
  ) {}

  /* ============================ */
  /*        Public Method         */
  /* ============================ */

  getAllGame() {
    return this.gameSession.getAllGame();
  }

  get(gameId: number) {
    return this.gameSession.get(gameId);
  }

  setPlayer(client: ClientSocket, alsoOwner = false) {
    client.game.isPlayer = true;
    if (alsoOwner) client.game.isOwner = true;
  }

  createGame(
    userId: number,
    speed: number,
    options?: { name?: string; username?: string },
  ) {
    const gameSession = new GameSessionDto();
    const gamePlayer = new GamePlayerDto();
    const gameId = this.gameSession.getNextSequence();

    gameSession.public.gameId = gameId;
    gameSession.public.ownerId = userId;
    gameSession.public.name = options.name || `${options.username}의 게임방`;
    gameSession.public.speed = speed;
    gameSession.private.room = `room:game:${gameId}`;
    gameSession.private.ball.speed = speed;
    gamePlayer.userId = userId;
    gamePlayer.position = this.paddle.map((x) => x * this.colSize + 1);
    gameSession.private.players.push(gamePlayer);

    this.gameSession.set(gameId, gameSession);

    return gameSession;
  }

  joinGame(gameId: number, userId: number) {
    const gameSession = this.gameSession.get(gameId);
    const gamePlayer = new GamePlayerDto();

    if (gameSession.private.players.length === 2)
      throw new ClientException(
        ExceptionMessage.FORBIDDEN,
        HttpStatus.FORBIDDEN,
      );

    gamePlayer.userId = userId;
    gamePlayer.position = this.paddle.map((x) => (x + 1) * this.colSize + -2);
    gameSession.private.players.push(gamePlayer);

    return gameSession;
  }

  quickGame(userId: number, username: string) {
    const allGame = this.gameSession.getAllGame();
    const randIdx = Math.floor(Math.random() * allGame.length);

    // todo: speed 변경해야 함
    return {
      isCreated: allGame.length === 0,
      gameSession: !allGame.length
        ? this.createGame(userId, 100, { username: username })
        : this.joinGame(allGame[randIdx].gameId, userId),
    };
  }

  leaveGame(gameId: number, userId: number) {
    const gameSession = this.gameSession.get(gameId);
    const isOwner = gameSession.public.ownerId === userId;
    const isWatcher = gameSession.private.watcher.indexOf(userId);
    const existUsers: number[] = [];

    if (isOwner) {
      gameSession.private.players.forEach(
        (player) => player.userId !== userId && existUsers.push(player.userId),
      );
      gameSession.private.watcher.forEach((userId) => existUsers.push(userId));
      this.gameSession.delete(gameId);
    } else if (isWatcher !== -1)
      gameSession.private.watcher.splice(isWatcher, 1);
    else gameSession.private.players.splice(1, 1);

    return {
      isOwner: isOwner,
      breakGame: gameSession.private.onGame && isWatcher === 1,
      existUsers: existUsers,
    };
  }

  waitGame(gameId: number, userId: number) {
    const gameSession = this.gameSession.get(gameId);
    if (gameSession.private.onGame)
      throw new ClientException(
        ExceptionMessage.GAME_STARTED,
        HttpStatus.FORBIDDEN,
      );
    gameSession.private.watcher.push(userId);
    return gameSession;
  }

  getPlayersId(gameId: number) {
    const gameSession = this.gameSession.get(gameId);
    return gameSession.private.players.map((player) => player.userId);
  }

  initialGameSetting(gameSession: GameSessionDto) {
    gameSession.private.onGame = true;
    gameSession.private.players.map((player) => {
      player.score = 0;
    });
    this.initialRoundSetting(gameSession.private, true);
  }

  initialRoundSetting(gamePrivate: GamePrivateDto, init = false) {
    if (!init) gamePrivate.round++;
    const rand = Math.floor(Math.random() * 4);
    const deltaX = [1, -1, 1, -1];
    const deltaY = [-1, 1, 1, -1];
    console.log(Math.round((this.colSize * this.rowSize) / 2) + 10);
    gamePrivate.onRound = !init;
    gamePrivate.ball.position =
      Math.round((this.colSize * this.rowSize) / 2) + 10;
    gamePrivate.ball.deltaX = -1 * deltaX[rand];
    gamePrivate.ball.deltaY = -this.colSize * deltaY[rand];
    gamePrivate.players.map((player, idx) => {
      player.position = this.paddle.map(
        (x) => (x + idx) * this.colSize + (!idx ? 1 : -1) * (idx + 1),
      );
    });
  }

  monitGame(gamePrivate: GamePrivateDto) {
    return !(
      gamePrivate.players.length !== 2 ||
      gamePrivate.totalScore ===
        Math.max(...gamePrivate.players.map((player) => player.score))
    );
  }

  monitRound(ball: GameBallDto) {
    return !(
      (ball.deltaX === -1 && ball.position % this.colSize === 0) ||
      (ball.deltaX === 1 && (ball.position + 1) % this.colSize === 0)
    );
  }

  isBallTouchingEdge(position: number) {
    return (
      (0 <= position && position < this.colSize) ||
      (this.colSize * (this.rowSize - 1) < position &&
        position < this.colSize * this.rowSize)
    );
  }

  isBallTouchingPaddleX(
    position: number,
    ball: GameBallDto,
    players: GamePlayerDto[],
  ) {
    return (
      players.findIndex(
        (player) => player.position.indexOf(position + ball.deltaX) !== -1,
      ) !== -1
    );
  }

  isBallTouchingPaddleY(
    position: number,
    ball: GameBallDto,
    players: GamePlayerDto[],
  ) {
    return (
      players.findIndex(
        (player) => player.position.indexOf(position + ball.deltaY) !== -1,
      ) !== -1
    );
  }

  isBallTouchingPaddleEdge(
    position: number,
    ball: GameBallDto,
    players: GamePlayerDto[],
  ) {
    return (
      players.findIndex(
        (player) =>
          player.position[0] === position + ball.deltaX + ball.deltaY ||
          player.position[2] === position + ball.deltaX + ball.deltaY,
      ) !== -1
    );
  }

  moveBall(ball: GameBallDto, players: GamePlayerDto[]) {
    const newPosition = ball.position + ball.deltaY + ball.deltaX;

    if (this.isBallTouchingEdge(newPosition)) {
      ball.deltaY *= -1;
    }
    if (this.isBallTouchingPaddleX(newPosition, ball, players)) {
      ball.deltaX *= -1;
    }
    if (this.isBallTouchingPaddleY(newPosition, ball, players)) {
      ball.deltaY *= -1;
    }
    if (this.isBallTouchingPaddleEdge(newPosition, ball, players)) {
      ball.deltaX *= -1;
      ball.deltaY *= -1;
    }

    ball.position = newPosition;
  }

  movePaddle(gameId: number, userId: number, keyCode: number) {
    const gameSession = this.gameSession.get(gameId);
    const playerIndex = gameSession.private.players.findIndex(
      (player) => player.userId === userId,
    );

    if (playerIndex === -1)
      throw new ClientException(
        ExceptionMessage.FORBIDDEN,
        HttpStatus.FORBIDDEN,
      );
    const player = gameSession.private.players[playerIndex];
    const edge =
      keyCode === this.upKey ? player.position[0] : player.position[2];
    if (
      (keyCode === this.upKey && player.position[0] - this.colSize < 0) ||
      (keyCode === this.downKey &&
        player.position[2] + this.colSize > this.colSize * this.rowSize)
    ) {
      return player.position;
    }

    if (keyCode === this.upKey) {
      player.position.unshift(edge - this.colSize);
      player.position.pop();
    } else {
      player.position.push(edge + this.colSize);
      player.position.shift();
    }

    return player.position;
  }

  endRound(gamePrivate: GamePrivateDto) {
    if (gamePrivate.players[0] && gamePrivate.ball.deltaX !== -1) {
      gamePrivate.players[0].score++;
    } else if (gamePrivate.players[1] && gamePrivate.ball.deltaX !== 1) {
      gamePrivate.players[1].score++;
    }
    gamePrivate.onRound = false;
  }

  async endGame(gamePrivate: GamePrivateDto) {
    const sortedPlayer = gamePrivate.players.sort((a, b) => b.score - a.score);

    if (sortedPlayer[0].score === 11)
      await this.gameLogRepository.createGameLogs(sortedPlayer);
    gamePrivate.onGame = false;

    return {
      winner: sortedPlayer[0],
      loser: sortedPlayer[1],
      abnormal: sortedPlayer[0].score === 11,
    };
  }

  /* ============================= */
  /*        Private Method         */
  /* ============================= */
}

export default GameService;
