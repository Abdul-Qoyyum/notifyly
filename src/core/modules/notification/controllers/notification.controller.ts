import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { NotificationEventDto } from '../dtos';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import CoreController from 'src/core/http/controllers/core.controller';
import { EventPattern } from '@nestjs/microservices';

@Controller('notifications')
export class NotificationController extends CoreController {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly notificationService: NotificationService,
  ) {
    super();
  }

  @Post('event/emit')
  emitNotificationEvent(@Body() notificationEventDto: NotificationEventDto) {
    try {
      const response =
        this.notificationService.emitNotificationEvent(notificationEventDto);
      return this.successResponse(
        'Notification successfully queued for processing',
        response,
      );
    } catch (error) {
      return this.exceptionResponse(error);
    }
  }

  @EventPattern('notification.*')
  async handleNotificationEvent(
    @Body() notificationEventDto: NotificationEventDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const response = await this.notificationService.handleNotificationEvent(
        notificationEventDto,
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
