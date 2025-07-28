import { setSeederFactory } from 'typeorm-extension';
import { User } from '../../entities/user.entity';

export default setSeederFactory(User, (faker) => {
  const user = new User();
  user.name = faker.person.fullName();
  user.email = faker.internet.email();
  user.phone = faker.phone.number();
  return user;
});
