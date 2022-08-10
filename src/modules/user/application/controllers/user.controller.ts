import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { GetUserCommand } from '../../domain/commands/get-user.command';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly getUserCommand: GetUserCommand) {}

  @Get(':uuid')
  public async get(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.getUserCommand.execute(uuid);
  }
}
