import { Repository } from 'typeorm';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { CreatePostDto } from '@modules/post/domain/contracts/dtos/create-post.dto';
import { Post } from '@modules/post/domain/contracts/post.entity';
import { PostCommand } from '@modules/post/domain/commands/post.command';
import { ExecutionResult } from '@shared/domain/contracts/responses/execution-result';
import { User } from '@modules/user/domain/contracts/user.entity';

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

  public async execute(request: CreatePostDto): Promise<ExecutionResult<Post>> {
    const user = await this.usersRepository.findOneBy({
      uuid: request.userUuid,
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
      repostedPost = await this.postsRepository.findOneBy({
        uuid: request.repostedUuid,
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

    if (!request.content && !repostedPost) {
      throw new BadRequestException(`You can't create a post without content.`);
    }

    // The mass assignment vulnerability isn't possible here.
    // So, updating existent record isn't possible due to the fact
    // that the constructor of Post is defining only these 3 properties below.
    const post = new Post(user, request.content, repostedPost?.id);

    const saved = await this.postsRepository.save(post);

    return { data: saved };
  }
}
