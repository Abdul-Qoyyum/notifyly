import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { NotificationEventDto } from '../dtos';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import CoreController from 'src/core/http/controllers/core.controller';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Auth } from '../../auth/decorators';
import { User } from '../../auth/entities/user.entity';

@ApiTags('notifications')
@Controller('notifications')
@ApiBearerAuth()
export class NotificationController extends CoreController {
  private readonly logger = new Logger(NotificationController.name);

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
  emitNotificationEvent(
    @Body() notificationEventDto: NotificationEventDto,
    @Auth() user: Partial<User>,
  ) {
    try {
      const response = this.notificationService.emitNotificationEvent(
        notificationEventDto,
        user,
      );
      return this.successResponse(
        'Notification successfully queued for processing',
        response,
      );
    } catch (error) {
      return this.exceptionResponse(error);
    }
  }

  @ApiOperation({
    summary: 'Get user notification preferences settings',
    description:
      'Get the notification preferences settings for the authenticated user, the `is_enabled` field indicates the active channels by which the user would be able to retrieve notifications',
  })
  @Get('user-notification-preferences')
  async getUserNotificationPreferences(@Auth() user: Partial<User>) {
    try {
      const response =
        await this.notificationService.getUserNotificationPreferences(user);
      return this.successResponse(
        'Notification preferences successfully retrieved',
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
      await this.notificationService.handleNotificationEvent(
        notificationEventDto,
        queryRunner.manager,
      );
      await queryRunner.commitTransaction();
      this.logger.log('Notification successfully queued for processing');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error?.message);
    } finally {
      await queryRunner.release();
    }
  }
}
