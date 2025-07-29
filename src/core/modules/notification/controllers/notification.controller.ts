import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { NotificationEventDto } from '../dtos';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import CoreController from 'src/core/http/controllers/core.controller';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController extends CoreController {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly notificationService: NotificationService,
  ) {
    super();
  }

  @ApiOperation({
    summary: 'Simulates how a notification event is emitted',
    description:
      'Demonstrates how to emit a notification event from different microservices connected to the same RabbitMQ(queue) Broker',
  })
  @Post('event-emit')
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
    @Payload() notificationEventDto: NotificationEventDto,
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
