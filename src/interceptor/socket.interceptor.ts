import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import ExceptionMessage from '@dto/socket/exception.message';
import ClientSocket from '@dto/socket/client.socket';
import ClientException from '@exception/client.exception';

class SocketValidationInterceptor implements NestInterceptor {
  private readonly keys: string[];

  constructor(...keys: string[]) {
    this.keys = keys;
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const client: ClientSocket = context.switchToWs().getClient();
    const body: string | object = context.switchToWs().getData();

    if (!(body instanceof Object))
      throw new ClientException(
        ExceptionMessage.MISSING_PARAM,
        HttpStatus.BAD_REQUEST,
      );

    console.log(this.keys);
    console.log(body);

    for (const key of this.keys) {
      if (key === 'userId' && client.user.id === parseInt(body[key], 10))
        throw new ClientException(
          ExceptionMessage.SELF_ASSIGNMENT,
          HttpStatus.BAD_REQUEST,
        );
      if (!body.hasOwnProperty(key))
        throw new ClientException(
          ExceptionMessage.MISSING_PARAM,
          HttpStatus.BAD_REQUEST,
        );
    }

    return next.handle();
  }
}

export default SocketValidationInterceptor;
