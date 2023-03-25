import { Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { AppService } from './service/app.service';
import { MiddlewareConsumer } from '@nestjs/common';
import { logger, LoggerMiddleware } from './middleware/logger.middleware';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { typeOrmConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './module/auth.module';
import { AuthController } from './controller/auth.controller';
import { UserModule } from './module/user.module';

@Module({
  imports: [AuthModule, UserModule, TypeOrmModule.forRoot(typeOrmConfig)],
  controllers: [AppController],
  providers: [AppService],
  // providers: [AppService, {provide: APP_FILTER , useClass: HttpExceptionFilter}],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //미들웨어
    consumer.apply(LoggerMiddleware).forRoutes(AuthController, AppController);
    // .exclude({ path: 'cats', method: RequestMethod.GET }, { path: 'cats', method: RequestMethod.POST }, 'cats/(.*)')
    // .forRoutes('cats/test');
    //함수형 미들웨어
    // consumer.apply(logger).forRoutes(CatsController);
  }
}
