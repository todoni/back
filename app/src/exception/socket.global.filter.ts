import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

import ClientSocket from '@dto/socket/client.socket';
import SocketException from '@exception/socket.exception';

@Catch()
export class SocketGlobalFilter extends BaseWsExceptionFilter {
  catch(exception: HttpException | any, host: ArgumentsHost): void {
    const client: ClientSocket = host.switchToWs().getClient();
    let error: SocketException = undefined;

    if (exception instanceof HttpException) {
      error = new SocketException();
    } else {
      error = new SocketException();
      //   500,
      //   'Internal Server Error',
      //   exception.stack,
      // );
    }

    client.emit('single:user:error', error);
  }
}
