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
}
