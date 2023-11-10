import { Controller, Post,Body, UnauthorizedException, NotFoundException,UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';
import { LoginForm } from './interfaces/loginForm';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/register')
    register(@Body() userDto: User): Promise<UnauthorizedException | { accessToken: string; }> {
        return this.authService.register(userDto);
    }
  
    @Post('/login')
    login(@Body() userCredentials: LoginForm): Promise<NotFoundException | { accessToken: string; }> {
        return this.authService.login(userCredentials);
    }

    @Post('/validation')
    validate(@Body() data: {accessToken: string}): Promise<boolean> {
        return this.authService.validateToken(data.accessToken);
    }

    @Post('/forgot-password')
    forgotPassword(@Body() data: {email: string}): Promise<NotFoundException | string> {
        return this.authService.forgotPassword(data.email);
    }

    @Post('/reset-password')
    resetPassword(@Body() data: {password: string, token: string}): Promise<UnauthorizedException | string> {
        return this.authService.resetPassword(data.password, data.token);
    }
}
