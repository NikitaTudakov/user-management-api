import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { LoginForm } from './interfaces/loginForm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

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

        if(user) {
            const payload = {username: user.login, sub: user.id};
            const accessToken = await this.jwtService.signAsync(payload);
            return { accessToken }
        } else {
            throw new UnauthorizedException('Invalid credentials');
        }
    }
}
