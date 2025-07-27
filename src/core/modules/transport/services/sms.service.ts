import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { SendCodeDto } from '../dtos';

@Injectable()
export class SmsService {
  constructor(
    private readonly twilio: Twilio,
    private readonly configService: ConfigService,
  ) {}

  async sendCode(sendCodeDto: SendCodeDto) {
    const { phone_number, code } = sendCodeDto;
    return this.twilio.messages.create({
      from: this.configService.get<string>('TWILIO_FROM'),
      to: phone_number,
      body: `Your code is ${code}`,
    });
  }
}
