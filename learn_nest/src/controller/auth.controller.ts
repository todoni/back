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
import { AuthResponseDto } from 'src/dto/auth.dto';
import { FtAuthGuard } from 'src/guard/ft.guard';

@Controller('auth')
export class AuthController {
  @Get('login')
  @UseGuards(FtAuthGuard)
  login(): AuthResponseDto {
    return { status: 200, message: 'OK' };
  }

  @Get('test')
  @UseGuards(FtAuthGuard)
  async test(@Req() req): Promise<any> {
    return req;
  }
}
