import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/domain/contracts/user.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../contracts/dtos/create-post.dto';
import { Post } from '../contracts/post.entity';
import { PostCommand } from './post.command';

@Injectable()
export class CreatePostCommand extends PostCommand {
  constructor(
    @InjectRepository(User)
    protected usersRepository: Repository<User>,
    @InjectRepository(Post)
    protected postsRepository: Repository<Post>,
    protected configService: ConfigService,
  ) {
    super(usersRepository, postsRepository, configService);
  }

  public async execute(request: CreatePostDto): Promise<Post> {
    const user = await this.usersRepository.findOne({
      where: { uuid: request.userUuid },
    });

    if (!user) {
      throw new NotFoundException(
        `User with uuid ${request.userUuid} not found`,
      );
    }

    if (!(await this.hasPostDailyLimit(user))) {
      throw new BadRequestException(
        `User with uuid ${request.userUuid} has reached daily post limit`,
      );
    }

    // Will try to retrieve the post that will be reposted
    let repostedPost: Post;

    if (request.repostedUuid) {
      repostedPost = await this.postsRepository.findOne({
        where: { uuid: request.repostedUuid },
      });

      if (!repostedPost) {
        throw new NotFoundException(
          `Reposted Post with uuid ${request.repostedUuid} not found`,
        );
      }

      const isUserCreatingAQuote = !!request.content.trim().length;

      if (!isUserCreatingAQuote && this.isARepost(repostedPost)) {
        throw new BadRequestException(
          `You can't repost a post that was already reposted`,
        );
      } else if (isUserCreatingAQuote && this.isAQuote(repostedPost)) {
        throw new BadRequestException(
          `You can't quote a post that was already quoted`,
        );
      }
    }

    // The mass assignment vulnerability isn't possible here.
    // So, updating existent record isn't possible due to the fact
    // that the constructor of Post is defining only these 3 properties below.
    const post = new Post(user, request.content, repostedPost?.id);

    return this.postsRepository.save(post);
  }
}
