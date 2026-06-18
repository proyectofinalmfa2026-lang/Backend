import { Controller, Post, Body, Headers, HttpCode } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription, SubscriptionStatus } from './entities/subscription.entity';
import { PaymentEvent } from './entities/payment-event.entity';
import { MercadopagoService } from './mercadopago.service';

@Controller('webhooks/mercadopago')
export class WebhookController {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepo: Repository<Subscription>,
    @InjectRepository(PaymentEvent)
    private paymentEventRepo: Repository<PaymentEvent>,
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
    } else if (preapproval.status === 'cancelled') {
      subscription.status = SubscriptionStatus.CANCELLED;
      subscription.cancelledAt = new Date();
    } else if (preapproval.status === 'paused') {
      subscription.status = SubscriptionStatus.EXPIRED;
    }

    await this.subscriptionRepo.save(subscription);

    event.processed = true;
    await this.paymentEventRepo.save(event);

    return { received: true };
  }
}