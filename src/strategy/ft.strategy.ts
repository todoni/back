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
    done: any,
  ): Promise<any> {
    /*const user = await this.userService.findUserByUsername(profile['username']);

    if (!user) {
      const new_user = profile;
      return {
        provider: 'google',
        providerId: new_user.id,
        name: new_user.name.givenName,
        email: new_user.emails[0].value,
      };*/
    const { id, name, emails, photos } = profile;
    const user = {
      provider: 'google',
      providerId: id,
      name: name,
      email: emails[0].value,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}
