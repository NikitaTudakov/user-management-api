import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginForm } from '../auth/interfaces/loginForm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async create(userDto: User): Promise<User> {
        const options: FindOneOptions<User> = {
            where: { login: userDto.login }
        };
        const user = await this.userRepository.findOne(options);
        
        if(user) {
            throw new NotFoundException('User is already exist');
        } else {
            return this.userRepository.save(userDto);
        }
    }

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async update(id: string, updateUserDto: User) {
        const options: FindOneOptions<User> = {
            where: { id },
        };
        const user = await this.userRepository.findOne(options);

        if (user) {
            return await this.userRepository.update(id,updateUserDto);
        } else {
            throw new NotFoundException('User not found');
        }

    }

    async remove(id: string) {
        const options: FindOneOptions<User> = {
            where: { id },
        };
        const user = await this.userRepository.findOne(options);

        if (!user) {
            return await this.userRepository.delete(id);
        } else {
            throw new NotFoundException('User not found');
        }

    }
}
