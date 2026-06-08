import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Movie } from '../../movies/entities/movies.entity';
import { User } from '../../users/entities/users.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'int',
  })
  rating!: number;

  @Column({
    type: 'text',
  })
  comment!: string;

  @ManyToOne(
    () => Movie,
    (movie) => movie.reviews,
    {
      onDelete: 'CASCADE',
    },
  )
  movie!: Movie;

  @ManyToOne(
    () => User,
    (user) => user.reviews,
    {
      onDelete: 'CASCADE',
    },
  )
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}