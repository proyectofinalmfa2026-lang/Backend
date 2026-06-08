import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    example: 9,
    description: 'Puntuación de la película entre 1 y 10',
  })
  @IsInt()
  @Min(1)
  @Max(10)
  rating!: number;

  @ApiProperty({
    example: 'Una de las mejores películas de ciencia ficción que vi.',
    description: 'Comentario de la review',
  })
  @IsString()
  @IsNotEmpty()
  comment!: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID de la película',
  })
  @IsString()
  movieId!: string;

  @ApiProperty({
    example: 1,
    description: 'ID del usuario que crea la review',
  })
  @IsInt()
  userId!: number;
}