import { Injectable } from '@nestjs/common';

import BaseSession from '@session/base.session';

interface UserSessionDto {}

@Injectable()
class UserSession extends BaseSession<UserSessionDto> {}

export default UserSession;
