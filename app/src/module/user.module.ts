import { Module } from '@nestjs/common';

import { UserController } from '@controller/user.controller';
import { UserService } from '@service/user.service';
import repositories from '@util/repository';
import SessionModule from './session.module';
import UserSession from '@session/user.session';

@Module({
  imports: [SessionModule],
  controllers: [UserController],
  providers: [UserService, UserSession, ...repositories],
  exports: [UserService],
})
export class UserModule {}
