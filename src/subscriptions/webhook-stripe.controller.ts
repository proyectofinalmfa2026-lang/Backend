import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription, SubscriptionStatus } from './entities/subscription.entity';
import { PaymentEvent } from './entities/payment-event.entity';
import { User } from '../users/entities/users.entity';

@Controller('webhooks/stripe')
export class WebhookStripeController {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepo: Repository<Subscription>,
    @InjectRepository(PaymentEvent)
    private paymentEventRepo: Repository<PaymentEvent>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  @Post()
  @HttpCode(200)
  async handleWebhook(@Body() body: any) {
    const relevantEvents = [
      'customer.subscription.updated',
      'customer.subscription.deleted',
    ];
    if (!relevantEvents.includes(body.type)) return { received: true };

    const stripeSubscriptionId = body.data?.object?.id;
    if (!stripeSubscriptionId) return { received: true };

    const subscription = await this.subscriptionRepo.findOne({
      where: { mpPreapprovalId: stripeSubscriptionId },
      relations: { user: true },
    });
    if (!subscription) return { received: true };

    const event = this.paymentEventRepo.create({
      subscription,
      type: body.type,
      mpEventId: body.id,
      payload: body,
      processed: false,
    });
    await this.paymentEventRepo.save(event);

    const status = body.data?.object?.status;

    if (status === 'active' || status === 'trialing') {
      subscription.status = SubscriptionStatus.ACTIVE;
      if (subscription.user) {
        await this.userRepo.update(subscription.user.id, { isPremium: true });
      }
    } else if (status === 'canceled' || status === 'incomplete_expired' || status === 'past_due') {
      subscription.status = SubscriptionStatus.CANCELLED;
      subscription.cancelledAt = new Date();
      if (subscription.user) {
        await this.userRepo.update(subscription.user.id, { isPremium: false });
      }
    }

    await this.subscriptionRepo.save(subscription);

    event.processed = true;
    await this.paymentEventRepo.save(event);

    return { received: true };
  }
}
