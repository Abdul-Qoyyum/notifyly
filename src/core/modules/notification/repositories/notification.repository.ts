import { Injectable } from '@nestjs/common';
import { Notification } from '../entities/notification.entity';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationPreference } from '../entities/notification-preference.entity';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(NotificationPreference)
    private readonly notificationPreferenceRepository: Repository<NotificationPreference>,
  ) {}

  async getNotificationPreference(
    query: FindOptionsWhere<NotificationPreference>,
  ): Promise<NotificationPreference | null> {
    return this.notificationPreferenceRepository.findOne({ where: query });
  }

  async getNotification(query: FindOptionsWhere<Notification>) {
    return await this.notificationRepository.findOne({ where: query });
  }

  async getNotificationPreferences(
    query: FindOptionsWhere<NotificationPreference>,
  ): Promise<NotificationPreference[] | []> {
    return this.notificationPreferenceRepository.find({ where: query });
  }

  async updateNotificationPeference(
    id: string,
    data: Partial<NotificationPreference>,
    manager: EntityManager,
  ) {
    return manager
      ? manager.update(NotificationPreference, id, data)
      : await this.notificationPreferenceRepository.update(id, data);
  }

  async saveNotification(data: Partial<Notification>, manager: EntityManager) {
    const entity = this.notificationRepository.create(data);
    return await manager.save(entity);
  }

  async updateNotificationById(id: string, data: Partial<Notification>) {
    return this.notificationRepository.update(id, data);
  }

  async getNotifications(
    query: Partial<Notification>,
    payload: { skip: number; limit: number },
  ) {
    const { skip, limit } = payload;

    const queryBuilder =
      this.notificationRepository.createQueryBuilder('notifications');

    Object.keys(query).forEach((key) => {
      queryBuilder.andWhere(`notifications.${key} = :${key}`, {
        [key]: query[key],
      });
    });
    queryBuilder.skip(skip).take(limit).orderBy('created_at', 'DESC');

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
    };
  }
}
