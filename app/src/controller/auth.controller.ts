import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  UseGuards,
  Req,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';

// import { Req, Res } from 'express';

import { HttpCode, Redirect } from '@nestjs/common';
import { JwtAuthGuard } from '@src/guard/jwt.guard';
import { AuthService } from '@src/service/auth.service';
import { AuthResponseDto } from 'src/dto/auth.dto';
import { FtAuthGuard } from 'src/guard/ft.guard';
import { TokenInterceptor } from '@src/interceptor/token.interceptor';
import { UserService } from '@src/service/user.service';

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
  async callback(@Req() req): Promise<AuthResponseDto> {
    console.log('Enter callback controller!');
    const user = req.user;

    return { status: 200, message: 'OK' };
  }

  @Get('/token')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TokenInterceptor)
  checkToken(): AuthResponseDto {
    return { status: 200, message: 'OK' };
  }

  @Get('/test')
  async testToken(): Promise<any> {
    return { token: await this.authService.getJwtToken('name1', 1) };
  }
}
