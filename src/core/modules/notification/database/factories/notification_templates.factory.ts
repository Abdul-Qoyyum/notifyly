import { setSeederFactory } from 'typeorm-extension';
import { NotificationTemplate } from '../../entities/notification-template.entity';

export default setSeederFactory(NotificationTemplate, () => {
  const notificationPreference = new NotificationTemplate();
  return notificationPreference;
});
