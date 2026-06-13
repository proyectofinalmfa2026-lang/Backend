import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
  ) {}

  async sendNotificationEmail(
    email: string,
    title: string,
    message: string,
  ) {
    await this.mailerService.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: title,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>${title}</h2>
          <p>${message}</p>
          <hr />
          <p><strong>CineSphere</strong></p>
        </div>
      `,
    });
  }
}
