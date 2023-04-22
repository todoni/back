import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from 'src/controller/auth.controller';
import { FtStrategy } from 'src/strategy/ft.strategy';
import repositories from 'src/util/repository';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from '@src/strategy/jwt.strategy';
import { UserModule } from './user.module';
import { AuthService } from '@src/service/auth.service';
import { TokenInterceptor } from '@src/interceptor/token.interceptor';
import { Algorithm } from 'node_modules/@types/jsonwebtoken/index';
import { UserService } from '@src/service/user.service';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          algorithm: configService.get<Algorithm>('JWT_ALGORITHM'),
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
