import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';

import { User } from '../../users/entities/users.entity';

@Entity()
@Unique(['follower', 'following'])
export class Follower {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(
    () => User,
    {
      onDelete: 'CASCADE',
    },
  )
  follower!: User;

  @ManyToOne(
    () => User,
    {
      onDelete: 'CASCADE',
    },
  )
  following!: User;

  @CreateDateColumn()
  createdAt!: Date;
}