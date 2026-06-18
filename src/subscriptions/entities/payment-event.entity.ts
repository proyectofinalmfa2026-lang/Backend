import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn
} from 'typeorm';
import { Subscription } from './subscription.entity';

@Entity('payment_events')
export class PaymentEvent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Subscription, (sub) => sub.paymentEvents)
  @JoinColumn({ name: 'subscriptionId' })
  subscription!: Subscription;

  @Column()
  type!: string; // 'payment', 'cancellation', 'renewal', etc.

  @Column()
  mpEventId!: string; // ID del evento en MP

  @Column({ type: 'jsonb' })
  payload!: object; // guardamos el webhook completo

  @Column({ default: false })
  processed!: boolean;

  @CreateDateColumn()
  receivedAt!: Date;
}