import {
  IsNotEmpty,
  IsString,
  IsInt,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message!: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  userId!: number;
}