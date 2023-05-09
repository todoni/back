import { PassportStrategy } from '@nestjs/passport';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { User } from '@entity/user.entity';
import { UserService } from '@service/user.service';
import { AuthService } from '@service/auth.service';
import { TokenPayloadDto, TokenType } from '@dto/auth/token.dto';
import EncryptionService from '@service/encryption.service';
import ClientException from '@exception/client.exception';
import ExceptionMessage from '@dto/socket/exception.message';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly encryptionService: EncryptionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => request.cookies.token,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, token: TokenPayloadDto): Promise<User> {
    if (
      (token.type === TokenType.TWO_FACTOR &&
        request.url !== '/v0/auth/two-factor') ||
      (token.type === TokenType.FIRST_ACCESS &&
        request.url !== '/v0/auth/signup')
    )
      throw new ClientException(
        ExceptionMessage.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );

    return await this.userService.findByUserId(token.id);
  }
}
