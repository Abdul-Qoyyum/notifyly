import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';
import { AuthModule } from '../../src/core/modules/auth/auth.module';
import { TransportModule } from '../../src/core/modules/transport/transport.module';
import { NotificationModule } from '../../src/core/modules/notification/notification.module';
import { testDbConfig } from '../../test/test-database.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { SharedModule } from '../../src/core/modules/shared/shared.module';
import { CommandModule } from '../../src/core/commands/command.module';

export class TestUtils {
  static async getTestApp(modules: any[] = []): Promise<INestApplication> {
    const defaultModules = [
      ConfigModule.forRoot({ isGlobal: true }),
      TypeOrmModule.forRoot(testDbConfig),
      BullModule.forRootAsync({
        useFactory: (config: ConfigService) => ({
          connection: {
            host: config.get('REDIS_HOST'),
            port: config.get('REDIS_PORT'),
          },
        }),
        inject: [ConfigService],
      }),
      SharedModule,
      AuthModule,
      NotificationModule,
      TransportModule,
      CommandModule,
      ...modules,
    ];

    const moduleFixture = await Test.createTestingModule({
      imports: defaultModules,
    }).compile();

    const app = moduleFixture.createNestApplication();
    await app.init();
    return app;
  }

  static async closeApp(app: INestApplication): Promise<void> {
    try {
      await app.close();
    } catch (error) {
      console.error('Error during app closing:', error);
    }
  }
}
