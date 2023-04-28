import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import ClientSocket from '@dto/socket/client.socket';
import ChatSessionDto from '@dto/chat/chat.session.dto';

interface ChatAuthInterceptorParam {
  hasChat?: boolean;
  admin?: boolean;
  owner?: boolean;
}

// todo: create: ChannelGameInterceptor 만들어야함

export class ChatAuthInterceptor implements NestInterceptor {
  private readonly hasChat: boolean;
  private readonly admin: boolean;
  private readonly owner: boolean;

  // todo: 게임 중인 사람인지 확인하는 flag 세워야함

  constructor(param: ChatAuthInterceptorParam = {}) {
    this.hasChat = param.hasChat !== undefined ? param.hasChat : true;
    this.admin = param.admin !== undefined ? param.admin : false;
    this.owner = param.owner !== undefined ? param.owner : false;
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const client: ClientSocket = context.switchToWs().getClient();

    if (
      (this.hasChat && !client.chat.id) ||
      (!this.hasChat && client.chat.id)
    ) {
      throw new ForbiddenException();
    }

    const chatSession = new ChatSessionDto();

    if (
      this.hasChat &&
      ((this.admin &&
        chatSession.public.adminId !== client.user.id &&
        chatSession.public.ownerId !== client.user.id) ||
        (this.owner && chatSession.public.ownerId !== client.user.id))
    ) {
      throw new ForbiddenException();
    }

    return next.handle();
  }
}
