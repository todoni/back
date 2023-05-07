import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import ChatType from '@dto/chat/chat.type';
import ExceptionMessage from '@dto/socket/exception.message';

class CreateChatDto {
  @IsNotEmpty({ message: ExceptionMessage.REQUIRED_PARAM })
  @IsString({ message: ExceptionMessage.REQUIRED_PARAM })
  name: string;

  @IsNotEmpty({ message: ExceptionMessage.REQUIRED_PARAM })
  @IsEnum(ChatType, { message: ExceptionMessage.REQUIRED_PARAM })
  type: ChatType;

  @IsOptional()
  @IsString()
  password?: string;
}

export default CreateChatDto;
