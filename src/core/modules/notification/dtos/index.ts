import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MaxLength,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsObject,
} from 'class-validator';
import { NotificationChannelEnum } from '../enums';

export class NotificationEventDto {
  @ApiProperty({ example: 'invoice.created' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  event_type: string;

  @ApiProperty({ example: 'New Invoice Created (#{invoiceId})' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ApiProperty({
    example: `Your invoice #{invoiceId} has been created. The amount is #{amount}`,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  body: string;

  @ApiProperty({ example: NotificationChannelEnum.EMAIL })
  @IsEnum(NotificationChannelEnum)
  @IsNotEmpty()
  @MaxLength(10)
  channel: NotificationChannelEnum;

  @ApiProperty({
    example: { invoiceId: '12345', amount: 100.0 },
    required: false,
  })
  @IsOptional()
  @IsObject({ message: 'Metadata must be a valid JSON object' })
  metadata?: Record<string, any> | null;

  @IsString()
  @IsOptional()
  user_id?: string;
}

export class PaginationResponseDto<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}
