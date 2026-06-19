import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Plan } from './entities/plan.entity';
import { Subscription } from './entities/subscription.entity';
import { PaymentEvent } from './entities/payment-event.entity';
import { MercadopagoService } from './mercadopago.service';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { WebhookController } from './webhook.controller';
import { WebhookStripeController } from './webhook-stripe.controller';
import { StripeService } from './stripe.service';
import { User } from '../users/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Plan, Subscription, PaymentEvent, User]), ConfigModule],
  providers: [SubscriptionsService, MercadopagoService, StripeService],
  controllers: [SubscriptionsController, WebhookController, WebhookStripeController],
  exports: [MercadopagoService, StripeService],
})
export class SubscriptionsModule {}