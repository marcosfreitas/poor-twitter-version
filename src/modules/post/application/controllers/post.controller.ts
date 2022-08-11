import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { CreatePostDto } from '../../domain/contracts/dtos/create-post.dto';
import { CreatePostCommand } from '../../domain/commands/create-post.command';
import { ListPostDto } from '../../domain/contracts/dtos/list-post.dto';
import { ListPostCommand } from '../../domain/commands/list-post.command';

// @todo implements a resource layer to build a proper response
@Controller('v1/posts')
export class PostsController {
  constructor(
    private createCommand: CreatePostCommand,
    private listCommand: ListPostCommand,
  ) {}

  @Post()
  @HttpCode(201)
  public async create(@Body() request: CreatePostDto) {
    return await this.createCommand.execute(request);
  }

  @Get()
  public async list(@Query() request: ListPostDto) {
    return await this.listCommand.execute(request);
  }
}
