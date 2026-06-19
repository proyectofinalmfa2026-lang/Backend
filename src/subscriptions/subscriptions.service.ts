import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription, SubscriptionStatus } from './entities/subscription.entity';
import { Plan } from './entities/plan.entity';
import { User } from '../users/entities/users.entity';
import { MercadopagoService } from './mercadopago.service';
import { StripeService } from './stripe.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepo: Repository<Subscription>,
    @InjectRepository(Plan)
    private planRepo: Repository<Plan>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private mercadopagoService: MercadopagoService,
    private stripeService: StripeService,
  ) {}

  async subscribe(userId: number, userEmail: string) {
    const plan = await this.planRepo.findOneBy({ name: 'premium' });
    if (!plan) throw new NotFoundException('Plan premium no encontrado');

    const { preapprovalId, initPoint } = await this.mercadopagoService.createPreapproval({
      userId: String(userId),
      userEmail,
    });

    const subscription = this.subscriptionRepo.create({
      user: { id: userId } as any,
      plan,
      mpPreapprovalId: preapprovalId,
      status: SubscriptionStatus.PENDING,
    });
    await this.subscriptionRepo.save(subscription);

    return { initPoint };
  }

  async subscribeWithStripe(userId: number, userEmail: string, userName: string) {
    const plan = await this.planRepo.findOneBy({ name: 'premium' });
    if (!plan) throw new NotFoundException('Plan premium no encontrado');

    const customer = await this.stripeService.createCustomer(userEmail, userName);

    const stripeSubscription = await this.stripeService.createSubscription(
      customer.id,
      process.env.STRIPE_PRICE_ID!,
    );

    const subscription = this.subscriptionRepo.create({
      user: { id: userId } as any,
      plan,
      mpPreapprovalId: stripeSubscription.id,
      status: SubscriptionStatus.PENDING,
    });
    await this.subscriptionRepo.save(subscription);

    const invoice = stripeSubscription.latest_invoice as any;
    return {
      subscriptionId: stripeSubscription.id,
      clientSecret: invoice?.payment_intent?.client_secret,
    };
  }

  async getMySubscription(userId: number) {
    return this.subscriptionRepo.findOne({
      where: { user: { id: userId } as any },
      relations: { plan: true },
      order: { startDate: 'DESC' },
    });
  }

  async cancelSubscription(userId: number) {
    const subscription = await this.subscriptionRepo.findOne({
      where: { user: { id: userId } as any, status: SubscriptionStatus.ACTIVE },
    });
    if (!subscription) throw new NotFoundException('No tenés una suscripción activa');

    await this.mercadopagoService.cancelPreapproval(subscription.mpPreapprovalId);

    subscription.status = SubscriptionStatus.CANCELLED;
    subscription.cancelledAt = new Date();
    await this.subscriptionRepo.save(subscription);

    await this.userRepo.update(userId, { isPremium: false });

    return { message: 'Suscripción cancelada correctamente' };
  }

  async confirmSubscription(preapprovalId: string) {
    const subscription = await this.subscriptionRepo.findOne({
      where: { mpPreapprovalId: preapprovalId },
      relations: { user: true },
    });
    if (!subscription) throw new NotFoundException('Suscripción no encontrada');

    const preapproval = await this.mercadopagoService.getPreapproval(preapprovalId);

    if (preapproval.status === 'authorized') {
      subscription.status = SubscriptionStatus.ACTIVE;
      subscription.nextBillingDate = new Date(preapproval.next_payment_date!);
      await this.subscriptionRepo.save(subscription);

      if (subscription.user) {
        await this.userRepo.update(subscription.user.id, { isPremium: true });
      }

      return { message: 'Suscripción activada correctamente' };
    }

    return { message: `Estado de la suscripción: ${preapproval.status}` };
  }
}