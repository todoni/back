import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

import ClientSocket from '@dto/socket/client.socket';
import SocketException from '@exception/socket.exception';
import ExceptionMessage from '@dto/socket/exception.message';

@Catch()
export class SocketGlobalFilter extends BaseWsExceptionFilter {
  catch(exception: HttpException | any, host: ArgumentsHost): void {
    const client: ClientSocket = host.switchToWs().getClient();

    // todo: delete
    console.log(exception);

    const error = SocketException.fromOptions({
      status: exception instanceof HttpException ? exception.getStatus() : 500,
      message:
        exception instanceof HttpException
          ? exception.message
          : ExceptionMessage.INTERNAL_ERROR,
    });

    client.emit('single:user:error', error);
  }
}
