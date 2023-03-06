import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { AppService } from './service/app.service';
import { MiddlewareConsumer } from '@nestjs/common';
import { CatsController } from './controller/cat.controller';
import { CatsService } from './service/cat.service';
import { CatsModule } from './module/cats.module';

@Module({
  imports: [CatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  
}
