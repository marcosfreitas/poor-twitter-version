import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '@modules/post/domain/contracts/post.entity';
import { PostsController } from '@modules/post/application/controllers/post.controller';
import { CreatePostCommand } from '@modules/post/domain/commands/create-post.command';
import { UserModule } from '@modules/user/user.module';
import { ListPostCommand } from '@modules/post/domain/commands/list-post.command';

// @todo add subscriber to generate uuid
@Module({
  imports: [TypeOrmModule.forFeature([Post]), forwardRef(() => UserModule)],
  providers: [CreatePostCommand, ListPostCommand],
  controllers: [PostsController],
  exports: [TypeOrmModule],
})
export class PostModule {}
