import { INestApplication } from '@nestjs/common';
import UserWithNotificationPreferenceSeeder from '../../src/core/modules/auth/database/seeders/user_with_notification_preference.seeder';
import { DataSource } from 'typeorm';

export class DataTestUtils {
  static async seedData(app: INestApplication) {
    const dataSource = app.get<DataSource>(DataSource);
    const seeder = app.get<UserWithNotificationPreferenceSeeder>(
      UserWithNotificationPreferenceSeeder,
    );
    await seeder.run(dataSource);
  }

  static async clearData(app: INestApplication) {
    const dataSource = app.get<DataSource>(DataSource);
    await dataSource.query('PRAGMA foreign_keys = OFF');
    try {
      const entities = dataSource.entityMetadatas;
      for (const entity of entities) {
        const repository = dataSource.getRepository(entity.name);
        await repository.query(`DELETE FROM "${entity.tableName}";`);
      }
    } finally {
      await dataSource.query('PRAGMA foreign_keys = ON');
    }
  }
}
