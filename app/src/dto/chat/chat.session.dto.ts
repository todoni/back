import ChatType from '@dto/chat/chat.type';

export class ChatControlledUserDto {
  userId: number;
  expiredAt: number;
}

export class ChatPublicDto {
  chatId: number;
  ownerId: number;
  adminId: number;
  type: ChatType;
  name: string;
}

class ChatPrivateDto {
  room: string;
  password?: string = '';
  users: number[] = [];
  kicked: ChatControlledUserDto[] = [];
  muted: ChatControlledUserDto[] = [];
  invited: number[] = [];
}

class ChatSessionDto {
  public: ChatPublicDto;
  private: ChatPrivateDto;
}

export default ChatSessionDto;
