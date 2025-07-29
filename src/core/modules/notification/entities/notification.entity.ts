import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../auth/entities/user.entity';
import { NotificationChannelEnum, NotificationStatusEnum } from '../enums';

@Entity('notifications')
export class Notification {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('text', { name: 'user_id' })
  user_id: string;

  @Column('text', { name: 'event_type' })
  event_type: string;

  @Column('text')
  title: string;

  @Column('text')
  body: string;

  @Column({
    type: 'enum',
    enum: NotificationStatusEnum,
    default: NotificationStatusEnum.PENDING,
  })
  status: NotificationStatusEnum;

  @Column({
    type: 'enum',
    enum: NotificationChannelEnum,
  })
  channel: NotificationChannelEnum;

  @Column('text', { nullable: true })
  error_messages?: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @Column('timestamp', { name: 'delivered_at', nullable: true })
  delivered_at: Date | null;

  @Column('simple-json', { nullable: true })
  metadata: Record<string, any> | null;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
