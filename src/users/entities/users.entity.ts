import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { Review } from '../../reviews/entities/reviews.entity';
import { Watchlist } from '../../watchlists/entities/watchlists.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({
    unique: true,
  })
  username!: string;

  @Column({
    unique: true,
  })
  email!: string;

  @Column({
    type: 'varchar',
    select: false,
    nullable: true,
  })
  password!: string | null;

  @Column({
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  googleId!: string | null;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  avatar!: string | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  bio!: string | null;

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

  @OneToMany(() => Review, (review) => review.user)
  reviews!: Review[];

  @OneToMany(() => Watchlist, (watchlist) => watchlist.user)
  watchlists!: Watchlist[];
}