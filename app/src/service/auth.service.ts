import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '@service/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async getJwtToken(name: string, id: number) {
    const payload = { name: name, id: id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async expireFirstAccess(id: number) {
    const user = await this.userService.findByUserId(id);

    if (user.firstAccess === true)
      await this.userService.deleteUserByEntity(user);
  }
}
