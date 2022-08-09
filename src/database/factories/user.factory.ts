import { setSeederFactory } from 'typeorm-extension';
import { User } from 'src/modules/user/domain/contracts/user.entity';

export default setSeederFactory(User, (faker) => {
  const user = new User();

  user.username = faker.internet.userName();

  return user;
});
