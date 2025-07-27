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
import { NotificationStatus } from '../enums';

@Entity('notifications')
export class Notification {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('text', { name: 'user_id' })
  userId: string;

  @Column('text', { name: 'event_type' })
  eventType: string;

  @Column('text')
  title: string;

  @Column('text')
  body: string;

  @Column('text')
  status: NotificationStatus;

  @Column('text')
  channel: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @Column('timestamp', { name: 'delivered_at', nullable: true })
  delivered_at: Date | null;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
