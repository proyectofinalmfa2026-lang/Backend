import { IsUUID } from 'class-validator';

export class CreateWatchlistDto {
  @IsUUID()
  movieId!: string;
}
