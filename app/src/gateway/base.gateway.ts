import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  ForbiddenException,
  HttpException,
  ParseIntPipe,
  UseFilters,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Server } from 'socket.io';

import ClientSocket, {
  ChatConfiguration,
  GameConfiguration,
  IC_TYPE,
  IdentityContiguration,
} from '@dto/socket/client.socket';
import CreateChatDto from '@dto/chat/create.chat.dto';
import ChatService from '@service/chat.service';
import UserSocketState from '@dto/user/user.socket.state';
import SocketValidationInterceptor from '@interceptor/socket.interceptor';
import { ChatAuthInterceptor } from '@interceptor/chat.interceptor';
import { SocketGlobalFilter } from '@exception/socket.global.filter';
import SocketSession from '@session/socket.session';
import { UserService } from '@service/user.service';
import GameService from '@service/game.service';
import ImageService from '@service/image.service';
import GameSessionDto, { GamePlayerDto } from '@dto/game/game.session.dto';
import { AuthService } from '@service/auth.service';
import ExceptionMessage from '@dto/socket/exception.message';
import SocketException from '@exception/socket.exception';

@WebSocketGateway(4000)
@UseFilters(SocketGlobalFilter)
@UsePipes(new ValidationPipe())
class BaseGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  protected server: Server;
  protected socketSession = new SocketSession();

  constructor(
    private readonly authService: AuthService,
    private readonly chatService: ChatService,
    private readonly userService: UserService,
    private readonly gameService: GameService,
    private readonly imageService: ImageService,
  ) {}

  handleConnection(client: ClientSocket) {
    this.initSocket(client);

    try {
      const cookie = client.handshake.headers.cookie;
      const payload = this.authService.parseToken(cookie);
      const userId = parseInt(payload['id'], 10);

      if (this.socketSession.has(userId))
        throw new ForbiddenException(ExceptionMessage.UNAUTHORIZED);

      client.set(IC_TYPE.USER, userId);
      this.userService.setUserForSocket(userId);
      this.socketSession.set(userId, client);
      this.changeState(client, UserSocketState.ONLINE);
      client.emit('single:user:connect', {
        userList: this.userService.getAllUserForSocket(userId),
        chatList: this.chatService.getAllChat(),
        gameList: this.gameService.getAllGame(),
      });
    } catch (err) {
      const exception = SocketException.fromOptions({
        status: err instanceof HttpException ? err.getStatus() : 500,
        message:
          err instanceof HttpException
            ? err.message
            : ExceptionMessage.INTERNAL_ERROR,
      });
      client.emit('single:user:error', exception);
      client.disconnect();
    }
  }

  handleDisconnect(client: ClientSocket) {
    if (client.chat.id) this.leaveChat(client);
    if (client.game.id) this.leaveGame(client);

    this.changeState(client, UserSocketState.OFFLINE);
    this.socketSession.delete(client.user.id);
    client.clear(IC_TYPE.USER);
  }

  changeState(client: ClientSocket, state: UserSocketState) {
    client.state = state;
    this.server.emit('broadcast:user:changeState', {
      userId: client.user.id,
      state: client.state,
    });
  }

  initSocket(client: ClientSocket) {
    client.user = new IdentityContiguration();
    client.chat = new ChatConfiguration();
    client.game = new GameConfiguration();
    client.set = (type: IC_TYPE, value: number) => {
      client[type].id = value;
      client[type].room = `room:${type}:${value}`;
      client.join(client[type].room);
    };

    client.clear = (type: IC_TYPE) => {
      client.leave(client[type].room);
      client[type].id = undefined;
      client[type].room = undefined;
    };
  }

  /* =============================== */
  /*               Chat              */
  /* =============================== */

  /* ==========  Broadcast  =========== */

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
    this.chatService.setOwner(
      client,
      chatSession.public.chatId,
      client.user.id,
      true,
    );
    client.set(IC_TYPE.CHAT, chatSession.public.chatId);

    this.changeState(client, UserSocketState.IN_CHAT);
    this.server.emit('broadcast:chat:createChat', chatSession.public);
    client.emit('single:chat:joinChat', chatSession);
  }

  @UseInterceptors(
    new SocketValidationInterceptor('chat'),
    new ChatAuthInterceptor({ owner: true }),
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
    @MessageBody('userId', ParseIntPipe) userId: number,
  ) {
    this.chatService.setAdmin(
      this.socketSession.get(userId),
      client.chat.id,
      userId,
    );
    this.server.to(client.chat.room).emit('broadcast:chat:setAdmin', {
      chatId: client.chat.id,
      adminId: userId,
    });
  }

  /* ===========  Group  ========== */

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
        if (chatState.ownerId)
          this.chatService.setOwner(
            this.socketSession.get(chatState.ownerId),
            client.chat.id,
            chatState.ownerId,
          );
        if (chatState.adminId)
          this.chatService.setAdmin(
            this.socketSession.get(chatState.adminId),
            client.chat.id,
            chatState.adminId,
          );
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
    @MessageBody('userId', ParseIntPipe) userId: number,
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
    @MessageBody('userId', ParseIntPipe) userId: number,
  ) {
    this.chatService.muteUser(client.chat.id, userId);
    this.server
      .to(client.chat.room)
      .emit('group:chat:muteUser', { userId: userId });
  }

  /* ==========  Single  ========== */

  @UseInterceptors(
    new SocketValidationInterceptor('userId', 'message'),
    new ChatAuthInterceptor(),
  )
  @SubscribeMessage('sendDirectMessage')
  sendDirectMessage(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody('userId', ParseIntPipe) userId: number,
    @MessageBody('message') message: string,
  ) {
    this.chatService.sendMessage(client.chat.id, userId);
    this.server
      .to([client.user.room, `room:user:${userId}`])
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
    @MessageBody('userId', ParseIntPipe) userId: number,
  ) {
    this.chatService.inviteUser(client.chat.id, userId);
    this.server.to(`room:user:${userId}`).emit('single:chat:inviteUser', {
      chatId: client.chat.id,
      sourceId: client.user.id,
    });
  }

  /* ============================ */
  /*             User             */
  /* ============================ */

  /* ==========  Broadcast  =========== */

  @UseInterceptors(new SocketValidationInterceptor('name'))
  @SubscribeMessage('updateDisplayName')
  async updateDisplayName(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody('name') name: string,
  ) {
    await this.userService.updateDisplayName(client.user.id, name);
    this.server.emit('broadcast:user:updateDisplayName', {
      userId: client.user.id,
      name: name,
    });
  }

  @UseInterceptors(new SocketValidationInterceptor('image'))
  @SubscribeMessage('updateImage')
  async updateImage(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody('image') image: string,
  ) {
    const filename = `${client.user.id}`;
    const imageUrl = await this.imageService.uploadImage(filename, image);
    this.userService.updateImage(client.user.id, imageUrl);
    this.server.emit('broadcast:user:updateImage', {
      userId: client.user.id,
      imageUrl: imageUrl,
    });
  }

  /* ===========  Single  ========== */

  @UseInterceptors(new SocketValidationInterceptor('userId'))
  @SubscribeMessage('followUser')
  async follorUser(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody('userId', ParseIntPipe) userId: number,
  ) {
    await this.userService.followUser(client.user.id, userId);
    client.emit('single:user:followUser', { userId: userId });
  }

  @UseInterceptors(new SocketValidationInterceptor('userId'))
  @SubscribeMessage('unFollowUser')
  async unFollorUser(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody('userId', ParseIntPipe) userId: number,
  ) {
    await this.userService.unFollowUser(client.user.id, userId);
    client.emit('single:user:unFollowUser', { userId: userId });
  }

  @UseInterceptors(new SocketValidationInterceptor('userId'))
  @SubscribeMessage('blockUser')
  async blockUser(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody('userId', ParseIntPipe) userId: number,
  ) {
    await this.userService.blockUser(client.user.id, userId);
    client.emit('single:user:blockUser', { userId: userId });
  }

  /* ============================ */
  /*             Game             */
  /* ============================ */

  /* ==========  Broadcast  =========== */

  @SubscribeMessage('createGame')
  createGame(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody('speed', ParseIntPipe) speed: number,
  ) {
    const gameSession = this.gameService.createGame(client.user.id, speed);
    client.set(IC_TYPE.GAME, gameSession.public.gameId);

    this.changeState(client, UserSocketState.IN_GAME);
    this.server.emit('broadcast:game:createGame', gameSession.public);
    client.emit('single:game:createGame', gameSession);
  }

  /* ==========  Group  =========== */

  @SubscribeMessage('joinGame')
  joinGame(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody('gameId', ParseIntPipe) gameId: number,
  ) {
    const gameSession = this.gameService.joinGame(gameId, client.user.id);
    client.set(IC_TYPE.GAME, gameId);

    this.changeState(client, UserSocketState.IN_GAME);
    this.server
      .to(client.game.room)
      .except(client.user.room)
      .emit('group:game:joinGame', gameSession.private.players[1]);
    client.emit('single:game:joinGame', gameSession);
  }

  @SubscribeMessage('watchGame')
  watchGame(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody('gameId', ParseIntPipe) gameId: number,
  ) {
    const gameSession = this.gameService.waitGame(gameId, client.user.id);
    client.set(IC_TYPE.GAME, gameId);

    this.changeState(client, UserSocketState.IN_GAME);
    this.server
      .to(client.game.room)
      .emit('group:game:watchGame', { userId: client.user.id });
    client.emit('single:game:watchGame', gameSession);
  }

  @SubscribeMessage('leaveGame')
  leaveGame(@ConnectedSocket() client: ClientSocket) {
    const isOwner = this.gameService.leaveGame(client.game.id, client.user.id);

    this.changeState(client, UserSocketState.ONLINE);
    if (isOwner) {
      this.server.emit('broadcast:game:deleteGame', { gameId: client.game.id });
    } else {
      this.server
        .to(client.game.room)
        .emit('group:game:leaveGame', { userId: client.user.id });
    }
    client.clear(IC_TYPE.GAME);
    client.emit('single:chat:leaveGame');
  }

  @SubscribeMessage('startGame')
  startGame(@ConnectedSocket() client: ClientSocket) {
    const gameSession = this.gameService.get(client.game.id);

    this.changePlayerState(gameSession.private.players);
    this.server.to(client.game.room).emit('group:game:startGame');

    this.gameService.initialGameSetting(gameSession);
    gameSession.private.gameInterval = setInterval(async () => {
      if (
        !this.gameService.monitGame(gameSession.private) ||
        !gameSession.private.onGame
      ) {
        clearInterval(gameSession.private.gameInterval);
        const gameReult = this.gameService.endGame(gameSession.private.players);
        this.server.to(client.game.room).emit('group:game:endGame', {
          winner: gameReult.winner,
          loser: gameReult.loser,
        });
        return;
      }

      if (!gameSession.private.onRound) this.startRound(gameSession);
    }, 100);
  }

  @SubscribeMessage('movePaddle')
  moveBall(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody('keyCode', ParseIntPipe) keyCode: number,
  ) {
    if (keyCode !== 38 && keyCode !== 40) return;

    const position = this.gameService.movePaddle(
      client.game.id,
      client.user.id,
      keyCode,
    );

    this.server.to(client.game.room).emit('group:game:movePaddle', {
      userId: client.user.id,
      position: position,
    });
  }

  /* ==========  Single  =========== */

  @SubscribeMessage('inviteGame')
  inviteGame(@ConnectedSocket() client: ClientSocket) {}

  /* =============================== */
  /*             Private             */
  /* =============================== */

  async startRound(gameSession: GameSessionDto) {
    this.gameService.initialRoundSetting(gameSession.private);
    this.server.to(gameSession.private.room).emit('group:game:initRound', {
      players: gameSession.private.players,
      ball: gameSession.private.ball,
    });

    await this.waitAsync(3, this.countDownRound, gameSession.private.room);

    this.server.to(gameSession.private.room).emit('group:game:startRound');
    gameSession.private.roundInterval = setInterval(() => {
      if (!this.gameService.monitRound(gameSession.private.ball)) {
        clearInterval(gameSession.private.roundInterval);
        this.endRound(gameSession);
        return;
      }

      this.gameService.moveBall(
        gameSession.private.ball,
        gameSession.private.players,
      );
      this.server.to(gameSession.private.room).emit('group:game:moveBall', {
        position: gameSession.private.ball.position,
      });
    }, 1000 / gameSession.private.ball.speed);
  }

  endRound(gameSession: GameSessionDto) {
    this.gameService.endRound(gameSession.private);
    this.server.to(gameSession.private.room).emit('group:game:endRound');
  }

  countDownRound(count: number, room: string) {
    this.server.to(room).emit('group:game:coundDownRound', { count: count });
  }

  changePlayerState(players: GamePlayerDto[]) {
    players.forEach((player) => {
      const playerSocket = this.socketSession.get(player.userId);
      this.changeState(playerSocket, UserSocketState.IN_GAME);
    });
  }

  async waitAsync(condition: number, callback: Function, ...args: any) {
    return await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!condition) {
          clearInterval(interval);
          resolve(undefined);
          return;
        }
        callback(condition, ...args);
        condition--;
      }, 1000);
    });
  }
}

export default BaseGateway;
