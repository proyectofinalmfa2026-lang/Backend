import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { OneToMany } from 'typeorm';
import { Review } from '../../reviews/entities/reviews.entity';
import { Watchlist } from '../../watchlists/entities/watchlists.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    unique: true,
  })
  username!: string;

  @Column({
    unique: true,
  })
  email!: string;

  @Column({
    select: false,
  })
  password!: string;

  @Column({
    nullable: true,
  })
  googleId!: string;

  @Column({
    nullable: true,
  })
  avatar!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  bio!: string;

  @Column({
    default: 'user',
  })
  role!: string;

  @Column({
    default: false,
  })
  isPremium!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;


}