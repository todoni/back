import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@src/guard/jwt.guard';
import { UserDetailDto } from 'src/dto/user.dto';
import { User } from 'src/entity/user.entity';
import { UserService } from 'src/service/user.service';
import { Req } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('add-new')
  test(): string {
    this.userService.testAddUser();
    return 'test';
  }

  @Get('detail')
  @UseGuards(JwtAuthGuard)
  async getMyDetail(@Req() req): Promise<object> {
    const user: UserDetailDto = await this.userService.getUserDetail(req.user);
    if (user == null) {
      return { status: 400, message: 'shit' };
    }
    return user;
  }

  @Get('detail/:id')
  @UseGuards(JwtAuthGuard)
  async getUserDetailById(@Param('id') id: number): Promise<object> {
    const user: UserDetailDto = await this.userService.getUserDetailById(id);
    if (user == null) {
      return { status: 400, message: 'shit' };
    }
    console.log(user);
    return user;
  }

  //Todo: JWT적용
  //Todo: cookie 적용
  @Get('nickname')
  async checkSameNick(@Query('name') name: string): Promise<object> {
    const hasNick: boolean = await this.userService.hasNickname(name);
    if (hasNick) {
      return { status: 400, message: 'Already has nick ' + name };
    }
    return { status: 200, message: 'You can use nick ' + name };
  }
}
