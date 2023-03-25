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
import { query } from 'express';
import { AuthResponseDto } from 'src/dto/auth.dto';
import { FtAuthGuard } from 'src/guard/ft.guard';

@Controller('auth')
export class AuthController {
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
}
