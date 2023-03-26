import { Controller, Get, Param } from '@nestjs/common';
import { UserDetailDto } from 'src/dto/user.dto';
import { User } from 'src/entity/user.entity';
import { UserService } from 'src/service/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('test/add-new')
  test(): string {
    this.userService.testAddUser();
    return 'test';
  }

  @Get('test/get/:id')
  async getFirstUser(@Param(':id') id: number): Promise<string> {
    const user: User = await this.userService.testGetUser(id);
    if (user == null) {
      return 'shit';
    }
    console.log(user);
    return `id : ${user.id}, name: ${user.name}`;
  }
}
