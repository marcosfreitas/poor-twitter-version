import { Response } from 'express';

import { Body, Controller, Post, Res } from '@nestjs/common';

@Controller('v1/posts')
export class PostsController {
  @Post()
  public async create(
    @Body() request: Record<string, any>,
    @Res() response: Response,
  ) {
    console.log(request);
  }
}
