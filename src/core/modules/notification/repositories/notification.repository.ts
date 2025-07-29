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

  async save(
    data: Partial<Notification>,
    manager: EntityManager | null = null,
  ) {
    const entity = this.notificationRepository.create(data);
    return manager
      ? await manager.save(entity)
      : await this.notificationRepository.save(entity);
  }
}
