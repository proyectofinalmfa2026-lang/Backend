import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/users.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  content!: string;

  @Column()
  score!: number;

  @Column({
    default: false,
  })
  spoiler!: boolean;

  @Column()
  tmdbMovieId!: number;

  @ManyToOne(() => User)
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}