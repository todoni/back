import { Module } from '@nestjs/common';

import UserGateway from '@gateway/user.gateway';
import ChatGateway from '@gateway/chat.gateway';
import GameGateway from '@gateway/game.gateway';

@Module({
  providers: [UserGateway, ChatGateway, GameGateway],
})
class GatewayModule {}

export default GatewayModule;
