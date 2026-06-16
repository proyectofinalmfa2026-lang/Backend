import { IsString } from 'class-validator';

export class ChatAiDto {
  @IsString()
  message!: string;
}