import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';

import { User } from '../../users/entities/users.entity';
import { Review } from '../../reviews/entities/reviews.entity';

@Entity()
@Unique(['user', 'review'])
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  user!: User;

  @ManyToOne(() => Review, {
    onDelete: 'CASCADE',
  })
  review!: Review;

  @CreateDateColumn()
  createdAt!: Date;
}