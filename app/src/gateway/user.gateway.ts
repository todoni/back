import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
} from '@nestjs/websockets';

import BaseGateway, { GatewayInjector } from '@gateway/base.gateway';
import ClientSocket from '@dto/socket/client.socket';
import { UserService } from '@service/user.service';
import { UseInterceptors } from '@nestjs/common';
import SocketValidationInterceptor from '@interceptor/socket.interceptor';
import ImageService from '@service/image.service';

@GatewayInjector('user')
class UserGateway extends BaseGateway {
  /**
   * B - Display Name 수정
   * B - 이미지 수정
   * S - Follow
   * S - UnFollow
   * S - 유저 차단
   */

  constructor(
    private readonly userService: UserService,
    private readonly imageService: ImageService,
  ) {
    super();
  }

  /* ================================= */
  /*             Broadcast             */
  /* ================================= */

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

  @UseInterceptors(new SocketValidationInterceptor('image', 'mimeType'))
  @SubscribeMessage('updateImage')
  async updateImage(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody('image') image: string,
    @MessageBody('mimeType') mimeType: string,
  ) {
    const filename = `${client.user.id}`;
    const imageUrl = await this.imageService.uploadImage(
      filename,
      image,
      mimeType,
    );
    this.userService.updateImage(client.user.id, imageUrl);
    this.server.emit('broadcast:user:updateImage', {
      userId: client.user.id,
      imageUrl: imageUrl,
    });
  }

  /* ============================== */
  /*             Single             */
  /* ============================== */

  @UseInterceptors(new SocketValidationInterceptor('userId'))
  @SubscribeMessage('followUser')
  async follorUser(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody('userId') userId: number,
  ) {
    await this.userService.followUser(client.user.id, userId);
    client.emit('single:user:followUser', { userId: userId });
  }

  @UseInterceptors(new SocketValidationInterceptor('userId'))
  @SubscribeMessage('unFollowUser')
  async unFollorUser(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody('userId') userId: number,
  ) {
    await this.userService.unFollowUser(client.user.id, userId);
    client.emit('single:user:unFollowUser', { userId: userId });
  }

  @UseInterceptors(new SocketValidationInterceptor('userId'))
  @SubscribeMessage('blockUser')
  async blockUser(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody('userId') userId: number,
  ) {
    await this.userService.blockUser(client.user.id, userId);
    client.emit('single:user:blockUser', { userId: userId });
  }
}

export default UserGateway;
