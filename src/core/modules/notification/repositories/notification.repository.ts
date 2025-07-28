import { Injectable } from '@nestjs/common';
import { Notification } from '../entities/notification.entity';
import { EntityManager } from 'typeorm';
import { SendNotificationDto } from '../dtos';
// import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NotificationRepository {
  constructor() {} // @InjectRepository(Notification) notification: Notification

  async save(data: SendNotificationDto, manager: EntityManager) {
    const notification = manager.create(Notification, data);
    return await manager.save(notification);
  }
}
