import { Injectable } from '@nestjs/common';

import BaseSession from '@session/base.session';
import GameSessionDto from '@dto/game/game.session.dto';

@Injectable()
class GameSession extends BaseSession<GameSessionDto> {
  constructor() {
    super();
  }
}

export default GameSession;
