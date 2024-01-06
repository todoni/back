import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';

import { AuthResponseDto } from '@dto/auth/auth.dto';
import { TokenType } from '@dto/auth/token.dto';
import { User } from '@entity/user.entity';
import { FtAuthGuard, GoogleAuthGuard } from '@guard/ft.guard';
import { JwtAuthGuard } from '@guard/jwt.guard';
import { TokenInterceptor } from '@interceptor/token.interceptor';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@service/auth.service';
import { UserService } from '@service/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async toGoogleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req, @Res() res): Promise<AuthResponseDto> {
    //const user: User = req.user;
    const { user } = req;
    console.log('*******************************');
    return res.send(user);
  }

  @Get('login')
  @UseGuards(FtAuthGuard)
  login(): AuthResponseDto {
    return { status: 200, message: 'OK' };
  }

  @Get('login/callback')
  @UseGuards(FtAuthGuard)
  @UseInterceptors(TokenInterceptor)
  async callback(@Req() req): Promise<AuthResponseDto> {
    const user: User = req.user;
    if (user.firstAccess)
      return {
        status: 302,
        message: 'OK',
        redirectPath: 'signup',
        type: TokenType.FIRST_ACCESS,
      };
    else if (!user.twoFactor)
      return {
        status: 302,
        message: 'OK',
        redirectPath: 'lobby',
        type: TokenType.ACCESS_KEY,
      };
    else
      return {
        status: 302,
        message: '2단계 인증 필요',
        redirectPath: 'two-factor',
        type: TokenType.TWO_FACTOR,
        expiresIn: '5m', // todo: 수정 필요
      };
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Res() res: Response): Promise<any> {
    res.cookie('token', '', {
      httpOnly: true,
      maxAge: 0,
      domain: this.configService.get('serverConfig.url'),
    });
    return res.status(200).json({ status: 200, message: 'ok' });
  }

  @Post('two-factor')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TokenInterceptor)
  async checkTwoFactor(@Req() req, @Body() body) {
    await this.userService.checkTwoFactor(req.user, body.code);
    return { status: 200, message: 'OK', type: TokenType.ACCESS_KEY };
  }

  @Patch('two-factor')
  @UseGuards(JwtAuthGuard)
  async updateTwoFactor(@Req() req, @Body() body) {
    await this.userService.updateTwoFactor(req.user, body.code);
  }

  @Post('signup')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TokenInterceptor)
  async signup(@Req() req, @Body() body) {
    console.log(body);
    await this.userService.signup(req.user, body.nickname, body.image);
    return { status: 200, message: 'OK', type: TokenType.ACCESS_KEY };
  }
}
