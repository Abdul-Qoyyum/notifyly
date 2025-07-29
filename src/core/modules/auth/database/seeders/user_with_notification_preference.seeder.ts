import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../entities/user.entity';
import { NotificationPreference } from 'src/core/modules/notification/entities/notification-preference.entity';
import { NotificationChannelEnum } from 'src/core/modules/notification/enums';

export default class UserWithNotificationPreferenceSeeder implements Seeder {
  private readonly _logger = new Logger(
    UserWithNotificationPreferenceSeeder.name,
  );

  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    const userCount = await userRepository.count();
    this._logger.log(`userCount: ${userCount}`);
    if (userCount > 0) {
      return;
    }
    const notificationPeferenceRepository = dataSource.getRepository(
      NotificationPreference,
    );

    const firstUserData = userRepository.create({
      name: 'Mateo',
      email: 'mateo@example.com',
      phone: '+2347278608429',
    });
    const firstUser = await userRepository.save(firstUserData);

    const channels = Object.values(NotificationChannelEnum);

    const firstUserChannels = channels.map((channel) => ({
      id: uuidv4(),
      user: firstUser,
      channel,
      is_enabled: true,
    }));
    await notificationPeferenceRepository.insert(firstUserChannels);

    const secondUserData = userRepository.create({
      name: 'Janet',
      email: 'janet@example.com',
      phone: '+2348191246377',
    });

    const secondUser = await userRepository.save(secondUserData);

    const secondUserChannels = channels.map((channel) => ({
      id: uuidv4(),
      user: secondUser,
      channel,
      is_enabled: true,
    }));
    await notificationPeferenceRepository.insert(secondUserChannels);
  }
}
