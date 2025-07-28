import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../../entities/user.entity';
import { NotificationPreference } from 'src/core/modules/notification/entities/notification-preference.entity';
import { NotificationChannel } from 'src/core/modules/notification/enums';
import { Logger } from '@nestjs/common';

export default class UserWithNotificationPreferenceSeeder implements Seeder {
  private readonly _logger = new Logger(
    UserWithNotificationPreferenceSeeder.name,
  );

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const notificationPreferenceFactory = factoryManager.get(
      NotificationPreference,
    );
    const repository = dataSource.getRepository(User);
    const userCount = await repository.count();
    this._logger.log(`userCount: ${userCount}`);
    if (userCount > 0) {
      return;
    }
    const firstUserFactory = factoryManager.get(User);
    const firstUser = await firstUserFactory.save({
      name: 'Mateo',
      email: 'mateo@example.com',
      phone: '+2347278608429',
    });
    await notificationPreferenceFactory.save({
      user: firstUser,
    });

    const secondUserFactory = factoryManager.get(User);
    const secondUser = await secondUserFactory.save({
      name: 'Janet',
      email: 'janet@example.com',
      phone: '+2348191246377',
    });
    await notificationPreferenceFactory.save({
      user: secondUser,
      channel: NotificationChannel.SMS,
    });
  }
}
