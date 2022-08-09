import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './domain/contracts/post.entity';
import { PostsController } from './application/controllers/post.controller';
import { PostsService } from './application/services/post.service';
import { CreatePostCommand } from './domain/commands/create-post.command';
import { UsersModule } from '../user/user.module';
import { ListPostCommand } from './domain/commands/list-post.command';

// @todo add subscriber to generate uuid
@Module({
  imports: [TypeOrmModule.forFeature([Post]), UsersModule],
  providers: [PostsService, CreatePostCommand, ListPostCommand],
  controllers: [PostsController],
  exports: [TypeOrmModule],
})
export class PostsModule {}
