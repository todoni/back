import { Injectable } from '@nestjs/common';

import BaseSession from '@session/base.session';
import UserSessionDto, { UserInfoDto } from '@dto/user/user.session.dto';

@Injectable()
class UserSession extends BaseSession<UserSessionDto> {
  constructor() {
    super();
  }

  getUserInfo(userId: number): UserInfoDto {
    const user = this.get(userId);
    return {
      userId: user.userId,
      username: user.username,
      state: user.state,
      profile: user.profile,
    };
  }

  getAllUser() {
    return [...this.store.entries()].map(([_, userSessionDto]) => ({
      userId: userSessionDto.userId,
      username: userSessionDto.username,
      state: userSessionDto.state,
      profile: userSessionDto.profile,
    }));
  }
}

export default UserSession;
