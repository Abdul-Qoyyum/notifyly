import { setSeederFactory } from 'typeorm-extension';
import { NotificationPreference } from 'src/core/modules/notification/entities/notification-preference.entity';
import { NotificationChannel } from 'src/core/modules/notification/enums';

export default setSeederFactory(NotificationPreference, () => {
  const notification = new NotificationPreference();
  notification.channel = NotificationChannel.EMAIL;
  return notification;
});
