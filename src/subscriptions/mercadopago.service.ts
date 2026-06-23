import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, PreApproval } from 'mercadopago';

@Injectable()
export class MercadopagoService {
  private preApproval: PreApproval;

  constructor(private configService: ConfigService) {
    const token = this.configService.get<string>('MP_ACCESS_TOKEN');
    const client = new MercadoPagoConfig({ accessToken: token! });
    this.preApproval = new PreApproval(client);
  }

  async createPreapproval(data: {
    userEmail: string;
    userId: string;
  }) {
    const response = await this.preApproval.create({
      body: {
        reason: 'CineSphere Premium',
        auto_recurring: {
          frequency: 1,
          frequency_type: 'months',
          transaction_amount: 5000,
          currency_id: 'ARS',
        },
        back_url: `${this.configService.get('FRONTEND_URL')}/subscription/result`,
        notification_url: `${this.configService.get('API_URL')}/webhooks/mercadopago`,
        payer_email: data.userEmail,
        external_reference: data.userId,
        status: 'pending',
      } as any,
    });

    return {
      preapprovalId: response.id,
      initPoint: response.init_point,
    };
  }

  async getPreapproval(preapprovalId: string) {
    return this.preApproval.get({ id: preapprovalId });
  }

  async cancelPreapproval(preapprovalId: string) {
    return this.preApproval.update({
      id: preapprovalId,
      body: { status: 'cancelled' },
    });
  }
}
