import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import ChatType from '@dto/chat/chat.type';

class CreateChatDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  chatName: string;

  @IsNotEmpty()
  @IsString()
  chatState: ChatType;

  @IsString()
  password?: string;
}

export default CreateChatDto;
