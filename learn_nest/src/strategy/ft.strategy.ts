import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
// import { ConfigService } from '@nestjs/config';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, 'ft') {
  constructor() {
    super({
      // clientID: configService.get('ftConfig.uid'),
      // clientSecret: configService.get('ftConfig.secret'),
      // callbackURL: configService.get('ftConfig.redirectUri'),
      clientID:
        'u-s4t2ud-9a5908ad6e514cf394a6f4c8912ed2b002476ef01b5e923bfde1ecd2e3896995',
      clientSecret:
        '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',
      callbackURL: 'https://www.naver.com',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const user = await this.userService.findUserByUsername(profile['username']);

    // if (!user) {
    //   return await this.userService.createUser({
    //     id: profile._json['id'],
    //     username: profile._json['login'],
    //     displayName: profile._json['login'],
    //     email: profile._json['email'],
    //     imagePath: profile._json['image']['link'],
    //   });
    // }

    return 'user';
  }
}
