import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsInt()
  @Min(1)
  @Max(10)
  score!: number;

  @IsBoolean()
  spoiler!: boolean;

  @IsInt()
  tmdbMovieId!: number;
}