import { Module } from '@nestjs/common';

import ChatSession from '@session/chat.session';
import GameSession from '@session/game.session';
import UserSession from '@session/user.session';

@Module({
  providers: [ChatSession, GameSession, UserSession],
  exports: [ChatSession, GameSession, UserSession],
})
class SessionModule {}

export default SessionModule;
