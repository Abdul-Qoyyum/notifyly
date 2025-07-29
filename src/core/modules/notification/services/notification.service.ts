import { Injectable, Logger } from '@nestjs/common';
import { NotificationRepository } from '../repositories/notification.repository';
import { SendNotificationDto } from '../dtos';
import { EntityManager } from 'typeorm';
import { NotificationStatusEnum } from '../enums';
import { Notification } from '../entities/notification.entity';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class NotificationService {
  private readonly defaultJobOptions: {
    attempts: number;
    backoff: { type: string; delay: number };
    removeOnComplete: boolean;
    removeOnFail: number;
  };
  private readonly _logger = new Logger(NotificationService.name);

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
      user_id: '6915b2cd-d986-4d97-ad99-442492aaa32b', //test
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
    const { channel, user_id } = data;
    if (user_id) {
      console.log(`user_id: ${user_id}`);
      const notificationPreference =
        await this.notificationRepository.getNotificationPreference({
          user_id,
          is_enabled: true,
          channel,
        });
      if (notificationPreference) {
        this._logger.log(
          `Queuing notification for user ${user_id} on channel ${channel}`,
        );
        await this.notificationQueue.add(
          channel as string,
          data,
          this.defaultJobOptions,
        );
      }
    }
  }

  async saveNotification(payload: Partial<Notification>) {
    return await this.notificationRepository.save(payload);
  }
}
