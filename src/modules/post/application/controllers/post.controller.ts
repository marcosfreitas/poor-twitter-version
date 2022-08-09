import { Response } from 'express';

import { Body, Controller, Post, Res } from '@nestjs/common';
import { CreatePostDto } from '../../domain/contracts/dtos/create-post.dto';
import { CreatePostCommand } from '../../domain/commands/create-post.command';

@Controller('v1/posts')
export class PostsController {
  constructor(private command: CreatePostCommand) {}

  @Post()
  public async create(
    @Body() request: CreatePostDto,
    @Res() response: Response,
  ) {
    const result = await this.command.execute(request);

    // @todo implements a resource layer to build a proper response
    response.status(201).json({
      data: result,
    });
  }
}
