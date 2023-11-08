import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { LoginForm } from './interfaces/loginForm';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('user')
  create(@Body() userDto: User) {
    return this.usersService.create(userDto);
  }

  @Post('register')
  register(@Body() userDto: User): Promise<boolean> {
    return this.usersService.register(userDto);
  }

  @Post('login')
  login(@Body() userCredentials: LoginForm): any {
    return this.usersService.login(userCredentials);
  }

  @Get('/users')
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Put('user/:id')
  update(@Param('id') id: string, @Body() updateUserDto: User) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete('user/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
