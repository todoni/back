import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';

import { Res, HttpCode, Redirect } from '@nestjs/common';
import { JwtAuthGuard } from '@src/guard/jwt.guard';
import { AuthService } from '@src/service/auth.service';
import { query } from 'express';
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

  @Get('login/callback')
  @UseGuards(FtAuthGuard)
  async callback(
    @Query('code') query: string,
    @Req() req,
  ): Promise<AuthResponseDto> {
    console.log('Enter callback controller!');
    return { status: 200, message: 'OK' };
  }

  @Get('token-test')
  async tokenTest(
    @Query('name') name: string,
    @Query('id') id: number,
    // @Res() res: Response,
  ): Promise<any> {
    const result = await this.authService.tokenTest(name, id);

    // res.headers[]
    return result;
  }
}
