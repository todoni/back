import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { User } from '@entity/user.entity';
import { UserService } from '@service/user.service';
import { AuthService } from '@service/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          console.log(request.cookies);
          return request.cookies.token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(req: Request, payload: any): Promise<User> {
    const now = Date.parse(Date()) / 1000;

    if (now > req['exp']) {
      if (req['firstAccess'] === true) {
        await this.authService.expireFirstAccess(req['id']);
      }
      throw new UnauthorizedException();
    }

    //만료되지는 않은 토큰인데, 찾아보니 디비에 저장된 유저이고, firstAccess가 true이면 false로 처리
    const user = await this.userService.findByUserId(req['id']);
    if (user.firstAccess === true) {
      await this.userService.firstAccess(user);
    }

    return user;
  }
}
