import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
} from '@nestjs/websockets';

import BaseGateway, { GatewayInjector } from '@gateway/base.gateway';
import ClientSocket from '@dto/client.socket';

@GatewayInjector('game')
class GameGateway extends BaseGateway {
  /**
   * == 게임방 ==
   * B - 생성
   * G - 참여
   * G - 나가기
   * G - 관전
   * S - 초대
   * == 게임중 ==
   * G - 게임 시작
   * G - 게임 종료
   * G - 공 움직이기
   */

  constructor() {
    super();
  }

  /* ================================= */
  /*             Broadcast             */
  /* ================================= */

  @SubscribeMessage('createGame')
  createGame(@ConnectedSocket() client: ClientSocket) {}

  /* ============================= */
  /*             Group             */
  /* ============================= */

  @SubscribeMessage('joinGame')
  joinGame(@ConnectedSocket() client: ClientSocket) {}

  @SubscribeMessage('watchGame')
  watchGame(@ConnectedSocket() client: ClientSocket) {}

  // todo: message로 받을 지 다시 생각
  // todo: 구현하면서 로직 다시 생각해보자
  @SubscribeMessage('startGame')
  startGame(@ConnectedSocket() client: ClientSocket) {}

  // todo: message로 받을 지 다시 생각
  // todo: 구현하면서 로직 다시 생각해보자
  @SubscribeMessage('endGame')
  endGame(@ConnectedSocket() client: ClientSocket) {}

  // todo: message로 받을 지 다시 생각
  // todo: 구현하면서 로직 다시 생각해보자
  @SubscribeMessage('moveBall')
  moveBall(@ConnectedSocket() client: ClientSocket) {}

  /* ============================== */
  /*             Single             */
  /* ============================== */

  @SubscribeMessage('inviteGame')
  inviteGame(@ConnectedSocket() client: ClientSocket) {}
}

export default GameGateway;
