const TokenType = {
  FIRST_ACCESS: 'fa',
  TWO_FACTOR: 'tf',
  ACCESS_KEY: 'ak',
} as const;
type TokenType = (typeof TokenType)[keyof typeof TokenType];

interface TokenPayloadDto {
  id: number;
  name: string;
  type: TokenType;
}

export { TokenType, TokenPayloadDto };
