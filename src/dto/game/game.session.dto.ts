export class GamePlayerDto {
  userId: number;
  score: number = 0;
  position: number[];
}

export class GameBallDto {
  speed: number;
  position: number;
  deltaX: number;
  deltaY: number;
}

export class GamePublicDto {
  gameId: number;
  ownerId: number;
  name: string;
  speed: number;
}

export class GamePrivateDto {
  room: string;
  players: GamePlayerDto[] = new Array(2);
  watcher: number[] = [];
  ball: GameBallDto = new GameBallDto();
  totalScore: number = 11;
  round: number = 0;
  pause: boolean = false;
  onGame: boolean = false;
  onRound: boolean = false;
  gameInterval: NodeJS.Timer = undefined;
  roundInterval: NodeJS.Timer = undefined;
}

class GameSessionDto {
  public = new GamePublicDto();
  private = new GamePrivateDto();
}

export default GameSessionDto;
