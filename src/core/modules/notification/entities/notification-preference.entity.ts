import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { NotificationChannelEnum } from '../enums';
import { User } from '../../auth/entities/user.entity';

@Entity('notification_preferences')
export class NotificationPreference {
  @PrimaryColumn('varchar', { name: 'user_id', length: 36 })
  user_id: string;

  @Column({
    type: 'enum',
    enum: NotificationChannelEnum,
    default: NotificationChannelEnum.EMAIL,
  })
  channel: NotificationChannelEnum;

  @ManyToOne(() => User, (user) => user.notificationPreferences)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
