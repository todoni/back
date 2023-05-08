import { PassportStrategy } from '@nestjs/passport';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { User } from '@entity/user.entity';
import { UserService } from '@service/user.service';
import { AuthService } from '@service/auth.service';
import ExceptionMessage from '@dto/socket/exception.message';
import ClientException from '@exception/client.exception';

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
      if (req['firstAccess'] === true) {
        await this.authService.expireFirstAccess(req['id']);
      }
      throw new ClientException(
        ExceptionMessage.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.userService.findByUserId(req['id']);
    // if (user.firstAccess === true) {
    //   await this.userService.firstAccess(user);
    // }

    return user;
  }
}
