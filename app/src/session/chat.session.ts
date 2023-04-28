import { Injectable } from '@nestjs/common';

import BaseSession from '@session/base.session';
import ChatSessionDto from '@dto/chat/chat.session.dto';

@Injectable()
class ChatSession extends BaseSession<ChatSessionDto> {}

export default ChatSession;
