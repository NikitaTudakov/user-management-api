import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('/new-user')
    create(@Body() userDto: User) {
        return this.usersService.create(userDto);
    }

    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Put('/:id')
    update(@Param('id') id: string, @Body() userDto: Partial<User>) {
        return this.usersService.update(id, userDto);
    }

    @Delete('/:id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}
