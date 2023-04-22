import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserModule } from '@module/user.module';
import { AuthController } from '@controller/auth.controller';
import { FtStrategy } from '@strategy/ft.strategy';
import { JwtStrategy } from '@strategy/jwt.strategy';
import { AuthService } from '@service/auth.service';
import { UserService } from '@service/user.service';
import { TokenInterceptor } from '@interceptor/token.interceptor';
import repositories from '@util/repository';

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
  ],
  controllers: [AuthController],
  providers: [
    TokenInterceptor,
    AuthService,
    UserService,
    JwtStrategy,
    ConfigService,
    FtStrategy,
    ...repositories,
  ],
  exports: [AuthService, TokenInterceptor],
})
export class AuthModule {}
