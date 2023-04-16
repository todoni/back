import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from 'src/controller/auth.controller';
import { TestController } from 'src/controller/test.controller';
import { TestService } from '@src/service/test.service';
import { FtStrategy } from 'src/strategy/ft.strategy';
import repositories from 'src/util/repository';

@Module({
  imports: [PassportModule.register({ session: true })],
  controllers: [TestController],
  providers: [TestService, ...repositories],
  exports: [TestService],
})
export class TestModule {}
