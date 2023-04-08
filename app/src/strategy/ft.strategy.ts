import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
// import { ConfigService } from '@nestjs/config';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, 'ft') {
  constructor(private readonly configService: ConfigService) {
    super({
      // clientID: configService.get('ftConfig.uid'),
      // clientSecret: configService.get('ftConfig.secret'),
      // callbackURL: configService.get('ftConfig.redirectUri'),
      clientID: configService.get('CLIENT_ID_42'),
      clientSecret: configService.get('CLIENT_SECRET_42'),
      callbackURL: configService.get('CALL_BACK_URL'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    console.log('validate function start');
    console.log(profile['username']);
    console.log(profile._json['id']);
    console.log(profile._json['login']);
    console.log(profile._json['email']);
    console.log('validate function ends');
    // console.log('@###@@@@@@######################');
    // console.log(profile._json);
    // const user = await this.userService.findUserByUsername(profile['username']);

    // if (!user) {
    //   return await this.userService.createUser({
    //     id: profile._json['id'],
    //     username: profile._json['login'],
    //     displayName: profile._json['login'],
    //     email: profile._json['email'],
    //     imagePath: profile._json['image']['link'],
    //   });
    // }
    let a: string = 'aa';
    return a;
  }
}
