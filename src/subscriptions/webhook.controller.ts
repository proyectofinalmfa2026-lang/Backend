import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription, SubscriptionStatus } from './entities/subscription.entity';
import { PaymentEvent } from './entities/payment-event.entity';
import { User } from '../users/entities/users.entity';
import { MercadopagoService } from './mercadopago.service';

@Controller('webhooks/mercadopago')
export class WebhookController {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepo: Repository<Subscription>,
    @InjectRepository(PaymentEvent)
    private paymentEventRepo: Repository<PaymentEvent>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private mercadopagoService: MercadopagoService,
  ) {}

  @Post()
  @HttpCode(200)
  async handleWebhook(@Body() body: any) {
    if (body.type !== 'preapproval') return { received: true };

    const preapprovalId = body.data?.id;
    if (!preapprovalId) return { received: true };

    const subscription = await this.subscriptionRepo.findOne({
      where: { mpPreapprovalId: preapprovalId },
      relations: { user: true },
    });
    if (!subscription) return { received: true };

    const event = this.paymentEventRepo.create({
      subscription,
      type: body.type,
      mpEventId: String(body.id),
      payload: body,
      processed: false,
    });
    await this.paymentEventRepo.save(event);

    const preapproval = await this.mercadopagoService.getPreapproval(preapprovalId);

    if (preapproval.status === 'authorized') {
      subscription.status = SubscriptionStatus.ACTIVE;
      subscription.nextBillingDate = new Date(preapproval.next_payment_date!);

      if (subscription.user) {
        await this.userRepo.update(subscription.user.id, { isPremium: true });
      }
    } else if (preapproval.status === 'cancelled') {
      subscription.status = SubscriptionStatus.CANCELLED;
      subscription.cancelledAt = new Date();

      if (subscription.user) {
        await this.userRepo.update(subscription.user.id, { isPremium: false });
      }
    } else if (preapproval.status === 'paused') {
      subscription.status = SubscriptionStatus.EXPIRED;

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
