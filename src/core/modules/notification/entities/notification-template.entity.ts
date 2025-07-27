import { Entity, PrimaryColumn, Column } from 'typeorm';
import { NotificationChannel } from '../enums';

@Entity('notification_templates')
export class NotificationTemplate {
  @PrimaryColumn('varchar', { name: 'event_type', length: 36 })
  event_type: string;

  @Column('text', { name: 'default_title' })
  default_title: string;

  @Column('text', { name: 'default_body' })
  default_body: string;

  @Column('boolean', {
    name: 'is_user_visible',
    default: true,
  })
  isUserVisible: boolean;

  @Column('simple-json')
  allowed_channels: NotificationChannel[];
}
