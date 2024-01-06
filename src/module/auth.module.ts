import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from '@controller/auth.controller';
import { TokenInterceptor } from '@interceptor/token.interceptor';
import ServiceModule from '@module/service.module';
import { UserModule } from '@module/user.module';
import { AuthService } from '@service/auth.service';
import { UserService } from '@service/user.service';
import UserSession from '@session/user.session';
import { GoogleStrategy } from '@strategy/ft.strategy';
import repositories from '@util/repository';
import SessionModule from './session.module';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          algorithm: configService.get('JWT_ALGORITHM'),
          expiresIn: configService.get<string>('JWT_EXPIRED_IN'),
        },
      }),
    }),
    UserModule,
    SessionModule,
    ServiceModule,
  ],
  controllers: [AuthController],
  providers: [
    TokenInterceptor,
    AuthService,
    UserService,
    UserSession,
    ConfigService,
    GoogleStrategy,
    ...repositories,
  ],
  exports: [AuthService, TokenInterceptor],
})
export class AuthModule {}
