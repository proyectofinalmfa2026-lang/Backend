import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/users.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column('text')
  message!: string;

  @Column({
    default: false,
  })
  read!: boolean;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;
}