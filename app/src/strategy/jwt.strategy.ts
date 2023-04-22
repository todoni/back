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
        (request) => request.cookies.token,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(req: Request, payload: any): Promise<User> {
    const now = Date.parse(Date()) / 1000;

    if (now > req['exp']) {
      if (req['firstAccess'] == true) {
        await this.authService.expireFirstAccess(req['id']);
      }
      throw new UnauthorizedException();
    }

    return await this.userService.findByUserId(req['id']);
  }
}
