import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';

import { Request, Response } from 'express';

import { HttpCode, Redirect } from '@nestjs/common';
import { JwtAuthGuard } from '@src/guard/jwt.guard';
import { AuthService } from '@src/service/auth.service';
import { AuthResponseDto } from 'src/dto/auth.dto';
import { FtAuthGuard } from 'src/guard/ft.guard';
import { TokenInterceptor } from '@src/interceptor/token.interceptor';

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
  @UseInterceptors(TokenInterceptor)
  async callback(@Query('code') query: string): Promise<AuthResponseDto> {
    console.log('Enter callback controller!');
    return { status: 200, message: 'OK' };
  }
}
