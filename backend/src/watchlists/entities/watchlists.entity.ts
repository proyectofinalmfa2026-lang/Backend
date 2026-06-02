import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/users.entity';

@Entity('watchlists')
export class Watchlist {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  tmdbMovieId!: number;

  @ManyToOne(
    () => User,
    (user) => user.watchlist,
    {
      onDelete: 'CASCADE',
    },
  )
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;
}