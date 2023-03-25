import { Controller, Get } from '@nestjs/common';
import { UserDetailDto } from 'src/dto/user.dto';

@Controller('user')
export class UserController {
  @Get('detail')
  userDetail(): UserDetailDto {
    return {
      name: 'name',
      nickname: 'nick',
      twFactor: true,
      twFactorUid: '',
      profile: '',
      level: 0,
      winPercent: 2,
      userLogs: [],
      achivements: [],
    };
  }
}
