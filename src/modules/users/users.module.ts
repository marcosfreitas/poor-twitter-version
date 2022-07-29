import { Module } from '@nestjs/common';
import { UsersService } from './application/services/users/users.service';
import { UsersController } from './application/controllers/users/users.controller';

@Module({
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
