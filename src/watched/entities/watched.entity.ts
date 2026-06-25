import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/users.entity';
import { Movie } from '../../movies/entities/movies.entity';

@Entity('watched')
export class Watched {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.watched, {
    onDelete: 'CASCADE',
  })
  user!: User;

  @ManyToOne(() => Movie, { eager: true })
  @JoinColumn({ name: 'movieId' })
  movie!: Movie;

  @CreateDateColumn()
  watchedAt!: Date;
}
