import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter } from 'nodemailer';
import * as nodemailer from 'nodemailer';
import { SendMailDto } from '../dtos';

@Injectable()
export class EmailService {
  constructor(
    @Inject('MAIL_TRANSPORT') private readonly transport: Transporter,
    private readonly cfg: ConfigService,
  ) {}

  async sendWelcome(
    sendMailDto: SendMailDto,
  ): Promise<nodemailer.SentMessageInfo> {
    const { email } = sendMailDto;
    return this.transport.sendMail({
      from: this.cfg.get<string>('MAIL_FROM'),
      to: email,
      subject: 'Welcome!',
      text: 'Hello from Mailtrap sandbox 👋',
      html: '<p>Hello from <b>Mailtrap</b> sandbox 👋</p>',
    });
  }
}
