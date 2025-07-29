import { Injectable } from '@nestjs/common';
import { Notification } from '../entities/notification.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

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
