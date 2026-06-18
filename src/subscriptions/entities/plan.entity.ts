import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Subscription } from './subscription.entity';

@Entity('plans')
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string; // 'free' | 'premium'

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  price!: number; // 4.99 para premium, 0 para free

  @Column({ default: 'month' })
  interval!: string; // 'month'

  @Column({ default: true })
  isActive!: boolean;

  @OneToMany(() => Subscription, (sub) => sub.plan)
  subscriptions!: Subscription[];
}