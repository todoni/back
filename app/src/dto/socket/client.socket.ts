import { Socket } from 'socket.io';

import UserSocketState from '@dto/user/user.socket.state';

export class IdentityContiguration {
  id: number;
  room: string;
}

export enum IC_TYPE {
  USER = 'user',
  CHAT = 'chat',
  GAME = 'game',
}

class ClientSocket extends Socket {
  user: IdentityContiguration;
  chat: IdentityContiguration;
  game: IdentityContiguration;
  state: UserSocketState;

  set: Function;
  clear: Function;
}

export default ClientSocket;
