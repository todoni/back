import { IsNotEmpty, IsOptional, IsString, IsPositive } from 'class-validator';

import ExceptionMessage from '@dto/socket/exception.message';

class CreateGameDto {
  @IsNotEmpty({ message: ExceptionMessage.REQUIRED_PARAM })
  @IsPositive({ message: ExceptionMessage.REQUIRED_PARAM })
  speed: number;

  @IsOptional()
  @IsString()
  name?: string;
}

export default CreateGameDto;
