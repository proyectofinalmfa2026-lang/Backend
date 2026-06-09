import {
  IsNotEmpty,
  IsString,
  IsInt,
} from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsString()
  @IsNotEmpty()
  reviewId!: string;

  @IsInt()
  @IsNotEmpty()
  userId!: number;
}
