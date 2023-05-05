import ClientSocket from '@dto/socket/client.socket';
import BaseSession from '@session/base.session';

class SocketSession extends BaseSession<ClientSocket> {
  constructor() {
    super();
  }
}

export default SocketSession;
