import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { EmailService } from '../../transport/services/email.service';
import { SmsService } from '../../transport/services/sms.service';
import { NotificationChannelEnum, NotificationStatusEnum } from '../enums';
import { NotificationService } from '../services/notification.service';

@Processor('notificationQueue', {
  concurrency: 5,
  limiter: {
    max: 100,
    duration: 1000,
  },
})
export class NotificationQueue extends WorkerHost {
  private readonly logger = new Logger(NotificationQueue.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
    private readonly notificationService: NotificationService,
  ) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}`);
    try {
      const result = await this.handleNotificationJob(job);
      return result;
    } catch (error: any) {
      this.logger.error(`Job ${job.id} failed: ${(error as Error).message}`);
      throw error;
    }
  }

  private async handleNotificationJob(job: Job): Promise<void> {
    switch (job.name as NotificationChannelEnum) {
      case NotificationChannelEnum.EMAIL:
        await this.emailService.processNotification(job.data);
        break;
      case NotificationChannelEnum.SMS:
        return this.smsService.processNotification(job.data);
      case NotificationChannelEnum.IN_APP:
        this.logger.log(`in_app notification handled: ${job.name}`);
        break;
      default:
        this.logger.warn(`Unknown job type: ${job.name}`);
        throw new Error(`Unknown job type: ${job.name}`);
    }
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: Job) {
    this.logger.log(`Job ${job.id} completed successfully`);
    await this.notificationService.updateNotification({
      ...job.data,
      status: NotificationStatusEnum.DELIVERED,
      delivered_at: new Date(),
    });
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job.id} failed: ${error.message}`);
    await this.notificationService.updateNotification({
      ...job.data,
      status: NotificationStatusEnum.FAILED,
      error_messages: error.message,
    });
  }

  @OnWorkerEvent('active')
  async onProgress(job: Job, progress: number) {
    this.logger.debug(`Job ${job.id} active: ${progress}%`);
    await this.notificationService.updateNotification({
      ...job.data,
      status: NotificationStatusEnum.PROCESSING,
    });
  }
}
