import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import ChatType from '@dto/chat/chat.type';

class CreateChatDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: ChatType;

  @IsOptional()
  @IsString()
  password?: string;
}

export default CreateChatDto;
