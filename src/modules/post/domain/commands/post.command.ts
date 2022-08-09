import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/domain/contracts/user.entity';
import { PaginationCommand } from 'src/shared/domain/commands/pagination-commands';
import { MoreThan, Repository } from 'typeorm';
import { PostTypes } from '../contracts/post-types';
import { Post } from '../contracts/post.entity';

export abstract class PostCommand extends PaginationCommand {
  constructor(
    @InjectRepository(User)
    protected usersRepository: Repository<User>,
    @InjectRepository(Post)
    protected postsRepository: Repository<Post>,
    protected configService: ConfigService,
  ) {
    super();
  }

  protected async hasPostDailyLimit(user: User): Promise<boolean> {
    const oneDayTimestamp = 24 * 60 * 60 * 1000;
    const todayTimestamp = Date.now();
    const yesterday = new Date(todayTimestamp - oneDayTimestamp);

    // find all the user's posts that were created in the last 24 hours
    const posts = await this.postsRepository.find({
      where: {
        user: {
          id: user.id,
        },
        createdAt: MoreThan(yesterday),
      },
    });

    return posts.length < this.configService.get<number>('user.postDailyLimit');
  }

  protected isOriginalPost(post: Post): boolean {
    return !post.repostedId;
  }

  protected isARepost(post: Post): boolean {
    return post.repostedId && post.content.trim().length === 0;
  }

  protected isAQuote(post: Post): boolean {
    return post.repostedId && post.content.trim().length > 0;
  }

  protected mapPostTypes(data: Post[]): Post[] {
    return data.map((item) => {
      switch (true) {
        case this.isAQuote(item):
          item.type = PostTypes.QUOTE;
          break;
        case this.isARepost(item):
          item.type = PostTypes.REPOST;
          break;
        default:
          item.type = PostTypes.POST;
          break;
      }

      return item;
    });
  }
}
