import { User } from '@modules/user/domain/contracts/user.entity';
import { PaginatedResult } from '@shared/domain/contracts/pagination/paginated-result';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { ListPostDto } from '../contracts/dtos/list-post.dto';
import { Post } from '../contracts/post.entity';
import { PostCommand } from './post.command';

@Injectable()
export class ListPostCommand extends PostCommand {
  constructor(
    @InjectRepository(User)
    protected usersRepository: Repository<User>,
    @InjectRepository(Post)
    protected postsRepository: Repository<Post>,
    protected configService: ConfigService,
  ) {
    super(usersRepository, postsRepository, configService);
  }

  /**
   * By default filter by DateFrom and/or DateTo only.
   * If userUuid is provided then include it in the filter.
   */
  public async execute(request: ListPostDto): Promise<PaginatedResult<Post>> {
    // @todo transform to middleware
    let page = Number.parseInt(request.page);
    page = page > 0 ? page : 1;

    let take = this.configService.get<number>('pagination.pageSize');

    const requestedTake = Number.parseInt(request.take);
    take = requestedTake > 0 && requestedTake <= take ? requestedTake : take;

    const filters: FindManyOptions<Post> = {
      skip: (page - 1) * take,
      take,
      withDeleted: false,
      order: {
        createdAt: 'DESC',
      },
    };
    const where: FindOptionsWhere<Post> = {};

    where.createdAt = this.getDateFilters(request, where);

    if (request.userUuid) {
      const user = await this.usersRepository.findOne({
        where: { uuid: request.userUuid },
      });

      if (!user) {
        throw new NotFoundException(
          `User with uuid ${request.userUuid} not found`,
        );
      }

      where.user = { id: user.id };
    }

    filters.where = where;

    const [data, totalRecords] = await this.postsRepository.findAndCount(
      filters,
    );

    if (!data.length && totalRecords) {
      throw new BadRequestException(
        'No posts found for the current defined page. Check the available page range.',
      );
    }

    return {
      data: this.mapPostTypes(data),
      totalRecords,
      page,
      totalPages: Math.ceil(totalRecords / take),
    };
  }
}
