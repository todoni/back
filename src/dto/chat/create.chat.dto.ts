import { IsEnum, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

import ChatType from '@dto/chat/chat.type';
import ExceptionMessage from '@dto/socket/exception.message';

class CreateChatDto {
  @IsNotEmpty({ message: ExceptionMessage.MISSING_PARAM })
  @IsString({ message: ExceptionMessage.MISSING_PARAM })
  name: string;

  @IsNotEmpty({ message: ExceptionMessage.MISSING_PARAM })
  @IsEnum(ChatType, { message: ExceptionMessage.MISSING_PARAM })
  type: ChatType;

  @IsOptional()
  @IsString()
  password?: string;
}

export default CreateChatDto;
