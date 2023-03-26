import { Controller, Get, Param } from '@nestjs/common';
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
    const user: User = await this.userService.testGetUser(id);
    if (user == null) {
      return { status: 400, message: 'shit' };
    }
    console.log(user);
    return user;
  }
}
