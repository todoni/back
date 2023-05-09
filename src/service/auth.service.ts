import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '@service/user.service';
import ExceptionMessage from '@dto/socket/exception.message';
import ClientException from '@exception/client.exception';
import { User } from '@entity/user.entity';
import { TokenPayloadDto, TokenType } from '@dto/auth/token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async parseToken(cookies: string) {
    if (!cookies)
      throw new ClientException(
        ExceptionMessage.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );

    const token = cookies
      .split('; ')
      .find((cookie) => {
        const [key, _] = cookie.split('=');
        if (key === 'token') return true;
      })
      .split('=')[1];
    await this.jwtService
      .verifyAsync(token, {
        secret: this.configService.get('authConfig.jwt'),
      })
      .catch(() => {
        throw new ClientException(
          ExceptionMessage.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      });

    return this.decodeToken(token);
  }

  async getJwtToken(
    id: number,
    name: string,
    type: TokenType,
    expiresIn?: string,
  ) {
    const payload: TokenPayloadDto = { id: id, name: name, type: type };
    return this.jwtService.sign(payload, { expiresIn: expiresIn });
  }

  async access(user: User) {
    await this.userService.firstAccess(user);
  }

  decodeToken(token: string) {
    return this.jwtService.decode(token);
  }

  async expireFirstAccess(id: number) {
    const user = await this.userService.findByUserId(id);

    if (user.firstAccess === true)
      await this.userService.deleteUserByEntity(user);
  }
}
