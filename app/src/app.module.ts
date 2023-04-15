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
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './module/user.module';
import UserRepository from './repository/user.repository';
import FriendRepository from './repository/friend.repository';
import BlockRepository from './repository/block.repository';
import GameLogRepository from './repository/game_log.repository';
import AchievementRepository from './repository/achievement.repository';
import UserAchievementRepository from './repository/user_achievement.repository';
import { TestModule } from './module/test.moule';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    JwtModule,
    UserModule,
    TestModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
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
