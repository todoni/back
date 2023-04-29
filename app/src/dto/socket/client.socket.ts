import { Socket } from 'socket.io';

import UserSocketState from '@dto/user/user.socket.state';

interface IdentityContiguration {
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

  set(type: IC_TYPE, value: number) {
    this[type].id = value;
    this[type].room = `room:${type}:${value}`;
    this.join(this[type].room);
  }

  clear(type: IC_TYPE) {
    this.leave(this[type].room);
    this[type].id = undefined;
    this[type].room = undefined;
  }
}

export default ClientSocket;
