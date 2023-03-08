import { Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { AppService } from './service/app.service';
import { MiddlewareConsumer } from '@nestjs/common';
import { CatsController } from './controller/cat.controller';
import { CatsService } from './service/cat.service';
import { CatsModule } from './module/cats.module';
import { logger, LoggerMiddleware } from './middleware/logger.middleware';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filter/http-exception.filter';

@Module({
  imports: [CatsModule],
  controllers: [AppController],
  providers: [AppService],
  // providers: [AppService, {provide: APP_FILTER , useClass: HttpExceptionFilter}],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    //미들웨어
    consumer
      .apply(LoggerMiddleware)
      // .exclude({ path: 'cats', method: RequestMethod.GET }, { path: 'cats', method: RequestMethod.POST }, 'cats/(.*)')
      // .forRoutes('cats/test');
      .forRoutes(CatsController);
      // .forRoutes('cats');
      // .forRoutes({path: "cats", method: RequestMethod.GET});
    
    //함수형 미들웨어
    // consumer.apply(logger).forRoutes(CatsController);
  }

  
  
}
