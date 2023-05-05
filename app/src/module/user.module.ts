import { Module } from '@nestjs/common';

import { UserController } from '@controller/user.controller';
import { UserService } from '@service/user.service';
import repositories from '@util/repository';
import SessionModule from './session.module';
import UserSession from '@session/user.session';
import ServiceModule from '@module/service.module';
import EncryptionService from '@service/encryption.service';

@Module({
  imports: [SessionModule, ServiceModule],
  controllers: [UserController],
  providers: [UserService, UserSession, EncryptionService, ...repositories],
  exports: [UserService],
})
export class UserModule {}
