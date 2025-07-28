import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../repositories/notification.repository';
import { SendNotificationDto } from '../dtos';
import { EntityManager } from 'typeorm';
import { NotificationStatusEnum } from '../enums';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async sendNotification(
    sendNotificationDto: SendNotificationDto,
    manager: EntityManager,
  ) {
    const { event_type, title, body, channel, metadata } = sendNotificationDto;

    const notificationData = {
      user_id: '674d4b4f-43cd-49f3-86c3-b55750146b2c', //test
      event_type,
      title,
      body,
      status: NotificationStatusEnum.PENDING,
      channel,
      metadata: metadata || null,
    };

    return await this.notificationRepository.save(notificationData, manager);
  }
}
