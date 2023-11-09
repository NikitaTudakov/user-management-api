import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { LoginForm } from './interfaces/loginForm';
import { SECRET_KEY } from '../../constants';
import * as bcrypt from 'bcrypt';

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
            const password = registrationData.password;
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(password, salt);
            registrationData.password = hash;
            const newUser = await this.userRepository.save(registrationData);
            const payload = {username: newUser.login, sub: newUser.id};
            const accessToken = await this.jwtService.signAsync(payload);
            return { accessToken }
        }
    }
      
    async login(loginData: LoginForm) {
        const options: FindOneOptions<User> = {
            where: { login: loginData.login }
        };
        const user = await this.userRepository.findOne(options);

        if(user) {
            const password = loginData.password;
            const hash = user.password;
            const isMatch = await bcrypt.compare(password, hash);
            if(isMatch) {
                const payload = {username: user.login, sub: user.id};
                const accessToken = await this.jwtService.signAsync(payload);
                return { accessToken }
            } else {
                throw new UnauthorizedException('Invalid credentials');
            }
        } else {
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    async validateToken(accessToken: string) {
        try {
            await this.jwtService.verifyAsync(accessToken,{secret: SECRET_KEY});
            return true
        } catch {
            return false
        }
    }
}
