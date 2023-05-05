import { Injectable } from '@nestjs/common';

import BaseSession from '@session/base.session';
import GameSessionDto from '@dto/game/game.session.dto';

@Injectable()
class GameSession extends BaseSession<GameSessionDto> {
  constructor() {
    super();
  }

  getAllGame() {
    return [...this.store.entries()].map(([_, game]) => game.public);
  }
}

export default GameSession;
