import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { NotificationTemplate } from '../../entities/notification-template.entity';
import { Logger } from '@nestjs/common';

export default class NotificationTemplatesSeeder implements Seeder {
  private readonly _logger = new Logger(NotificationTemplatesSeeder.name);

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const templates = [
      {
        event_type: 'order.shipped',
        default_title: 'Your order has shipped!',
        default_body:
          'Order #{orderId} is on its way. Tracking: {trackingNumber}',
        is_user_visible: true,
        allowed_channels: JSON.stringify(['email', 'sms', 'in_app']),
      },
      {
        event_type: 'order.delivered',
        default_title: 'Your order has been delivered!',
        default_body: 'Order #{orderId} has been delivered successfully.',
        is_user_visible: true,
        allowed_channels: JSON.stringify(['email', 'sms', 'in_app']),
      },
      {
        event_type: 'order.cancelled',
        default_title: 'Your order has been cancelled',
        default_body: 'Order #{orderId} has been cancelled.',
        is_user_visible: true,
        allowed_channels: JSON.stringify(['email', 'sms', 'in_app']),
      },
      {
        event_type: 'invoice.created',
        default_title: 'New Invoice Created',
        default_body: 'Your invoice #{invoiceId} has been created.',
        is_user_visible: true,
        allowed_channels: JSON.stringify(['email', 'sms']),
      },
    ];
    const repository = dataSource.getRepository(NotificationTemplate);
    const notificationTemplateFactory =
      factoryManager.get(NotificationTemplate);
    this._logger.log('Seeding notification templates...');
    for (const template of templates) {
      const existingTemplate = await repository.count({
        where: { event_type: template.event_type },
      });
      if (existingTemplate === 0) {
        await notificationTemplateFactory.save(template);
        this._logger.log(
          `Notification template for ${template.event_type} seeded.`,
        );
      } else {
        this._logger.log(
          `Notification template for ${template.event_type} already exists.`,
        );
      }
    }
    this._logger.log('All notification templates seeded successfully.');
  }
}
