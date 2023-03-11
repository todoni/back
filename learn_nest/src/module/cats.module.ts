import { Global, Module } from '@nestjs/common';
import { CatsController } from 'src/controller/cat.controller';
import { CatsService } from 'src/service/cat.service';

@Global()
@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
