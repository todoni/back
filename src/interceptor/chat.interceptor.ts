import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import ClientSocket from '@dto/socket/client.socket';
import ExceptionMessage from '@dto/socket/exception.message';

interface ChatAuthInterceptorParam {
  hasChat?: boolean;
  admin?: boolean;
  owner?: boolean;
}

export class ChatAuthInterceptor implements NestInterceptor {
  private readonly hasChat: boolean;
  private readonly admin: boolean;
  private readonly owner: boolean;

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
      (!this.hasChat && client.chat.id) ||
      client.game.id
    ) {
      throw new ForbiddenException(ExceptionMessage.FORBIDDEN);
    }

    if (
      this.hasChat &&
      ((this.admin && !client.chat.isAdmin && !client.chat.isOwner) ||
        (this.owner && !client.chat.isOwner))
    ) {
      throw new ForbiddenException(ExceptionMessage.FORBIDDEN);
    }

    return next.handle();
  }
}
