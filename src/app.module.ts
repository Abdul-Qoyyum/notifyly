import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransportModule } from './core/modules/transport/transport.module';
import { DatabaseModule } from './database.module';
import { NotificationModule } from './core/modules/notification/notification.module';
import { UserModule } from './core/modules/auth/auth.module';
import { CommandModule } from './core/commands/command.module';
import { SharedModule } from './core/modules/shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
    UserModule,
    NotificationModule,
    TransportModule,
    CommandModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
