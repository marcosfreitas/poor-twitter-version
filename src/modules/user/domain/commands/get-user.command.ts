import { User } from '@modules/user/domain/contracts/user.entity';

import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '@modules/post/domain/contracts/post.entity';
import { ExecutionResult } from '@shared/domain/contracts/responses/execution-result';
import { Repository } from 'typeorm';

@Injectable()
export class GetUserCommand {
  constructor(
    @InjectRepository(User)
    protected usersRepository: Repository<User>,
    @InjectRepository(Post)
    protected postsRepository: Repository<Post>,
    protected configService: ConfigService,
  ) {}

  /**
   * By default filter by DateFrom and/or DateTo only.
   * If userUuid is provided then include it in the filter.
   */
  public async execute(userUuid: string): Promise<ExecutionResult> {
    const user = await this.usersRepository.findOne({
      where: { uuid: userUuid },
    });

    if (!user) {
      throw new NotFoundException(`User with uuid ${userUuid} not found`);
    }

    const joinedAt = this.formatDate(user.createdAt);
    const updatedAt = this.formatDate(user.updatedAt);

    const [data, totalPosts] = await this.postsRepository.findAndCount({
      where: {
        user: { id: user.id },
      },
      withDeleted: false,
    });

    return {
      data: {
        profile: { ...user, joinedAt, updatedAt },
        postsPublished: totalPosts,
      },
    };
  }

  private formatDate(date: Date): string {
    const month = new Intl.DateTimeFormat('en-US', {
      month: 'long',
    }).format(date);
    const day = new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
    }).format(date);
    const year = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
    }).format(date);

    return `${month} ${day}, ${year}`;
  }
}
