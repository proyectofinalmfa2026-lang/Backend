import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/users.entity';
import { Movie } from '../../movies/entities/movies.entity';

@Entity('watchlists')
export class Watchlist {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.watchlists, {
    onDelete: 'CASCADE',
  })
  user!: User;

  @ManyToOne(() => Movie, { eager: true })
  @JoinColumn({ name: 'movieId' })
  movie!: Movie;

  @CreateDateColumn()
  createdAt!: Date;
}
