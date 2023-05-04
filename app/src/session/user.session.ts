import { Injectable } from '@nestjs/common';

import BaseSession from '@session/base.session';
import UserSessionDto from '@dto/user/user.session.dto';

@Injectable()
class UserSession extends BaseSession<UserSessionDto> {
  constructor() {
    super();
  }

  getAllUser() {
    return [...this.store.entries()].map(([_, userSessionDto]) => ({
      userId: userSessionDto.userId,
      username: userSessionDto.username,
      state: userSessionDto.state,
    }));
  }
}

export default UserSession;
