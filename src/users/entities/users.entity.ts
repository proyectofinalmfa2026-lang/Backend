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
import { Comment } from '../../comments/entities/comments.entity';
import { Like } from '../../likes/entities/likes.entity';
import { Notification } from '../../notifications/entities/notifications.entity';
import { Follower } from '../../followers/entities/followers.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';

import { UserRole } from '../enums/user-role.enum';

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
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Column({
    default: false,
  })
  isPremium!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(
    () => Review,
    (review) => review.user,
  )
  reviews!: Review[];

  @OneToMany(() => Subscription, (sub) => sub.user)
subscriptions!: Subscription[];


  @OneToMany(
    () => Watchlist,
    (watchlist) => watchlist.user,
  )
  watchlists!: Watchlist[];

  @OneToMany(
    () => Comment,
    (comment) => comment.user,
  )
  comments!: Comment[];

  @OneToMany(
    () => Like,
    (like) => like.user,
  )
  likes!: Like[];

  @OneToMany(
    () => Notification,
    (notification) => notification.user,
  )
  notifications!: Notification[];

  @OneToMany(
  () => Follower,
  (follower) => follower.following,
)
followers!: Follower[];

@OneToMany(
  () => Follower,
  (follower) => follower.follower,
)
following!: Follower[];
}