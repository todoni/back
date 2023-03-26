import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from 'src/controller/auth.controller';
import { FtStrategy } from 'src/strategy/ft.strategy';
import repositories from 'src/util/repository';

@Module({
  imports: [PassportModule.register({ session: true })],
  controllers: [AuthController],
  providers: [FtStrategy, ...repositories],
})
export class AuthModule {}
