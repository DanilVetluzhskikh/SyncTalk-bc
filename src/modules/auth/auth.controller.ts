import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-dto';
import { JwtAuth } from 'src/middleware/guards/jwt-auth.guard';
import { LoginDto } from './dto/login-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuth)
  @Post('login')
  async login(@Body() login: LoginDto) {
    return this.authService.login(login);
  }

  @Post('register')
  async register(@Body() register: RegisterDto) {
    return this.authService.register(register);
  }
}
