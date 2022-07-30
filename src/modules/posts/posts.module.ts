import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './domain/contracts/post.entity';
import { PostsController } from './application/controllers/posts.controller';
import { PostsService } from './application/services/posts.service';

// @todo add subscriber to generate uuid
@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
