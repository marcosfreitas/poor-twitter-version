import { BadRequestException } from '@nestjs/common';
import { ListPostDto } from 'src/modules/post/domain/contracts/dtos/list-post.dto';
import { Post } from 'src/modules/post/domain/contracts/post.entity';
import {
  Between,
  FindOperator,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';

export abstract class PaginationCommand {
  protected getDateFilters(
    request: ListPostDto,
    where: FindOptionsWhere<Post>,
  ): Date | FindOperator<Date> {
    if (request.dateFrom && request.dateTo) {
      where.createdAt = Between(
        this.getDateFrom(request.dateFrom),
        this.getDateTo(request.dateTo),
      );
    } else {
      if (request.dateFrom) {
        where.createdAt = MoreThanOrEqual(this.getDateFrom(request.dateFrom));
      }

      if (request.dateTo) {
        where.createdAt = LessThanOrEqual(this.getDateTo(request.dateTo));
      }
    }

    return where.createdAt;
  }

  protected getDateFrom(date: Date) {
    const dateFrom = new Date(`${date} 00:00:00`);

    if (isNaN(dateFrom.getTime())) {
      throw new BadRequestException('Invalid dateFrom parameter');
    }

    return dateFrom;
  }

  protected getDateTo(date: Date) {
    const dateTo = new Date(`${date} 23:59:59`);

    if (isNaN(dateTo.getTime())) {
      throw new BadRequestException('Invalid dateTo parameter');
    }

    return dateTo;
  }
}
