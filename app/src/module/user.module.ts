import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from 'src/controller/auth.controller';
import { UserController } from 'src/controller/user.controller';
import { UserService } from 'src/service/user.service';
import { FtStrategy } from 'src/strategy/ft.strategy';

@Module({
  //   imports: [PassportModule.register({ session: true })],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
