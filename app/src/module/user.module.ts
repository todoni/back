import { Module } from '@nestjs/common';

import { UserController } from '@controller/user.controller';
import { UserService } from '@service/user.service';
import repositories from '@util/repository';

@Module({
  controllers: [UserController],
  providers: [UserService, ...repositories],
  exports: [UserService],
})
export class UserModule {}
