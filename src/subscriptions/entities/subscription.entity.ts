import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, OneToMany, JoinColumn, CreateDateColumn
} from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { Plan } from './plan.entity';
import { PaymentEvent } from './payment-event.entity';

export enum SubscriptionStatus {
  ACTIVE    = 'active',
  PENDING   = 'pending',
  CANCELLED = 'cancelled',
  EXPIRED   = 'expired',
}

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.subscriptions)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Plan, (plan) => plan.subscriptions)
  @JoinColumn({ name: 'planId' })
  plan!: Plan;

  @Column({ nullable: true })
  mpPreapprovalId!: string; // ID que devuelve MercadoPago

  @Column({ type: 'enum', enum: SubscriptionStatus, default: SubscriptionStatus.PENDING })
  status!: SubscriptionStatus;

  @CreateDateColumn()
  startDate!: Date;

  @Column({ nullable: true })
  nextBillingDate!: Date;

  @Column({ nullable: true })
  cancelledAt!: Date;

  @OneToMany(() => PaymentEvent, (event) => event.subscription)
  paymentEvents!: PaymentEvent[];
}