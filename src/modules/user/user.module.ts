import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from '../post/post.module';
import { UsersController } from './application/controllers/user.controller';
import { UsersService } from './application/services/user.service';
import { GetUserCommand } from './domain/commands/get-user.command';
import { User } from './domain/contracts/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => PostModule)],
  providers: [UsersService, GetUserCommand],
  controllers: [UsersController],
  exports: [TypeOrmModule],
})
export class UserModule {}
