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

  @Column({ nullable: true })
tmdbMovieId!: number;

@ManyToOne(() => User)
user!: User;

  @CreateDateColumn()
  createdAt!: Date;
}