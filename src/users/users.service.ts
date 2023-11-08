import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginForm } from './interfaces/loginForm';
import * as jwt from 'jsonwebtoken';

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

  async register(registrationData: User) {
    const options: FindOneOptions<User> = {
      where: { login: registrationData.login }
    };
  
    const user = await this.userRepository.findOne(options);
    if(user) {
      throw new NotFoundException('User is already exist');
    } else {
      await this.userRepository.save(registrationData);
      return true
    }
    // Создание пользователя и сохранение его в базе данных
    // Хеширование пароля перед сохранением
    // Генерация JWT токена и его возврат
  }
  
  async login(loginData: LoginForm) {
    const options: FindOneOptions<User> = {
      where: { ...loginData }
    };
  
    const user = await this.userRepository.findOne(options);
    if(!user) {
      throw new NotFoundException('User not found');
    } else {
      const payload = {username: user.login, sub: user.id};
      const accessToken = jwt.sign(payload, '123123213213', { expiresIn: '24h' });
      return { accessToken }
    }
  }
}
