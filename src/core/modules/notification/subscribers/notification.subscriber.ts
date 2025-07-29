import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  DataSource,
} from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { NotificationService } from '../services/notification.service';

@EventSubscriber()
export class NotificationSubscriber
  implements EntitySubscriberInterface<Notification>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly notificationService: NotificationService,
  ) {
    dataSource.subscribers.push(this);
  }

  /**
   * Listen to the `Notification` entity.
   */
  listenTo() {
    return Notification;
  }

  /**
   * Called after a `Notification` entity is inserted.
   */
  async afterInsert(event: InsertEvent<Notification>) {
    await this.notificationService.queueNotification(event.entity);
  }
}
