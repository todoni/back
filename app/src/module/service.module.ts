import { Module } from '@nestjs/common';

import ChatService from '@service/chat.service';
import EncryptionService from '@service/encryption.service';

@Module({
  providers: [ChatService, EncryptionService],
})
class ServiceModule {}

export default ServiceModule;
