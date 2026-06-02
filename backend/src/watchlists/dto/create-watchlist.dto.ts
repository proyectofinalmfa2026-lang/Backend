import { IsInt } from 'class-validator';

export class CreateWatchlistDto {
  @IsInt()
  tmdbMovieId!: number;
}