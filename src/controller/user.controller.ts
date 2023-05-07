import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';

import { JwtAuthGuard } from '@src/guard/jwt.guard';
import { UserDetailDto } from '@dto/user/user.dto';
import { UserService } from '@service/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('detail')
  @UseGuards(JwtAuthGuard)
  async getMyDetail(@Req() req): Promise<object> {
    const user: UserDetailDto = await this.userService.getUserDetail(req.user);
    return user;
  }

  @Get('detail/:id')
  @UseGuards(JwtAuthGuard)
  async getUserDetailById(@Param('id') id: number): Promise<object> {
    const user: UserDetailDto = await this.userService.getUserDetailById(id);
    return user;
  }
}
