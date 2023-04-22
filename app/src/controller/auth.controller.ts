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
  Res,
} from '@nestjs/common';

import { HttpCode, Redirect } from '@nestjs/common';
import { JwtAuthGuard } from '@src/guard/jwt.guard';
import { AuthService } from '@src/service/auth.service';
import { AuthResponseDto } from 'src/dto/auth.dto';
import { FtAuthGuard } from 'src/guard/ft.guard';
import { TokenInterceptor } from '@src/interceptor/token.interceptor';
import { User } from '@entity/user.entity';
import { UserService } from '@src/service/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

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
    return { status: 200, message: 'OK' };
  }

  /// 클라이언트의 쿠키가 올바른지 확인용 (개발용)
  @Get('/token')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TokenInterceptor)
  checkToken(): AuthResponseDto {
    return { status: 200, message: 'OK' };
  }

  /// 테스트 계정인 "name1"에 대한 토큰 발급용.
  @Get('/test')
  @UseInterceptors(TokenInterceptor)
  async testToken(@Req() req): Promise<any> {
    const user: User = await this.userService.findUserByUsername('name1', true);

    if (user == null) {
      return {
        status: 404,
        message: 'init을 안하셨군요. 테스트하려면 /test/init부터...',
      };
    }

    req.user = user;

    return { status: 200, message: 'OK' };
  }
}
