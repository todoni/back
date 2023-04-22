import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
} from '@nestjs/websockets';
import { ParseIntPipe } from '@nestjs/common';

import BaseGateway, { GatewayInjector } from '@gateway/base.gateway';
import ClientSocket from '@dto/client.socket';
import CreateChatDto from '@dto/chat/create.chat.dto';

@GatewayInjector('chat')
class ChatGateway extends BaseGateway {
  /**
   * B - 생성
   * B - 수정 (Owner)
   * G - 참여
   * G - 나가기
   * G - 메시지 전송
   * G - admin 설정 (Owner)
   * G - kick (Admin)
   * G - mute (Admin)
   * S - 초대
   * S - 유저 차단
   * S - DM 전송
   */

  constructor() {
    super();
  }

  /* ================================= */
  /*             Broadcast             */
  /* ================================= */

  @SubscribeMessage('createChat')
  createChat(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody('chat') createChatDto: CreateChatDto,
  ) {
    // result = business logic
    const result = 'channel1';
    client.join(result);
    console.log(result);
    this.server.except(result).emit('broadcast:chat:createChat', result);
  }

  @SubscribeMessage('updateChat')
  updateChat(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody('chat') input: any,
  ) {}

  /* ============================= */
  /*             Group             */
  /* ============================= */

  @SubscribeMessage('joinChat')
  joinChat(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody('chatId', ParseIntPipe) chatId: number,
    @MessageBody('password') password?: string,
  ) {
    const result = 'user1';
    this.server.to('channel1').emit('group:chat:joinChat', result);
  }

  @SubscribeMessage('leaveChat')
  leaveChat(@ConnectedSocket() client: ClientSocket) {}

  @SubscribeMessage('sendMessage')
  sendMessage(@ConnectedSocket() client: ClientSocket) {}

  @SubscribeMessage('setAdmin')
  setAdmin(@ConnectedSocket() client: ClientSocket) {}

  @SubscribeMessage('kickUser')
  kickUser(@ConnectedSocket() client: ClientSocket) {}

  @SubscribeMessage('muteUser')
  muteUser(@ConnectedSocket() client: ClientSocket) {}

  /* ============================== */
  /*             Single             */
  /* ============================== */

  @SubscribeMessage('sendDirectMessage')
  sendDirectMessage(@ConnectedSocket() client: ClientSocket) {}

  @SubscribeMessage('inviteUser')
  inviteUser(@ConnectedSocket() client: ClientSocket) {}

  @SubscribeMessage('blockUser')
  blockUser(@ConnectedSocket() client: ClientSocket) {}
}

export default ChatGateway;
