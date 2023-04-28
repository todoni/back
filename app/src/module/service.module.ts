import { Module } from '@nestjs/common';

import SessionModule from '@module/session.module';
import ChatService from '@service/chat.service';
import EncryptionService from '@service/encryption.service';
import ImageService from '@service/image.service';

@Module({
  imports: [SessionModule],
  providers: [ChatService, EncryptionService, ImageService],
  exports: [ChatService, EncryptionService, ImageService],
})
class ServiceModule {}

export default ServiceModule;
