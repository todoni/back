import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@src/entity/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async getJwtToken(name: string, id: number) {
    const payload = { name: name, id: id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
