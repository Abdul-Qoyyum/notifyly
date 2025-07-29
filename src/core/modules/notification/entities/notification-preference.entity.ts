import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { NotificationChannelEnum } from '../enums';
import { User } from '../../auth/entities/user.entity';

@Entity('notification_preferences')
export class NotificationPreference {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column('varchar', { name: 'user_id', length: 36 })
  user_id: string;

  @Column({
    type: 'enum',
    enum: NotificationChannelEnum,
    default: NotificationChannelEnum.EMAIL,
  })
  channel: NotificationChannelEnum;

  @Column({ default: true })
  is_enabled: boolean;

  @ManyToOne(() => User, (user) => user.notificationPreferences)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
