import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter } from 'nodemailer';
import { Notification } from '../../notification/entities/notification.entity';
import { UtilService } from '../../shared/services/utils.service';
import { UserRepository } from '../../auth/repositories/user.repository';

@Injectable()
export class EmailService {
  private readonly mailFrom: string | undefined;
  private readonly _logger = new Logger(EmailService.name);

  constructor(
    @Inject('MAIL_TRANSPORT') private readonly transport: Transporter,
    private readonly cfg: ConfigService,
    private readonly utilService: UtilService,
    private readonly userRepository: UserRepository,
  ) {
    this.mailFrom = this.cfg.get<string>('MAIL_FROM');
  }

  async processNotification(payload: Partial<Notification>): Promise<void> {
    this._logger.log(
      `processNotification(email) called with payload: ${JSON.stringify(payload)}`,
    );
    const { user_id, title, body, metadata } = payload;
    if (user_id) {
      const user = await this.userRepository.getUser({
        id: user_id,
      });
      if (!user) {
        this._logger.error(`User with id ${user_id} not found`);
        throw new Error(`User with id ${user_id} not found`);
      }
      const subject = metadata
        ? this.utilService.parseTemplate(title as string, metadata)
        : title;

      const template = metadata
        ? this.utilService.parseTemplate(body as string, metadata)
        : body;
      await this.transport.sendMail({
        from: this.mailFrom,
        to: user.email,
        subject,
        text: template,
        html: template,
      });
    }
  }
}
