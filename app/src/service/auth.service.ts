import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '@service/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  parseToken(cookies: string) {
    const token = cookies
      .split('; ')
      .find((cookie) => {
        const [key, _] = cookie.split('=');
        if (key === 'token') return true;
      })
      .split('=')[1];
    this.jwtService.verify(token, {
      secret: this.configService.get('authConfig.jwt'),
    });

    return this.decodeToken(token);
  }

  async getJwtToken(name: string, id: number) {
    const payload = { name: name, id: id };
    return { access_token: this.jwtService.sign(payload) };
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
