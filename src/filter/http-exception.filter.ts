import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  PayloadTooLargeException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status: number = undefined;

    response.cookie('token', '', {
      httpOnly: true,
      maxAge: 0,
    });

    // todo: delete
    console.log('== HTTP =================');
    console.log(exception);

    if (exception instanceof QueryFailedError && exception['code'] === '23505')
      status = 400;
    else if (exception instanceof HttpException) status = exception.getStatus();
    else if (exception instanceof PayloadTooLargeException)
      status = HttpStatus.BAD_REQUEST;
    else status = 500;

    response.status(status).json({
      statusCode: status + 2,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
