import { IsUUID } from 'class-validator';

export class CreateWatchedDto {
  @IsUUID()
  movieId!: string;
}
