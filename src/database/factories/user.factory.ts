import { setSeederFactory } from 'typeorm-extension';
import { User } from '@modules/user/domain/contracts/user.entity';
import { randomUUID } from 'crypto';

export default setSeederFactory(User, (faker) => {
  const user = new User(randomUUID(), faker.name.firstName());

  return user;
});
