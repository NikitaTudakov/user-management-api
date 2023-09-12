import { Controller, Get } from '@nestjs/common';
import { UsersController } from './users/users.controller';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}
