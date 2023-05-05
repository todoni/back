import UserSocketState from '@dto/user/user.socket.state';

export class UserInfoDto {
  userId: number;
  username: string;
  state: UserSocketState;
  profile: string;
}

class UserSessionDto extends UserInfoDto {
  follows: Array<number>;
  blocks: Array<number>;
  room: string;
}

export default UserSessionDto;
