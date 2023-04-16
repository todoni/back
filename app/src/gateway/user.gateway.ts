import { ConnectedSocket, SubscribeMessage } from '@nestjs/websockets';

import BaseGateway, { GatewayInjector } from '@gateway/base.gateway';
import ClientSocket from '@dto/client.socket';

@GatewayInjector('user')
class UserGateway extends BaseGateway {
  /**
   * B - Display Name 수정
   * B - 이미지 수정
   * S - Follow
   * S - UnFollow
   */

  constructor() {
    super();
  }

  /* ================================= */
  /*             Broadcast             */
  /* ================================= */

  @SubscribeMessage('updateDisplayName')
  updateDisplayName(@ConnectedSocket() client: ClientSocket) {}

  @SubscribeMessage('updateImage')
  updateImage(@ConnectedSocket() client: ClientSocket) {}

  /* ============================== */
  /*             Single             */
  /* ============================== */

  @SubscribeMessage('follorUser')
  follorUser(@ConnectedSocket() client: ClientSocket) {}

  @SubscribeMessage('unFollorUser')
  unFollorUser(@ConnectedSocket() client: ClientSocket) {}
}

export default UserGateway;
