import { IsInt, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  conversationId!: string;

  @IsInt()
  senderId!: number;

  @IsString()
  content!: string;
}