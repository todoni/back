import {
  WebSocketGateway,
  GatewayMetadata,
  OnGatewayConnection,
  WebSocketServer,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

import ClientSocket from '@dto/client.socket';
import UserSocketState from '@dto/user/user.socket.state';

export const GatewayInjector = (namespace: string): ClassDecorator => {
  const port = 4000;
  const options: GatewayMetadata = {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    namespace,
  };

  console.log(port, typeof port);
  return WebSocketGateway(port, options);
};

/**
 * todo:
 *   - Global Error Filter 추가
 *   - 소켓 Event 별 권한 예외처리 Interceptor 추가
 */

class BaseGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: ClientSocket) {
    /**
     * todo:
     *   - Access token 검사 로직 추가
     *   - Client 세팅 로직 추가
     *   - 현존하는 방, 유저 등 데이터 반환 로직 추가
     */
    client.join(client.id);
    this.changeState(client, UserSocketState.ONLINE);
  }

  handleDisconnect(client: ClientSocket) {
    this.changeState(client, UserSocketState.OFFLINE);
  }

  changeState(client: ClientSocket, status: UserSocketState) {
    this.server.except(client.id).emit('broadcast:user:changeStatus', status);
  }
}

export default BaseGateway;
