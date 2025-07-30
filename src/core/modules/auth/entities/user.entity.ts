import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Notification } from '../../notification/entities/notification.entity';
import { NotificationPreference } from '../../notification/entities/notification-preference.entity';
import { Role } from './role.entity';
import { UserAuth } from './user_auths.entity';

@Entity('users')
export class User {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('varchar', { length: 255, unique: true })
  email: string;

  @Column('varchar', { length: 255 })
  phone: string;

  @Column('varchar', { name: 'role_id', length: 36 })
  role_id: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  // Relations
  @OneToOne(() => UserAuth, (user) => user.user)
  user_auth: UserAuth;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => NotificationPreference, (preference) => preference.user, {
    cascade: true,
  })
  notificationPreferences: NotificationPreference[];

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
