import { Injectable } from '@nestjs/common';

import BaseSession from '@session/base.session';

interface GameSessionDto {}

@Injectable()
class GameSession extends BaseSession<GameSessionDto> {
  constructor() {
    super();
  }
}

export default GameSession;
