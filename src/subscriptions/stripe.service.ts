import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: InstanceType<typeof Stripe>;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY')!,
      {
        apiVersion: '2026-05-27.dahlia',
      },
    );
  }

  async createCustomer(email: string, name: string): Promise<any> {
    return this.stripe.customers.create({ email, name });
  }

  async createSubscription(customerId: string, priceId: string): Promise<any> {
    return this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
    });
  }

  async cancelSubscription(subscriptionId: string): Promise<any> {
    return this.stripe.subscriptions.cancel(subscriptionId);
  }

  async getSubscription(subscriptionId: string): Promise<any> {
    return this.stripe.subscriptions.retrieve(subscriptionId);
  }

  async getPaymentIntentClientSecret(
    subscriptionId: string,
  ): Promise<string | null> {
    const subscription = await this.stripe.subscriptions.retrieve(
      subscriptionId,
    );

    if (!subscription.latest_invoice) return null;

    const invoiceId =
      typeof subscription.latest_invoice === 'string'
        ? subscription.latest_invoice
        : subscription.latest_invoice.id;

    const invoice = await this.stripe.invoices.retrieve(invoiceId, {
      expand: ['payment_intent'],
    });

    if ((invoice as any).payment_intent) {
      return (invoice as any).payment_intent.client_secret ?? null;
    }

    const price = await this.stripe.prices.retrieve(
      process.env.STRIPE_PRICE_ID!,
    );

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: price.unit_amount!,
      currency: price.currency,
      customer: subscription.customer as string,
      metadata: {
        subscription_id: subscriptionId,
        invoice_id: invoiceId,
      },
    });

    return paymentIntent.client_secret;
  }

  constructWebhookEvent(
    payload: Buffer,
    signature: string,
    secret: string,
  ): any {
    return this.stripe.webhooks.constructEvent(payload, signature, secret);
  }
}
