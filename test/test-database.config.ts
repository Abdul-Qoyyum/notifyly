import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Notification } from '../src/core/modules/notification/entities/notification.entity';
import { NotificationPreference } from '../src/core/modules/notification/entities/notification-preference.entity';
import { UserAuth } from '../src/core/modules/auth/entities/user_auths.entity';
import { User } from '../src/core/modules/auth/entities/user.entity';
import { Role } from '../src/core/modules/auth/entities/role.entity';

export const testDbConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: ':memory:',
  entities: [Role, User, UserAuth, Notification, NotificationPreference],
  synchronize: true,
  dropSchema: true,
};
