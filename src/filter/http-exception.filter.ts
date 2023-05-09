import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.cookie('token', '', {
      httpOnly: true,
      maxAge: 0,
      domain: this.configService.get('serverConfig.url'),
    });

    response.status(status).json({
      statusCode: status + 2,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
