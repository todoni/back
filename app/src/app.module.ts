import { Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppService } from './service/app.service';
import { MiddlewareConsumer } from '@nestjs/common';
import { logger, LoggerMiddleware } from './middleware/logger.middleware';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { envConfig } from './config/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './module/auth.module';
import { AuthController } from './controller/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './module/user.module';
import { TestModule } from './module/test.moule';
import { JwtModule } from '@nestjs/jwt';
import entities from './util/entity';

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
      // validationSchema: envValidation(),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('dbConfig.host'),
        port: configService.get<number>('dbConfig.port'),
        username: configService.get<string>('dbConfig.name'),
        password: configService.get<string>('dbConfig.password'),
        database: configService.get<string>('dbConfig.dbname'),
        entities: [...entities],
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
