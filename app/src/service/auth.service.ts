import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@src/entity/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async tokenTest(name: string, id: number) {
    console.log(name);
    console.log(id);
    console.log(this.jwtService);
    const payload = { username: name, sub: id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
