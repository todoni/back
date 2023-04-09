import { ExtractJwt, Strategy } from 'passport-jwt';
// import { Strategy } from 'passport-local';

import { PassportStrategy } from '@nestjs/passport';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { User } from '@entity/user.entity';
import { UserService } from '@src/service/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // jwtFromRequest: ExtractJwt.fromHeader('123'),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any): Promise<User> {
    const now = Date.parse(Date()) / 1000;

    console.log('payload:');
    console.log(payload);

    // if (
    //   (req.url !== '/auth/login' && payload.type === 'sign') ||
    //   (req.url === '/auth/login' && payload.type !== 'sign')
    // ) {
    //   console.log(
    //     "req.url !== '/auth/login' && payload.type === 'sign' 여기로 들어옴",
    //   );
    //   throw new ForbiddenException();
    // }

    // if (req.url !== '/v0/auth/token' && now > payload.exp) {
    // //   if (req.url === '/v0/auth/login/access')
    // //     await this.authService.expireFirstAccess(payload.id);
    //   throw new UnauthorizedException();
    // }
    // if (
    //   req.url === '/v0/auth/token' &&
    //   req.headers['refresh_token'] !==
    //     (await this.redisService.get(payload.id.toString()))
    // ) {
    //   throw new UnauthorizedException();
    // }

    return await this.userService.findByUserId(payload.sub);
  }
}
