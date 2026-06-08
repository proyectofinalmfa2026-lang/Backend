import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({
    example: 'Mandy',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    example: 'Una película psicodélica de terror y venganza.',
  })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({
    example: 'Terror',
  })
  @IsString()
  @IsNotEmpty()
  genre!: string;

  @ApiProperty({
    example: 2018,
  })
  @IsNumber()
  year!: number;

  @ApiProperty({
    example: 'https://image.tmdb.org/t/p/w500/poster.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  poster?: string;
}