import { Module } from '@nestjs/common';

import { UserModule } from '@module/user.module';
import UserGateway from '@gateway/user.gateway';
import ChatGateway from '@gateway/chat.gateway';
import GameGateway from '@gateway/game.gateway';
import ServiceModule from './service.module';

@Module({
  imports: [ServiceModule, UserModule],
  providers: [UserGateway, ChatGateway, GameGateway],
})
class GatewayModule {}

export default GatewayModule;
