import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

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

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_OAUTH_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
    console.log('google client id', configService.get('GOOGLE_CLIENT_ID'));
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    const user = await this.userService.findUserByUsername(
      profile._json['given_name'],
    );
    if (!user) {
      return await this.userService.createUser({
        id: Math.floor(Number(profile['id']) / 1000000000000),
        name: profile._json['given_name'],
        nickname: profile['displayName'],
        twoFactor: '0000',
        profile: 'asdf',
        firstAccess: true,
      });
    }
    return user;
  }
}
