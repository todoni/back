import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { QueryFailedError } from 'typeorm';

import ClientSocket from '@dto/socket/client.socket';
import SocketException from '@exception/socket.exception';
import ExceptionMessage from '@dto/socket/exception.message';
import ClientException from './client.exception';

@Catch()
export class SocketGlobalFilter extends BaseWsExceptionFilter {
  catch(
    exception: ClientException | QueryFailedError | any,
    host: ArgumentsHost,
  ): void {
    const client: ClientSocket = host.switchToWs().getClient();
    let status: number = undefined;
    let message: string = undefined;
    let navigate: string = undefined;

    // todo: delete
    console.log(exception);

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message =
        exception instanceof ClientException
          ? exception.message
          : exception.getResponse()['message'][0];
      navigate =
        exception instanceof ClientException ? exception.navigate : undefined;
    } else if (
      exception instanceof QueryFailedError &&
      exception['code'] === '23505'
    ) {
      status = 400;
      message = ExceptionMessage.DUPLICATED;
    } else {
      status = 500;
      message = ExceptionMessage.INTERNAL_ERROR;
    }

    client.emit(
      'single:user:error',
      SocketException.fromOptions({ status, message, navigate }),
    );
  }
}
