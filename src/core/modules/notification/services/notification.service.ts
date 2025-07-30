import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { NotificationRepository } from '../repositories/notification.repository';
import { NotificationEventDto } from '../dtos';
import { EntityManager } from 'typeorm';
import { NotificationChannelEnum, NotificationStatusEnum } from '../enums';
import { Notification } from '../entities/notification.entity';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { ClientProxy } from '@nestjs/microservices';
import { NOTIFYLY_QUEUE } from 'src/core/constants';
import { User } from '../../auth/entities/user.entity';
import { PaginationParams } from '../interfaces';

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
  emitNotificationEvent(
    notificationEventDto: NotificationEventDto,
    user: Partial<User>,
  ) {
    this.logger.log(
      `notificationEventDto: ${JSON.stringify(notificationEventDto)}`,
    );
    const { event_type, title, body, channel, metadata } = notificationEventDto;
    const notificationData = {
      user_id: user.id,
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

    if (notificationEventDto.user_id) {
      const { user_id } = notificationEventDto;
      const notificationData = {
        user_id,
        event_type,
        title,
        body,
        status: NotificationStatusEnum.PENDING,
        channel,
        metadata: metadata || null,
      };

      await this.notificationRepository.saveNotification(
        notificationData,
        manager,
      );
    }

    return true;
  }

  async retryNotification(notificationId: string) {
    const notification = await this.notificationRepository.getNotification({
      id: notificationId,
    });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.status !== NotificationStatusEnum.FAILED) {
      throw new BadRequestException(
        'Only failed notification could be retried',
      );
    }
    await this.queueNotification(notification);
    return { notification };
  }

  async queueNotification(data: Partial<Notification>): Promise<void> {
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

  async updateNotification(payload: Partial<Notification>): Promise<void> {
    const { id } = payload;
    if (id) {
      await this.notificationRepository.updateNotificationById(id, payload);
    }
  }

  async getUserNotificationPreferences(user: Partial<User>) {
    return this.notificationRepository.getNotificationPreferences({
      user_id: user.id,
    });
  }

  async getInAppNotifications(options: PaginationParams, user: Partial<User>) {
    const { page = 1, limit = 10 } = options || {};
    const skip = (page - 1) * limit;

    const query: Partial<Notification> | Record<string, string> = {
      user_id: user.id,
      channel: NotificationChannelEnum.IN_APP,
    };

    const { data, total } = await this.notificationRepository.getNotifications(
      query,
      {
        skip,
        limit,
      },
    );
    const lastPage = Math.ceil(total / limit);
    return {
      notifications: data,
      meta: {
        total,
        page,
        lastPage,
      },
    };
  }

  async getNotifications(options: PaginationParams) {
    const { page = 1, limit = 10, ...rest } = options || {};
    const skip = (page - 1) * limit;
    const query: Partial<Notification> | Record<string, string> = rest;
    const { data, total } = await this.notificationRepository.getNotifications(
      query,
      {
        skip,
        limit,
      },
    );
    const lastPage = Math.ceil(total / limit);
    return {
      notifications: data,
      meta: {
        total,
        page,
        lastPage,
      },
    };
  }
}
