import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';

import { UserService } from '@service/user.service';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, 'ft') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: configService.get('ftConfig.uid'),
      clientSecret: configService.get('ftConfig.secret'),
      callbackURL: configService.get('ftConfig.redirectUri'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const user = await this.userService.findUserByUsername(profile['username']);

    if (!user) {
      return await this.userService.createUser({
        id: profile._json['id'],
        name: profile._json['login'],
        nickname: profile._json['login'],
        twoFactor: null,
        profile: profile._json['image']['link'],
        firstAccess: true,
      });
    }
    return user;
  }
}
