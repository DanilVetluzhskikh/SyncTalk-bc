import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-dto';
import { LoginDto } from './dto/login-dto';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() login: LoginDto, @Res() response: Response) {
    return await this.authService.login(login, response);
  }

  @Post('register')
  async register(@Body() register: RegisterDto, @Res() response: Response) {
    return await this.authService.register(register, response);
  }

  @Post('logout')
  async logout(@Res() response: Response) {
    response.clearCookie('auth_token');
    response.clearCookie('refresh_token');
    return response
      .status(200)
      .json({ message: 'Вы успешно вышли из системы' });
  }

  @Post('refresh')
  async refresh(@Req() request: Request, @Res() response: Response) {
    return await this.authService.refresh(request, response);
  }
}
