import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(userDto: User): Promise<User> {
    return this.userRepository.save(userDto);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: string, updateUserDto: User) {
    const options: FindOneOptions<User> = {
      where: { id },
    };
  
    const user = await this.userRepository.findOne(options);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.userRepository.update(id,updateUserDto);

  }

  async remove(id: string) {
    const options: FindOneOptions<User> = {
      where: { id },
    };
  
    const user = await this.userRepository.findOne(options);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.userRepository.delete(id);
  }
}
