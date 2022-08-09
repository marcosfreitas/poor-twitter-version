import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/domain/contracts/user.entity';
import { MoreThan, Repository } from 'typeorm';
import { Post } from '../contracts/post.entity';

export abstract class PostCommand {
  constructor(
    @InjectRepository(User)
    protected usersRepository: Repository<User>,
    @InjectRepository(Post)
    protected postsRepository: Repository<Post>,
    protected configService: ConfigService,
  ) {}

  public async hasPostDailyLimit(user: User): Promise<boolean> {
    const oneDayTimestamp = 24 * 60 * 60 * 1000;
    const todayTimestamp = Date.now();
    const yesterday = new Date(todayTimestamp - oneDayTimestamp);

    console.log(new Date(todayTimestamp), yesterday);

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

  public isOriginalPost(post: Post): boolean {
    return !post.repostedId;
  }

  public isARepost(post: Post): boolean {
    return post.repostedId && post.content.trim().length === 0;
  }

  public isAQuote(post: Post): boolean {
    return post.repostedId && post.content.trim().length > 0;
  }
}
