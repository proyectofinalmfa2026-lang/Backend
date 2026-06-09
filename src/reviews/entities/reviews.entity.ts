import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Movie } from '../../movies/entities/movies.entity';
import { User } from '../../users/entities/users.entity';
import { Comment } from '../../comments/entities/comments.entity';

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

  @OneToMany(
  () => Comment,
  (comment) => comment.review,
)
comments!: Comment[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}