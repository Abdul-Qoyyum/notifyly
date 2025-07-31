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
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NOTIFYLY_QUEUE, RABBITMQ_URL } from '../../../core/constants';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notificationQueue',
    }),
    ClientsModule.register([
      {
        name: NOTIFYLY_QUEUE,
        transport: Transport.RMQ,
        options: {
          urls: [RABBITMQ_URL],
          queue: `${NOTIFYLY_QUEUE}`,
          queueOptions: {
            durable: true,
          },
          wildcards: true,
        },
      },
    ]),
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
