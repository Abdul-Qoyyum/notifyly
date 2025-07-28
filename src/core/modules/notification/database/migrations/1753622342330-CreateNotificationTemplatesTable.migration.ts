import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateNotificationTemplatesTable1753622342330
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'notification_templates',
        columns: [
          {
            name: 'event_type',
            type: 'varchar',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'default_title',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'default_body',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'is_user_visible',
            type: 'boolean',
            isNullable: false,
            default: true,
          },
          {
            name: 'allowed_channels',
            type: 'json',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'notification_templates',
      new TableIndex({
        name: 'IDX_NOTIFICATION_TEMPLATES_VISIBILITY',
        columnNames: ['is_user_visible'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'notification_templates',
      'IDX_NOTIFICATION_TEMPLATES_VISIBILITY',
    );
    await queryRunner.dropTable('notification_templates');
  }
}
