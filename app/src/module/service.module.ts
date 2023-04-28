import { Module } from '@nestjs/common';

import ChatService from '@service/chat.service';
import EncryptionService from '@service/encryption.service';
import ImageService from '@service/image.service';

@Module({
  providers: [ChatService, EncryptionService, ImageService],
})
class ServiceModule {}

export default ServiceModule;
