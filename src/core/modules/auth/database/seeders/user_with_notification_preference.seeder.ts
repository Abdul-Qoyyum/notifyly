import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Logger } from '@nestjs/common';
import { hash, genSalt } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../entities/user.entity';
import { NotificationPreference } from '../../../notification/entities/notification-preference.entity';
import { NotificationChannelEnum, RoleEnum } from '../../../notification/enums';
import { Role } from '../../entities/role.entity';
import { UserAuth } from '../../entities/user_auths.entity';

export default class UserWithNotificationPreferenceSeeder implements Seeder {
  private readonly _logger = new Logger(
    UserWithNotificationPreferenceSeeder.name,
  );

  private async hashPassword(pwd: string) {
    const salt = await genSalt();
    return hash(pwd, salt);
  }

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
    const roleRepository = dataSource.getRepository(Role);
    const userAuth = dataSource.getRepository(UserAuth);
    const passwordHash = await this.hashPassword('password');

    const adminRoleData = roleRepository.create({
      name: RoleEnum.ADMIN,
    });
    const adminRole = await roleRepository.save(adminRoleData);
    const firstUserData = userRepository.create({
      name: 'Mateo',
      email: 'mateo@example.com',
      phone: '+2347278608429', //Dummy number
      role: adminRole,
    });
    const firstUser = await userRepository.save(firstUserData);
    const firstUserAuthData = userAuth.create({
      user: firstUser,
      password_hash: passwordHash,
    });
    await userAuth.save(firstUserAuthData);
    const channels = Object.values(NotificationChannelEnum);
    const firstUserChannels = channels.map((channel) => ({
      id: uuidv4(),
      user: firstUser,
      channel,
      is_enabled: true,
    }));
    await notificationPeferenceRepository.insert(firstUserChannels);

    //second user
    const userRoleData = roleRepository.create({
      name: RoleEnum.USER,
    });
    const userRole = await roleRepository.save(userRoleData);

    const secondUserData = userRepository.create({
      name: 'Janet',
      email: 'janet@example.com',
      phone: '+2348191246377', //Dummy number
      role: userRole,
    });
    const secondUser = await userRepository.save(secondUserData);
    //user auth
    const secondUserAuthData = userAuth.create({
      user: secondUser,
      password_hash: passwordHash,
    });
    await userAuth.save(secondUserAuthData);

    //channels
    const secondUserChannels = channels.map((channel) => ({
      id: uuidv4(),
      user: secondUser,
      channel,
      is_enabled: true,
    }));
    await notificationPeferenceRepository.insert(secondUserChannels);
  }
}
