import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { SendNotificationDto } from '../dtos';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import CoreController from 'src/core/http/controllers/core.controller';

@Controller('notifications')
export class NotificationController extends CoreController {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly notificationService: NotificationService,
  ) {
    super();
  }

  @Post()
  async sendNotification(@Body() sendNotificationDto: SendNotificationDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const response = await this.notificationService.sendNotification(
        sendNotificationDto,
        queryRunner.manager,
      );
      await queryRunner.commitTransaction();
      return this.successResponse(
        'Notification successfully queued for processing',
        response,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return this.exceptionResponse(error);
    } finally {
      await queryRunner.release();
    }
  }
}
