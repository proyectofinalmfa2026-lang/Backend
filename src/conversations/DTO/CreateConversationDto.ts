import { IsInt } from 'class-validator';

export class CreateConversationDto {
  @IsInt()
  participant1Id!: number;

  @IsInt()
  participant2Id!: number;
}