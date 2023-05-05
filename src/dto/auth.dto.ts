export interface AuthResponseDto {
  status: number;
  message: string;
  twoFactor?: boolean;
  redirectPath?: string;
}

export interface TokenDto {
  accessToken?: string;
  refreshToken?: string;
  sign?: string;
  code?: string;
}
