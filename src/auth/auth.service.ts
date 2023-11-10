import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { LoginForm } from './interfaces/loginForm';
import { SECRET_KEY } from '../../constants';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/services/email.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private jwtService: JwtService,
        private emailService: EmailService,
        private configService: ConfigService
    ) {}

    async register(registrationData: User) {
        const options: FindOneOptions<User> = {
          where: { login: registrationData.login }
        };
        const user = await this.userRepository.findOne(options);

        if(user) {
            throw new ForbiddenException('User is already exist');
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
            throw new NotFoundException('User not found');
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

    async forgotPassword(email: string): Promise<string> {
        const options: FindOneOptions<User> = {
            where: { email: email }
        };
        const user = await this.userRepository.findOne(options);

        if(user) {
            const payload = {username: user.login, sub: user.id};
            const accessToken = await this.jwtService.signAsync(payload);
            const clientAppUrl = this.configService.get<string>('CLIENT_APP_URL');
            return await this.emailService.sendResetPasswordEmail(
                email,
                `${clientAppUrl}/reset-password/${accessToken}`
            );
        } else {
            throw new NotFoundException('User not found');
        }
    }

    async resetPassword( newPassword: string,accessToken: string): Promise<string> {
        const payload = await this.jwtService.verifyAsync(accessToken,{secret: SECRET_KEY});
        //will be added validation for token expiration
        const options: FindOneOptions<User> = {
            where: { id: payload.sub }
        };
        const user = await this.userRepository.findOne(options);

        if(user) {
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(newPassword, salt);
            user.password = hash;
            await this.userRepository.save(user);
            return 'Password was reseted';
        } else {
            throw new NotFoundException('User not found');
        }
    }

}
