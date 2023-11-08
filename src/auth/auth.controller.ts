import { Controller, Post,Body, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';
import { LoginForm } from './interfaces/loginForm';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/register')
    register(@Body() userDto: User): Promise<boolean> {
      return this.authService.register(userDto);
    }
  
    @Post('/login')
    login(@Body() userCredentials: LoginForm): any {
      return this.authService.login(userCredentials);
    }
}
