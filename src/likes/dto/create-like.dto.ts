import {
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateLikeDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  userId!: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reviewId!: string;
}