import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransportModule } from './core/modules/transport/transport.module';
import { DatabaseModule } from './database.module';
import { NotificationModule } from './core/modules/notification/notification.module';
import { UserModule } from './core/modules/auth/auth.module';
import { CommandModule } from './core/commands/command.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    DatabaseModule,
    UserModule,
    NotificationModule,
    TransportModule,
    CommandModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
