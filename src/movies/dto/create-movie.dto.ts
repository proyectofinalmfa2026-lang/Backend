import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({ example: 'Interstellar' })
  title!: string;

  @ApiProperty({
    example: 'Un grupo de astronautas viaja a través de un agujero de gusano...',
  })
  description!: string;

  @ApiProperty({ example: 'Sci-Fi' })
  genre!: string;

  @ApiProperty({ example: 2014 })
  year!: number;

  @ApiProperty({
    example: 'https://image.tmdb.org/t/p/poster.jpg',
    required: false,
  })
  poster?: string;
}