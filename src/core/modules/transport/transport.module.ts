import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { TransportController } from './controllers/transport.controller';
import { EmailService } from './services/email.service';
import { SmsService } from './services/sms.service';
import { Twilio } from 'twilio';
import { UserModule } from '../auth/auth.module';

@Module({
  imports: [UserModule],
  controllers: [TransportController],
  providers: [
    EmailService,
    SmsService,
    {
      provide: Twilio,
      useFactory: (cfg: ConfigService) =>
        new Twilio(
          cfg.get<string>('TWILIO_ACCOUNT_SID'),
          cfg.get<string>('TWILIO_AUTH_TOKEN'),
        ),
      inject: [ConfigService],
    },
    {
      provide: 'MAIL_TRANSPORT',
      useFactory: (cfg: ConfigService) => {
        const host = cfg.get<string>('MAIL_HOST');
        const port = cfg.get<number>('MAIL_PORT');
        const user = cfg.get<string>('MAIL_USERNAME');
        const pass = cfg.get<string>('MAIL_PASSWORD');
        if (!host || !port || !user || !pass) {
          throw new Error('Missing required mail configuration');
        }
        return nodemailer.createTransport({
          host,
          port,
          auth: {
            user,
            pass,
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [EmailService, SmsService],
})
export class TransportModule {}
