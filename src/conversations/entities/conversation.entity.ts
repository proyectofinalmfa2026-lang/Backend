import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/users.entity';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(
    () => User,
    { eager: true },
  )
  participant1!: User;

  @ManyToOne(
    () => User,
    { eager: true },
  )
  participant2!: User;

  @CreateDateColumn()
  createdAt!: Date;
}