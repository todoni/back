import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
} from '@nestjs/websockets';
import { ParseIntPipe, UseInterceptors } from '@nestjs/common';

import BaseGateway, { GatewayInjector } from '@gateway/base.gateway';
import ClientSocket, { IC_TYPE } from '@dto/socket/client.socket';
import CreateChatDto from '@dto/chat/create.chat.dto';
import ChatService from '@service/chat.service';
import UserSocketState from '@dto/user/user.socket.state';
import SocketValidationInterceptor from '@interceptor/socket.interceptor';
import { ChatAuthInterceptor } from '@interceptor/chat.interceptor';

@GatewayInjector('chat')
class ChatGateway extends BaseGateway {
  /**
   * B - 생성
   * B - 수정 (Owner)
   * B - admin 설정 (Owner)
   * G - 참여
   * G - 나가기
   * G - 메시지 전송
   * G - kick (Admin)
   * G - mute (Admin)
   * S - 초대
   * S - DM 전송
   */

  // todo: block user filtering -> interceptor

  constructor(private readonly chatService: ChatService) {
    super();
  }

  /* ================================= */
  /*             Broadcast             */
  /* ================================= */

  @UseInterceptors(
    new SocketValidationInterceptor('chat'),
    new ChatAuthInterceptor({ hasChat: false }),
  )
  @SubscribeMessage('createChat')
  async createChat(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody('chat') createChatDto: CreateChatDto,
  ) {
    const chatSession = await this.chatService.createChat(
      client.user.id,
      createChatDto,
    );
    client.set(IC_TYPE.CHAT, chatSession.public.chatId);

    this.changeState(client, UserSocketState.IN_CHAT);
    this.server.emit('broadcast:chat:createChat', chatSession.public);
    client.emit('single:chat:joinChat', chatSession);
  }

  @UseInterceptors(
    new SocketValidationInterceptor('chat'),
    new ChatAuthInterceptor({ hasChat: false }),
  )
  @SubscribeMessage('updateChat')
  async updateChat(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody('chat') createChatDto: CreateChatDto,
  ) {
    const chatPublic = await this.chatService.updateChat(
      client.chat.id,
      createChatDto,
    );

    this.server.emit('broadcast:chat:updateChat', chatPublic);
  }

  @UseInterceptors(
    new SocketValidationInterceptor('userId'),
    new ChatAuthInterceptor({ owner: true }),
  )
  @SubscribeMessage('setAdmin')
  setAdmin(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody('userId') userId: number,
  ) {
    this.chatService.setAdmin(client.chat.id, userId);
    this.server.to(client.chat.room).emit('broadcast:chat:setAdmin', {
      chatId: client.chat.id,
      adminId: userId,
    });
  }

  /* ============================= */
  /*             Group             */
  /* ============================= */

  @UseInterceptors(
    new SocketValidationInterceptor('chatId'),
    new ChatAuthInterceptor({ hasChat: false }),
  )
  @SubscribeMessage('joinChat')
  async joinChat(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody('chatId', ParseIntPipe) chatId: number,
    @MessageBody('password') password?: string,
  ) {
    const chatSession = await this.chatService.joinChat(
      chatId,
      client.user.id,
      password,
    );
    client.set(IC_TYPE.CHAT, chatSession.public.chatId);

    this.changeState(client, UserSocketState.IN_CHAT);
    this.server
      .to(chatSession.private.room)
      .emit('group:chat:joinChat', { userId: client.user.id });
    client.emit('single:chat:joinChat', chatSession);
  }

  @UseInterceptors(new ChatAuthInterceptor())
  @SubscribeMessage('leaveChat')
  leaveChat(@ConnectedSocket() client: ClientSocket) {
    const chatState = this.chatService.leaveChat(
      client.chat.id,
      client.user.id,
    );

    this.changeState(client, UserSocketState.ONLINE);
    if (!chatState.userExist) {
      this.server.emit('broadcast:chat:deleteChat', { chatId: client.chat.id });
    } else {
      if (chatState.ownerId || chatState.adminId) {
        this.server.emit('broadcast:chat:setAdmin', {
          chatId: client.chat.id,
          ownerId: chatState.ownerId,
          adminId: chatState.adminId,
        });
      }

      this.server
        .to(chatState.room)
        .emit('group:chat:leaveChat', { userId: client.user.id });
    }
    client.clear(IC_TYPE.CHAT);
    client.emit('single:chat:leaveChat');
  }

  @UseInterceptors(
    new SocketValidationInterceptor('message'),
    new ChatAuthInterceptor(),
  )
  @SubscribeMessage('sendMessage')
  sendMessage(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody('message') message: string,
  ) {
    this.chatService.sendMessage(client.chat.id, client.user.id);
    this.server.to(client.chat.room).emit('group:chat:sendMessage', {
      sourceId: client.user.id,
      message: message,
      direct: false,
    });
  }

  @UseInterceptors(
    new SocketValidationInterceptor('userId'),
    new ChatAuthInterceptor({ admin: true }),
  )
  @SubscribeMessage('kickUser')
  kickUser(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody('userId') userId: number,
  ) {
    const kickedClient = this.socketSession.get(userId);
    this.chatService.kickUser(client.chat.id, userId);
    this.server
      .to(client.chat.room)
      .emit('group:chat:kickUser', { userId: userId });
    this.leaveChat(kickedClient);
  }

  @UseInterceptors(
    new SocketValidationInterceptor('userId'),
    new ChatAuthInterceptor({ admin: true }),
  )
  @SubscribeMessage('muteUser')
  muteUser(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody('userId') userId: number,
  ) {
    this.chatService.muteUser(client.chat.id, userId);
    this.server
      .to(client.chat.room)
      .emit('group:chat:muteUser', { userId: userId });
  }

  /* ============================== */
  /*             Single             */
  /* ============================== */

  @UseInterceptors(
    new SocketValidationInterceptor('userId', 'message'),
    new ChatAuthInterceptor(),
  )
  @SubscribeMessage('sendDirectMessage')
  sendDirectMessage(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody('userId') userId: number,
    @MessageBody('message') message: string,
  ) {
    this.chatService.sendMessage(client.chat.id, userId);
    this.server
      .to([client.user.room, `user-${userId}`])
      .emit('single:chat:sendMessage', {
        sourceId: client.user.id,
        message: message,
        direct: true,
      });
  }

  @UseInterceptors(
    new SocketValidationInterceptor('userId'),
    new ChatAuthInterceptor(),
  )
  @SubscribeMessage('inviteUser')
  inviteUser(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody('userId') userId: number,
  ) {
    this.chatService.inviteUser(client.chat.id, userId);
    this.server.to(`user-${userId}`).emit('single:chat:inviteUser', {
      chatId: client.chat.id,
      sourceId: client.user.id,
    });
  }
}

export default ChatGateway;
