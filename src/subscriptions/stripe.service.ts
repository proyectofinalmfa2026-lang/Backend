import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: InstanceType<typeof Stripe>;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY')!, {
      apiVersion: '2026-05-27.dahlia',
    });
  }

  async createCustomer(email: string, name: string): Promise<any> {
    return this.stripe.customers.create({ email, name });
  }

  async createSubscription(customerId: string, priceId: string): Promise<any> {
    return this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });
  }

  async cancelSubscription(subscriptionId: string): Promise<any> {
    return this.stripe.subscriptions.cancel(subscriptionId);
  }

  async getSubscription(subscriptionId: string): Promise<any> {
    return this.stripe.subscriptions.retrieve(subscriptionId);
  }

  constructWebhookEvent(payload: Buffer, signature: string, secret: string): any {
    return this.stripe.webhooks.constructEvent(payload, signature, secret);
  }
}