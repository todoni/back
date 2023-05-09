import { TokenType } from '@dto/auth/token.dto';

export interface AuthResponseDto {
  status: number;
  message: string;
  type?: TokenType;
  expiresIn?: string;
  redirectPath?: string;
}

export interface TokenDto {
  accessToken?: string;
  refreshToken?: string;
  sign?: string;
  code?: string;
}
