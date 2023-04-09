import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';

import { Request, Response } from 'express';

import { HttpCode, Redirect } from '@nestjs/common';
import { JwtAuthGuard } from '@src/guard/jwt.guard';
import { AuthService } from '@src/service/auth.service';
import { AuthResponseDto } from 'src/dto/auth.dto';
import { FtAuthGuard } from 'src/guard/ft.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @UseGuards(FtAuthGuard)
  login(): AuthResponseDto {
    console.log('Enter login controller!');
    return { status: 200, message: 'OK' };
  }

  //Todo: 성공 시 토큰도 함께 넘겨줘야함
  @Get('login/callback')
  @UseGuards(FtAuthGuard)
  async callback(
    @Query('code') query: string,
    @Req() req,
  ): Promise<AuthResponseDto> {
    console.log('Enter callback controller!');
    return { status: 200, message: 'OK' };
  }

  //Todo: 지우기~
  @Get('token-test')
  async tokenTest(
    @Query('name') name: string,
    @Query('id') id: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const result = await this.authService.tokenTest(name, id);

    res.status(HttpStatus.CREATED);
    res.setHeader('Authorization', 'Bearer' + result.access_token);
    res.cookie('jwt', result.access_token, {
      httpOnly: true,
      maxAge: 5 * 24 * 60 * 60 * 1000,
    });
    return res.send({ message: 'hi sohan' });
  }
}
