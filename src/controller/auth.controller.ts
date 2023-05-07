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
import { AuthResponseDto } from '@dto/auth.dto';
import { TokenInterceptor } from '@interceptor/token.interceptor';
import { User } from '@entity/user.entity';
import { ConfigService } from '@nestjs/config';

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
    if (!user.twoFactor)
      return { status: 302, message: 'OK', redirectPath: 'lobby' };
    // todo: two-factor 페이지 구현되면, redirectPath 설정
    else return { status: 200, message: '2단계 인증 필요', twoFactor: true };
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req, @Res() res: Response): Promise<any> {
    const user = req.user;
    const tokenResult = await this.authService.getJwtToken(user.name, user.id);
    res.cookie('token', tokenResult.access_token, {
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

  @Get('test/{userId}')
  @UseInterceptors(TokenInterceptor)
  async test(@Req() req, @Param() param) {
    const userId = parseInt(param, 10);
    req.user = await this.userService.findByUserId(userId);
  }
}
