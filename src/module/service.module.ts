import { Module } from '@nestjs/common';

import SessionModule from '@module/session.module';
import ChatService from '@service/chat.service';
import EncryptionService from '@service/encryption.service';
import ImageService from '@service/image.service';
import GameService from '@service/game.service';
import GameLogRepository from '@repository/game_log.repository';

@Module({
  imports: [SessionModule],
  providers: [
    ChatService,
    GameService,
    EncryptionService,
    ImageService,
    GameLogRepository,
  ],
  exports: [ChatService, GameService, EncryptionService, ImageService],
})
class ServiceModule {}

export default ServiceModule;
