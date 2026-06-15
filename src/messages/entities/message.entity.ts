import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/users.entity';
import { Conversation } from '../../conversations/entities/conversation.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  content!: string;

  @ManyToOne(
    () => User,
    { eager: true },
  )
  sender!: User;

  @ManyToOne(
    () => Conversation,
    { eager: true },
  )
  conversation!: Conversation;

  @CreateDateColumn()
  createdAt!: Date;
}