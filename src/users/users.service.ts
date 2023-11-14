import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async create(userDto: User): Promise<User> {
        const loginOptions: FindOneOptions<User> = {
            where: { login: userDto.login }
        };
        const emailOptions: FindOneOptions<User> = {
            where: { email: userDto.email }
        };

        const userWithLogin = await this.userRepository.findOne(loginOptions);
        const userWithEmail = await this.userRepository.findOne(emailOptions);

        if(userWithLogin || userWithEmail) {
            throw new BadRequestException('User is already exist');
        } else {
            const password = userDto.password;
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(password, salt);
            userDto.password = hash;
            return this.userRepository.save(userDto);
        }
    }

    findAll(): Promise<User[]> {
        return this.userRepository.find({
            select: ['id','login', 'name', 'surname', 'age', 'email', 'phoneNumber'],
        });
    }

    async update(id: string, updateUserDto: Partial<User>) {
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

        if (user) {
            return await this.userRepository.delete(id);
        } else {
            throw new NotFoundException('User not found');
        }

    }
}
