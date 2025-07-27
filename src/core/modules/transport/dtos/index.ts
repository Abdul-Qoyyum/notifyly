import { ApiProperty } from '@nestjs/swagger';

export class SendMailDto {
  @ApiProperty({ example: 'john@example.com' })
  email: string;
}

export class SendCodeDto {
  @ApiProperty({ example: '+2349060134627' })
  phone_number: string;

  @ApiProperty({ example: '3310' })
  code: string;
}
