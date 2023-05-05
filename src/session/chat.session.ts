import { Injectable } from '@nestjs/common';

import BaseSession from '@session/base.session';
import ChatSessionDto from '@dto/chat/chat.session.dto';

@Injectable()
class ChatSession extends BaseSession<ChatSessionDto> {
  constructor() {
    super();
  }

  getAllChat() {
    return [...this.store.entries()].map(([_, chat]) => chat.public);
  }
}

export default ChatSession;
