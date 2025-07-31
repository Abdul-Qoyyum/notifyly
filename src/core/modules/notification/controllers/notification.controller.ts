import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { NotificationEventDto, ToggleNotificationPreferenceDto } from '../dtos';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import CoreController from 'src/core/http/controllers/core.controller';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Auth } from '../../auth/decorators';
import { User } from '../../auth/entities/user.entity';
import { PaginationParams } from '../interfaces';
import {
  NotificationChannelEnum,
  NotificationStatusEnum,
  RoleEnum,
} from '../enums';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators';

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
    summary: 'Get `in_app` notifications for the account',
    description: 'Allows the user to get `in_app` notifications',
  })
  @Get('in-app')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getInAppNotifications(
    @Query() paginationParams: PaginationParams,
    @Auth() user: Partial<User>,
  ) {
    try {
      const response = await this.notificationService.getInAppNotifications(
        paginationParams,
        user,
      );
      return this.successResponse(
        'Notification successfully retrieved',
        response,
      );
    } catch (error) {
      return this.exceptionResponse(error);
    }
  }

  @ApiOperation({
    summary: 'Get all notifications for the admin',
    description:
      'Allows the admin to get all notifications, the admin can also filter by the `status` and the `channel`.',
  })
  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    enum: Object.values(NotificationStatusEnum),
  })
  @ApiQuery({
    name: 'channel',
    required: false,
    type: String,
    enum: Object.values(NotificationChannelEnum),
  })
  async getAdminNotifications(@Query() paginationParams: PaginationParams) {
    try {
      const response =
        await this.notificationService.getNotifications(paginationParams);
      return this.successResponse(
        'Notification successfully retrieved',
        response,
      );
    } catch (error) {
      return this.exceptionResponse(error);
    }
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
    summary: 'Allows the admin to retry `pending` or `failed` notification',
    description:
      'Allows the admin to retry the pending or failed notification based on the notification id \
      <br/> Notification could remain at the `pending` stage if the user disable his/her notification channel for that notification\
      <br/> Use the `notificationId` from the `GET /api/notifications/admin` API',
  })
  @Post('retry/:notificationId')
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async retryNotification(@Param('notificationId') notificationId: string) {
    try {
      const response =
        await this.notificationService.retryNotification(notificationId);
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
      "Get the notification preferences settings for the authenticated user, the `is_enabled` field indicates the active channels by which the user would be able to retrieve notifications,\
      <br/> if `is_enabled` value is true, the user would be able to receive notifications on that channel, \
      <br/> if `is_enabled` value is false, users won't be able to receive notifications on  that channel",
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

  @ApiOperation({
    summary: 'Toggles the user notification preference settings',
    description:
      'Use the `id` returned from the `GET /api/notifications/user-notification-preferences` as `:notificationPreferenceId` for the authenticaded user',
  })
  @Put('toggleNotificationPreference/:notificationPreferenceId')
  async toggleNotificationPreference(
    @Param('notificationPreferenceId') notificationPreferenceId: string,
    @Payload() toggleNotificationPreferenceDto: ToggleNotificationPreferenceDto,
    @Auth() user: Partial<User>,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const response =
        await this.notificationService.toggleNotificationPreference(
          notificationPreferenceId,
          toggleNotificationPreferenceDto,
          user,
          queryRunner.manager,
        );
      await queryRunner.commitTransaction();
      this.logger.log('Notification prefence settings successfully updated');
      return this.successResponse(
        'Notification prefence settings successfully updated',
        response,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error?.message);
    } finally {
      await queryRunner.release();
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
