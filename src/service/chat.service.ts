import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import ChatSession from '@session/chat.session';
import CreateChatDto from '@dto/chat/create.chat.dto';
import ChatSessionDto, {
  ChatControlledUserDto,
  ChatPublicDto,
} from '@dto/chat/chat.session.dto';
import ChatType from '@dto/chat/chat.type';
import EncryptionService from '@service/encryption.service';
import ClientSocket from '@dto/socket/client.socket';
import ExceptionMessage from '@dto/socket/exception.message';

@Injectable()
class ChatService {
  constructor(
    private readonly chatSession: ChatSession,
    private readonly encryptionService: EncryptionService,
  ) {}

  /* ============================ */
  /*        Public Method         */
  /* ============================ */

  getAllChat() {
    return this.chatSession.getAllChat();
  }

  async createChat(
    userId: number,
    createChatDto: CreateChatDto,
  ): Promise<ChatSessionDto> {
    const chatSession = new ChatSessionDto();
    const chatId = this.chatSession.getNextSequence();

    chatSession.public.chatId = chatId;
    chatSession.public.ownerId = userId;
    chatSession.public.adminId = userId;
    chatSession.public.name = createChatDto.name;
    chatSession.public.type = createChatDto.type;
    chatSession.private.room = `room:chat:${chatId}`;
    chatSession.private.users.push(userId);

    if (createChatDto.type === ChatType.PROTECTED) {
      if (!createChatDto.password || !createChatDto.password.length)
        throw new BadRequestException(ExceptionMessage.MISSING_PARAM);
      chatSession.private.password = await this.encryptionService.hash(
        createChatDto.password,
      );
    }

    this.chatSession.set(chatId, chatSession);

    return chatSession;
  }

  async updateChat(
    chatId: number,
    createChatDto: CreateChatDto,
  ): Promise<ChatPublicDto> {
    const chatSession = this.chatSession.get(chatId);

    chatSession.public.name = createChatDto.name;
    chatSession.public.type = createChatDto.type;

    if (createChatDto.type === ChatType.PROTECTED) {
      chatSession.private.password = await this.encryptionService.hash(
        createChatDto.password,
      );
    }

    return chatSession.public;
  }

  setAdmin(client: ClientSocket, chatId: number, userId: number) {
    client.chat.isAdmin = true;
    const chatSession = this.chatSession.get(chatId);
    this.changeAdmin(chatSession, userId);
  }

  setOwner(
    client: ClientSocket,
    chatId: number,
    userId: number,
    alsoAdmin = false,
  ) {
    client.chat.isOwner = true;
    const chatSession = this.chatSession.get(chatId);
    chatSession.public.ownerId = userId;
    if (alsoAdmin) this.setAdmin(client, chatId, userId);
  }

  async joinChat(
    chatId: number,
    userId: number,
    password?: string,
  ): Promise<ChatSessionDto> {
    const chatSession = this.chatSession.get(chatId);

    if (
      (chatSession.private.invited.indexOf(userId) === -1 &&
        ((chatSession.public.type === ChatType.PROTECTED &&
          !(await this.encryptionService.compare(
            password ? password : '',
            chatSession.private.password,
          ))) ||
          chatSession.public.type === ChatType.PRIVATE)) ||
      this.isControlledUser(chatSession.private.kicked, userId)
    ) {
      throw new ForbiddenException();
    }

    const invitedIndex = chatSession.private.invited.indexOf(userId);
    if (invitedIndex !== -1) {
      chatSession.private.invited.splice(invitedIndex, 1);
    }

    chatSession.private.users.push(userId);

    return chatSession;
  }

  leaveChat(chatId: number, userId: number) {
    const chatSession = this.chatSession.get(chatId);
    const chatState = {
      room: chatSession.private.room,
      userExist: true,
      ownerId: undefined,
      adminId: undefined,
    };

    chatSession.private.users = chatSession.private.users.filter(
      (id) => id !== userId,
    );

    if (!chatSession.private.users.length) {
      this.chatSession.delete(chatId);
      chatState.userExist = false;
    } else {
      if (chatSession.public.ownerId === userId) {
        const ownerId =
          chatSession.public.ownerId === chatSession.public.adminId
            ? chatSession.private.users[0]
            : chatSession.public.adminId;
        chatState.ownerId = ownerId;
        chatSession.public.ownerId = ownerId;
      }
      if (chatSession.public.adminId === userId) {
        const adminId = this.changeAdmin(chatSession);
        chatState.adminId = adminId;
      }
    }

    return chatState;
  }

  sendMessage(chatId: number, userId: number) {
    const chatSession = this.chatSession.get(chatId);
    if (
      this.isControlledUser(chatSession.private.muted, userId) ||
      chatSession.private.users.indexOf(userId) === -1
    )
      throw new ForbiddenException(ExceptionMessage.FORBIDDEN);
  }

  kickUser(chatId: number, sourceId: number, targetId: number) {
    const chatSession = this.chatSession.get(chatId);
    this.setControllUser('kicked', chatSession, sourceId, targetId);
  }

  muteUser(chatId: number, sourceId: number, targetId: number) {
    const chatSession = this.chatSession.get(chatId);
    this.setControllUser('muted', chatSession, sourceId, targetId);
  }

  inviteUser(chatId: number, userId: number) {
    const chatSession = this.chatSession.get(chatId);
    chatSession.private.invited.push(userId);
  }

  /* ============================= */
  /*        Private Method         */
  /* ============================= */

  private isControlledUser(
    controlledUsers: ChatControlledUserDto[],
    userId: number,
  ): boolean {
    const index = controlledUsers.findIndex((data) => data.userId === userId);
    if (index === -1) return false;
    else if (controlledUsers[index].expiredAt > Date.now()) return true;
    controlledUsers.splice(index, 1);
    return false;
  }

  private changeAdmin(chatSession: ChatSessionDto, userId?: number) {
    const adminId = userId ? userId : chatSession.public.ownerId;
    if (chatSession.private.users.indexOf(adminId) === -1)
      throw new NotFoundException(ExceptionMessage.NOT_FOUND);
    chatSession.public.adminId = adminId;
    return adminId;
  }

  private setControllUser(
    type: string,
    chat: ChatSessionDto,
    sourceId: number,
    targetId: number,
  ) {
    if (
      sourceId === targetId ||
      (sourceId !== chat.public.ownerId && targetId === chat.public.ownerId) ||
      chat.private.users.indexOf(targetId) === -1
    ) {
      throw new ForbiddenException(ExceptionMessage.FORBIDDEN);
    }

    chat.private[type].push({
      userId: targetId,
      expiredAt: Date.now() + 20 * 1000,
    });
  }
}

export default ChatService;
