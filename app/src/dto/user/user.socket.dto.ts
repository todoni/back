import UserSocketState from '@dto/user/user.socket.state';

export class UserInfoDto {
  userId: number;
  username: string;
  status: UserSocketState;
}

class UserSocketDto extends UserInfoDto {
  follows: Array<number>;
  blocks: Array<number>;
  room: string;
}

export default UserSocketDto;
