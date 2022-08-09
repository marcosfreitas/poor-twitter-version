import { Response } from 'express';

import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
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
  public async create(
    @Body() request: CreatePostDto,
    @Res() response: Response,
  ) {
    const result = await this.createCommand.execute(request);

    response.status(201).json({
      data: result,
    });
  }

  @Get()
  public async list(@Query() request: ListPostDto, @Res() response: Response) {
    const result = await this.listCommand.execute(request);

    response.status(200).json(result);
  }
}
