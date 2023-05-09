import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  UseInterceptors,
  Post,
  Patch,
  Body,
  Param,
} from '@nestjs/common';
import { Response } from 'express';

import { JwtAuthGuard } from '@guard/jwt.guard';
import { FtAuthGuard } from '@guard/ft.guard';
import { AuthService } from '@service/auth.service';
import { UserService } from '@service/user.service';
import { AuthResponseDto } from '@dto/auth/auth.dto';
import { TokenInterceptor } from '@interceptor/token.interceptor';
import { User } from '@entity/user.entity';
import { ConfigService } from '@nestjs/config';
import { TokenType } from '@dto/auth/token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

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
  async checkTwoFactor(@Req() req, @Body() body) {
    await this.userService.checkTwoFactor(req.user, body.code);
  }

  @Patch('two-factor')
  @UseGuards(JwtAuthGuard)
  async updateTwoFactor(@Req() req, @Body() body) {
    await this.userService.updateTwoFactor(req.user, body.code);
  }

  @Get('first-access')
  @UseGuards(JwtAuthGuard)
  async access(@Req() req) {
    await this.authService.access(req.user);
  }

  @Get('test/{userId}')
  @UseInterceptors(TokenInterceptor)
  async test(@Req() req, @Param() param) {
    const userId = parseInt(param, 10);
    req.user = await this.userService.findByUserId(userId);
  }
}
