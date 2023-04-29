import { Module } from '@nestjs/common';

import SessionModule from '@module/session.module';
import ChatService from '@service/chat.service';
import EncryptionService from '@service/encryption.service';
import ImageService from '@service/image.service';
import GameService from '@service/game.service';

@Module({
  imports: [SessionModule],
  providers: [ChatService, GameService, EncryptionService, ImageService],
  exports: [ChatService, GameService, EncryptionService, ImageService],
})
class ServiceModule {}

export default ServiceModule;
