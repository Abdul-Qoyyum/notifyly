import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';
import { ApiTags } from '@nestjs/swagger';
import { SendCodeDto, SendMailDto } from '../dtos';

@ApiTags('transports')
@Controller()
export class TransportController {
  constructor(
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
  ) {}

  @Post('send-welcome')
  sendWelcome(@Body() sendMailDto: SendMailDto) {
    return this.emailService.sendWelcome(sendMailDto);
  }

  @Post('send-code')
  sendCode(@Body() sendCodeDto: SendCodeDto) {
    return this.smsService.sendCode(sendCodeDto);
  }
}
