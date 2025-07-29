import { Inject, Injectable, Logger } from '@nestjs/common';
import { NotificationRepository } from '../repositories/notification.repository';
import { NotificationEventDto } from '../dtos';
import { EntityManager } from 'typeorm';
import { NotificationStatusEnum } from '../enums';
import { Notification } from '../entities/notification.entity';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { ClientProxy } from '@nestjs/microservices';
import { NOTIFYLY_QUEUE } from 'src/core/constants';

@Injectable()
export class NotificationService {
  private readonly defaultJobOptions: {
    attempts: number;
    backoff: { type: string; delay: number };
    removeOnComplete: boolean;
    removeOnFail: number;
  };
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectQueue('notificationQueue') private readonly notificationQueue: Queue,
    private readonly notificationRepository: NotificationRepository,
    @Inject(NOTIFYLY_QUEUE) private readonly client: ClientProxy,
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

  /**
   *
   * @param notificationEventDto
   * @returns
   */
  emitNotificationEvent(notificationEventDto: NotificationEventDto) {
    this.logger.log(
      `notificationEventDto: ${JSON.stringify(notificationEventDto)}`,
    );
    const { event_type, title, body, channel, metadata } = notificationEventDto;
    const notificationData = {
      user_id: '6915b2cd-d986-4d97-ad99-442492aaa32b', //test
      event_type,
      title,
      body,
      status: NotificationStatusEnum.PENDING,
      channel,
      metadata: metadata || null,
    };
    return this.client.emit(`notification.${channel}`, notificationData);
  }

  async handleNotificationEvent(
    notificationEventDto: NotificationEventDto,
    manager: EntityManager,
  ) {
    this.logger.log(
      `notificationEventDto: ${JSON.stringify(notificationEventDto)}`,
    );
    const { event_type, title, body, channel, metadata } = notificationEventDto;

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
      const notificationPreference =
        await this.notificationRepository.getNotificationPreference({
          user_id,
          is_enabled: true,
          channel,
        });
      if (notificationPreference) {
        this.logger.log(
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
