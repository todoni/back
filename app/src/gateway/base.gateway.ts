import {
  WebSocketGateway,
  GatewayMetadata,
  OnGatewayConnection,
  WebSocketServer,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';

import ClientSocket, { IC_TYPE } from '@dto/socket/client.socket';
import UserSocketState from '@dto/user/user.socket.state';
import { SocketGlobalFilter } from '@exception/socket.global.filter';
import SocketSession from '@session/socket.session';

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

  return WebSocketGateway(port, options);
};

/**
 * todo:
 *   - Global Error Filter 추가
 *   - 소켓 Event 별 권한 예외처리 Interceptor 추가
 */

@UseFilters(SocketGlobalFilter)
@UsePipes(new ValidationPipe())
class BaseGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  protected server: Server;
  protected socketSession = new SocketSession();

  handleConnection(client: ClientSocket) {
    /**
     * todo:
     *   - Access token 검사 로직 추가
     *   - Client 세팅 로직 추가
     *   - 현존하는 방, 유저 등 데이터 반환 로직 추가
     */
    const userId = 1;
    client.set(IC_TYPE.USER, userId);
    this.socketSession.set(userId, client);
    this.changeState(client, UserSocketState.ONLINE);
  }

  handleDisconnect(client: ClientSocket) {
    client.clear(IC_TYPE.USER);
    this.socketSession.delete(client.user.id);
    this.changeState(client, UserSocketState.OFFLINE);
  }

  changeState(client: ClientSocket, state: UserSocketState) {
    client.state = state;
    this.server.emit('broadcast:user:changeStatus', {
      userId: client.user.id,
      state: client.state,
    });
  }
}

export default BaseGateway;
