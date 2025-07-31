import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TransportModule } from './core/modules/transport/transport.module';
import { DatabaseModule } from './database.module';
import { NotificationModule } from './core/modules/notification/notification.module';
import { AuthModule } from './core/modules/auth/auth.module';
import { CommandModule } from './core/commands/command.module';
import { SharedModule } from './core/modules/shared/shared.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { THROTTLER_LIMIT, THROTTLER_TTL } from './core/constants';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: Number(THROTTLER_TTL),
          limit: Number(THROTTLER_LIMIT),
        },
      ],
    }),
    BullModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get('REDIS_HOST'),
          port: config.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    SharedModule,
    AuthModule,
    NotificationModule,
    TransportModule,
    CommandModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
