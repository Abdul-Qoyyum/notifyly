import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationPreference } from './entities/notification-preference.entity';
import { NotificationController } from './controllers/notification.controller';
import { NotificationRepository } from './repositories/notification.repository';
import { NotificationService } from './services/notification.service';
import { NotificationSubscriber } from './subscribers/notification.subscriber';
import { TransportModule } from '../transport/transport.module';
import { BullModule } from '@nestjs/bullmq';
import { NotificationQueue } from './queues/notification.queue';
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notificationQueue',
    }),
    TypeOrmModule.forFeature([NotificationPreference, Notification]),
    TransportModule,
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    NotificationRepository,
    NotificationSubscriber,
    NotificationQueue,
  ],
})
export class NotificationModule {}
