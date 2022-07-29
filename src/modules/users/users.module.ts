import { Module } from '@nestjs/common';
import { UsersService } from './application/services/users/users.service';
import { UsersController } from './application/controllers/users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/contracts/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
