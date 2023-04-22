import {
  Controller,
  Get,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';

import { JwtAuthGuard } from '@guard/jwt.guard';
import { FtAuthGuard } from '@guard/ft.guard';
import { AuthService } from '@service/auth.service';
import { UserService } from '@service/user.service';
import { AuthResponseDto } from '@dto/auth.dto';
import { TokenInterceptor } from '@interceptor/token.interceptor';
import { User } from '@entity/user.entity';

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

    ///개발용이라 내부에서 throw 안햇습다
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
