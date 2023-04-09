import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@src/guard/jwt.guard';
import { UserDetailDto } from 'src/dto/user.dto';
import { User } from 'src/entity/user.entity';
import { UserService } from 'src/service/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('add-new')
  test(): string {
    this.userService.testAddUser();
    return 'test';
  }

  @Get('get/:id')
  async getFirstUser(@Param('id') id: number): Promise<object> {
    const user: UserDetailDto = await this.userService.getUserDetail(id);
    if (user == null) {
      return { status: 400, message: 'shit' };
    }
    console.log(user);
    return user;
  }

  @Get('get/:id/token-test')
  @UseGuards(JwtAuthGuard)
  async tokenTest(@Param('id') id: number): Promise<object> {
    const user: UserDetailDto = await this.userService.getUserDetail(id);
    if (user == null) {
      return { status: 400, message: 'shit' };
    }
    console.log(user);
    return user;
  }

  @Get('nickname')
  async checkSameNick(@Query('name') name: string): Promise<object> {
    const hasNick: boolean = await this.userService.hasNickname(name);
    if (hasNick) {
      return { status: 400, message: 'Already has nick ' + name };
    }
    return { status: 200, message: 'You can use nick ' + name };
  }
}
