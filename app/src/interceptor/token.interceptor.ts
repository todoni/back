import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, Observable } from 'rxjs';
import { Response } from 'express';

import { AuthService } from '@service/auth.service';
import { UserService } from '@service/user.service';
import { AuthResponseDto } from '@dto/auth.dto';
import { User } from '@entity/user.entity';

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    return next.handle().pipe(
      map(async (result: AuthResponseDto) => {
        const res: Response = context.switchToHttp().getResponse();
        const temp: User = context.switchToHttp().getRequest().user;
        const user = await this.userService.findUserByUsername(temp.name);

        const tokenResult = await this.authService.getJwtToken(
          user.name,
          user.id,
        );
        res.cookie('token', tokenResult.access_token, {
          httpOnly: true,
          maxAge: 432000000000,
          domain: this.configService.get('serverConfig.url'),
        });
        res.header('token', tokenResult.access_token);

        // return result;
        if (result.status === 302) {
          res
            .cookie('token', tokenResult.access_token, {
              httpOnly: true,
              maxAge: 432000000000,
              sameSite: 'none', // todo: 배포 시 strict로 변경
              secure: true,
              path: '/',
            })
            .redirect('http://localhost:3001/socket'); // todo: request의 origin 또는 고정 origin 지정
        } else {
          return {
            status: result.status,
          };
        }
      }),
    );
  }
}
