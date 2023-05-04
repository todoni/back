import { ForbiddenException, Injectable } from '@nestjs/common';

import GameSession from '@session/game.session';
import GameSessionDto, {
  GameBallDto,
  GamePlayerDto,
  GamePrivateDto,
} from '@dto/game/game.session.dto';

@Injectable()
class GameService {
  private readonly rowSize = 10;
  private readonly colSize = 20;
  private readonly upKey = 38;
  private readonly downKey = 40;
  private readonly paddle = [0, 1, 2];

  constructor(private readonly gameSession: GameSession) {}

  /* ============================ */
  /*        Public Method         */
  /* ============================ */

  getAllGame() {
    return this.gameSession.getAllGame();
  }

  get(gameId: number) {
    return this.gameSession.get(gameId);
  }

  createGame(userId: number, speed: number) {
    const gameSession = new GameSessionDto();
    const gamePlayer = new GamePlayerDto();
    const gameId = this.gameSession.getNextSequence();

    gameSession.public.gameId = gameId;
    gameSession.public.ownerId = userId;
    gameSession.public.name = `신나는 게임 한판`;
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
      throw new ForbiddenException();

    gamePlayer.userId = userId;
    gamePlayer.position = this.paddle.map((x) => (x + 1) * this.colSize + -2);
    gameSession.private.players.push(gamePlayer);

    return gameSession;
  }

  leaveGame(gameId: number, userId: number) {
    const gameSession = this.gameSession.get(gameId);
    const isOwner = gameSession.public.ownerId === userId;
    const isWatcher = gameSession.private.watcher.indexOf(userId);

    if (isOwner) this.gameSession.delete(gameId);
    else if (isWatcher !== -1) gameSession.private.watcher.splice(isWatcher, 1);
    else gameSession.private.players.splice(1, 1);

    return isOwner;
  }

  waitGame(gameId: number, userId: number) {
    const gameSession = this.gameSession.get(gameId);
    gameSession.private.watcher.push(userId);
    return gameSession;
  }

  getPlayersId(gameId: number) {
    const gameSession = this.gameSession.get(gameId);
    return gameSession.private.players.map((player) => player.userId);
  }

  initialGameSetting(gameSession: GameSessionDto) {
    this.initialRoundSetting(gameSession.private, true);
  }

  initialRoundSetting(gamePrivate: GamePrivateDto, init = false) {
    if (!init) gamePrivate.round++;
    gamePrivate.onRound = !init;
    // todo: 공 델타 값 랜덤하게
    gamePrivate.ball.position = Math.round((10 * 20) / 2) + 10;
    gamePrivate.ball.deltaX = -1;
    gamePrivate.ball.deltaY = -this.colSize;

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

  isBallTouchingPaddle(
    position: number,
    ball: GameBallDto,
    players: GamePlayerDto[],
  ) {
    return (
      players.findIndex(
        (player) =>
          player.position.indexOf(position) !== -1 ||
          (ball.deltaX === -1 &&
            player.position.indexOf(position + ball.deltaX) !== -1),
      ) !== -1
    );
  }

  isBallTouchingPaddleEdge(position: number, players: GamePlayerDto[]) {
    return (
      players.findIndex(
        (player) =>
          player.position[0] === position || player.position[2] === position,
      ) !== -1
    );
  }

  moveBall(ball: GameBallDto, players: GamePlayerDto[]) {
    const newPosition = ball.position + ball.deltaY + ball.deltaX;

    if (this.isBallTouchingEdge(newPosition)) {
      ball.deltaY *= -1;
    }
    if (this.isBallTouchingPaddle(newPosition, ball, players)) {
      ball.deltaX *= -1;
    }
    if (this.isBallTouchingPaddleEdge(newPosition, players)) {
      ball.deltaY *= -1;
    }
  }

  movePaddle(gameId: number, userId: number, keyCode: number) {
    const gameSession = this.gameSession.get(gameId);
    const playerIndex = gameSession.private.players.findIndex(
      (player) => player.userId === userId,
    );

    if (playerIndex === -1) throw new ForbiddenException();
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
    if (gamePrivate.ball.deltaX !== -1) {
      gamePrivate.players[0].score++;
    } else {
      gamePrivate.players[1].score++;
    }
    gamePrivate.onRound = false;
  }

  endGame(players: GamePlayerDto[]) {
    const sortedPlayer = players.sort((a, b) => b.score - a.score);
    return {
      winner: sortedPlayer[0],
      loser: sortedPlayer[1],
    };
  }

  /* ============================= */
  /*        Private Method         */
  /* ============================= */
}

export default GameService;
