import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../repositories/notification.repository';
import { SendNotificationDto } from '../dtos';
import { EntityManager } from 'typeorm';
import { NotificationStatusEnum } from '../enums';
import { Notification } from '../entities/notification.entity';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class NotificationService {
  defaultJobOptions: {
    attempts: number;
    backoff: { type: string; delay: number };
    removeOnComplete: boolean;
    removeOnFail: number;
  };
  constructor(
    @InjectQueue('notificationQueue') private readonly notificationQueue: Queue,
    private readonly notificationRepository: NotificationRepository,
  ) {
    this.defaultJobOptions = {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: true,
      removeOnFail: 100,
    };
  }

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

  async queueNotification(data: Partial<Notification>) {
    const { channel } = data;
    await this.notificationQueue.add(
      channel as string,
      data,
      this.defaultJobOptions,
    );
  }

  async saveNotification(payload: Partial<Notification>) {
    return await this.notificationRepository.save(payload);
  }
}
