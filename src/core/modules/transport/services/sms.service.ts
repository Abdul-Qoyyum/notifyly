import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { SendCodeDto } from '../dtos';
import { Notification } from '../../notification/entities/notification.entity';
import { UserRepository } from '../../auth/repositories/user.repository';
import { UtilService } from '../../shared/services/utils.service';

@Injectable()
export class SmsService {
  private readonly _logger = new Logger(SmsService.name);

  constructor(
    private readonly twilio: Twilio,
    private readonly configService: ConfigService,
    private readonly utilService: UtilService,
    private readonly userRepository: UserRepository,
  ) {}

  async sendCode(sendCodeDto: SendCodeDto) {
    const { phone_number, code } = sendCodeDto;
    return this.twilio.messages.create({
      from: this.configService.get<string>('TWILIO_FROM'),
      to: phone_number,
      body: `Your code is ${code}`,
    });
  }

  async processNotification(payload: Partial<Notification>): Promise<void> {
    this._logger.log(
      `processNotification(sms) called with payload: ${JSON.stringify(payload)}`,
    );
    const { user_id, body, metadata } = payload;
    if (user_id) {
      const user = await this.userRepository.getUser({
        id: user_id,
      });
      if (!user) {
        this._logger.error(`User with id ${user_id} not found`);
        throw new Error(`User with id ${user_id} not found`);
      }
      const template = metadata
        ? this.utilService.parseTemplate(body as string, metadata)
        : body;

      await this.twilio.messages.create({
        from: this.configService.get<string>('TWILIO_FROM'),
        to: user.phone,
        body: template,
      });
    }
  }
}
