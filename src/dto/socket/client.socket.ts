import { Socket } from 'socket.io';

import UserSocketState from '@dto/user/user.socket.state';

export class IdentityContiguration {
  id: number;
  room: string;
}

export class ChatConfiguration extends IdentityContiguration {
  isAdmin: boolean;
  isOwner: boolean;
}

export class GameConfiguration extends IdentityContiguration {
  isOwner: boolean;
}

export enum IC_TYPE {
  USER = 'user',
  CHAT = 'chat',
  GAME = 'game',
}

class ClientSocket extends Socket {
  user: IdentityContiguration;
  chat: ChatConfiguration;
  game: GameConfiguration;
  state: UserSocketState;

  set: Function;
  clear: Function;
}

export default ClientSocket;
