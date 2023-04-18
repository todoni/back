import { Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppService } from './service/app.service';
import { MiddlewareConsumer } from '@nestjs/common';
import { logger, LoggerMiddleware } from './middleware/logger.middleware';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { envConfig, envValidation } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './module/auth.module';
import { AuthController } from './controller/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [envConfig],
      validationSchema: envValidation(),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('dbConfig.host'),
        port: configService.get('dbConfig.port'),
        username: configService.get('dbConfig.username'),
        password: configService.get('dbConfig.password'),
        database: configService.get('dbConfig.name'),
      }),
    }),
  ],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //미들웨어
    // consumer.apply(LoggerMiddleware).forRoutes(AuthController);
  }
}

/**
 *  TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('dbConfig.host'),
        port: configService.get('dbConfig.port'),
        username: configService.get('dbConfig.username'),
        password: configService.get('dbConfig.password'),
        database: configService.get('dbConfig.name'),
        charset: 'utf8mb4_general_ci',
        timezone: '+09:00',
        synchronize: true, // todo: production environ = false
        logging: ['error'],
        logger: 'file',
        maxQueryExecutionTime: 2000,
        entities: [...entities],
      }),
    }),
 */
